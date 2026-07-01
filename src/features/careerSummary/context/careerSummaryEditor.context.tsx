import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import type { CareerSummary } from '../model/careerSummary.types';
import { defaultCareerSummary } from '../model/careerSummary.defaults';
import { loadCareerSummary, saveCareerSummary } from '../model/careerSummary.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import {
    CAREER_SUMMARY_EXPERIENCE_FIELDS,
    validateCareerSummary,
    validateCareerSummaryExperience,
    type CareerSummaryExperienceField,
    type CareerSummaryExperienceErrorMap,
} from '../model/careerSummary.validation';
import { toast } from 'sonner';

type CareerSummaryEditorState = {
    careerSummaryId: string;
    document: CareerSummary;
    careerSummary: CareerSummary;
    setDocument: (next: CareerSummary) => void;
    setCareerSummary: (next: CareerSummary) => void;
    save: (opts?: { silent?: boolean }) => Promise<void>;
    reset: () => void;
    printDocument: () => Promise<void>;
    printCareerSummary: () => Promise<void>;
    previewRef: React.RefObject<HTMLElement | null>;
    resetVersion: number;
    totalValidationErrorCount: number;
    isDirty: boolean;
    isExporting: boolean;
    isSaving: boolean;
    lastSavedAt: number | null;
    experienceErrors: CareerSummaryExperienceErrorMap;
    touchCareerSummary: (
        sectionId: string,
        field: CareerSummaryExperienceField,
        nextSummary?: CareerSummary,
    ) => void;
    revalidateExperience: (
        sectionId: string,
        field: CareerSummaryExperienceField,
        nextSummary?: CareerSummary,
    ) => void;
};

const CareerSummaryEditorContext = createContext<CareerSummaryEditorState | null>(null);

const getExperienceFieldKey = (
    sectionId: string,
    field: CareerSummaryExperienceField,
) => `${sectionId}:${field}`;

export function CareerSummaryEditorProvider({
    documentId,
    children,
}: {
    documentId: string;
    children: React.ReactNode;
}) {
    const careerSummaryId = documentId;
    const getCareerSummaryPrintFileName = useCallback((careerSummary: CareerSummary) => {
        const title = careerSummary.title.trim() || 'career-summary';
        return `${title}.pdf`;
    }, []);

    const {
        document: careerSummary,
        setDocument: setCareerSummary,
        save,
        reset,
        printDocument,
        previewRef,
        resetVersion,
        isDirty,
        isExporting,
        isSaving,
        lastSavedAt,
    } = useDocumentEditorCore({
        documentId: careerSummaryId,
        loadDocument: loadCareerSummary,
        saveDocument: saveCareerSummary,
        createDefaultDocument: defaultCareerSummary,
        getPrintFileName: getCareerSummaryPrintFileName,
    });

    const [experienceErrors, setExperienceErrors] = useState<CareerSummaryExperienceErrorMap>({});
    const [touchedExperienceFields, setTouchedExperienceFields] = useState<Set<string>>(
        () => new Set(),
    );

    const setExperienceFieldError = useCallback(
        (
            sectionId: string,
            field: CareerSummaryExperienceField,
            message?: string,
        ) => {
            setExperienceErrors((prev) => ({
                ...prev,
                [sectionId]: {
                    ...(prev[sectionId] ?? {}),
                    ...(message ? { [field]: message } : {}),
                },
            }));

            if (!message) {
                setExperienceErrors((prev) => {
                    const sectionErrors = { ...(prev[sectionId] ?? {}) };
                    delete sectionErrors[field];

                    if (Object.keys(sectionErrors).length === 0) {
                        const nextErrors = { ...prev };
                        delete nextErrors[sectionId];
                        return nextErrors;
                    }

                    return { ...prev, [sectionId]: sectionErrors };
                });
            }
        },
        [],
    );

    const touchCareerSummary = useCallback(
        (
            sectionId: string,
            field: CareerSummaryExperienceField,
            nextSummary = careerSummary,
        ) => {
            setTouchedExperienceFields((prev) =>
                new Set(prev).add(getExperienceFieldKey(sectionId, field)),
            );

            const experience = nextSummary.experiences.find(
                (item) => item.id === sectionId,
            );

            const message = experience
                ? validateCareerSummaryExperience(experience)[field]
                : undefined;

            setExperienceFieldError(sectionId, field, message);
        },
        [careerSummary, setExperienceFieldError],
    );

    const revalidateExperience = useCallback(
        (
            sectionId: string,
            field: CareerSummaryExperienceField,
            nextSummary = careerSummary,
        ) => {
            if (!touchedExperienceFields.has(getExperienceFieldKey(sectionId, field))) {
                return;
            }

            const experience = nextSummary.experiences.find(
                (item) => item.id === sectionId,
            );

            const message = experience
                ? validateCareerSummaryExperience(experience)[field]
                : undefined;

            setExperienceFieldError(sectionId, field, message);
        },
        [careerSummary, setExperienceFieldError, touchedExperienceFields],
    );

    const validateCareerSummaryBeforeExport = useCallback(() => {
        const result = validateCareerSummary(careerSummary);
        setExperienceErrors(result.errors);
        setTouchedExperienceFields(
            new Set(
                careerSummary.experiences.flatMap((experience) =>
                    CAREER_SUMMARY_EXPERIENCE_FIELDS.map((field) =>
                        getExperienceFieldKey(experience.id, field),
                    ),
                ),
            ),
        );

        if (!result.isValid) {
            const firstMessage =
                Object.values(result.errors)
                    .flatMap((errors) => Object.values(errors))
                    .find(Boolean) ?? '입력 정보를 확인해 주세요.';

            toast.error(firstMessage);
            return false;
        }

        return true;
    }, [careerSummary]);

    const resetCareerSummary = useCallback(() => {
        reset();
        setExperienceErrors({});
        setTouchedExperienceFields(new Set());
    }, [reset]);

    const saveCareerSummaryWithValidation = useCallback(
        async (opts?: { silent?: boolean }) => {
            if (!validateCareerSummaryBeforeExport()) return;
            await save(opts);
        },
        [save, validateCareerSummaryBeforeExport],
    );

    const printCareerSummary = useCallback(
        () => printDocument(validateCareerSummaryBeforeExport),
        [printDocument, validateCareerSummaryBeforeExport],
    );

    const totalValidationErrorCount = useMemo(
        () =>
            Object.values(experienceErrors).reduce(
                (total, errors) => total + Object.keys(errors).length,
                0,
            ),
        [experienceErrors],
    );

    const value = useMemo(
        () => ({
            careerSummaryId,
            document: careerSummary,
            careerSummary,
            setDocument: setCareerSummary,
            setCareerSummary,
            save: saveCareerSummaryWithValidation,
            reset: resetCareerSummary,
            printDocument: printCareerSummary,
            printCareerSummary,
            previewRef,
            resetVersion,
            totalValidationErrorCount,
            experienceErrors,
            touchCareerSummary,
            revalidateExperience,
            isDirty,
            isExporting,
            isSaving,
            lastSavedAt,
        }),
        [
            careerSummary,
            careerSummaryId,
            setCareerSummary,
            saveCareerSummaryWithValidation,
            resetCareerSummary,
            printCareerSummary,
            previewRef,
            resetVersion,
            totalValidationErrorCount,
            experienceErrors,
            touchCareerSummary,
            revalidateExperience,
            isDirty,
            isExporting,
            isSaving,
            lastSavedAt,
        ],
    );

    return (
        <CareerSummaryEditorContext.Provider value={value}>
            {children}
        </CareerSummaryEditorContext.Provider>
    );
}

export function useCareerSummaryEditor() {
    const ctx = useContext(CareerSummaryEditorContext);
    if (!ctx) {
        throw new Error(
            'useCareerSummaryEditor must be used within CareerSummaryEditorProvider',
        );
    }
    return ctx;
}
