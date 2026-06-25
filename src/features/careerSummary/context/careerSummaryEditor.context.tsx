import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import type { CareerSummary } from '../model/careerSummary.types';
import { defaultCareerSummary } from '../model/careerSummary.defaults';
import { loadCareerSummary, saveCareerSummary } from '../model/careerSummary.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';

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
};

const CareerSummaryEditorContext = createContext<CareerSummaryEditorState | null>(null);

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

    const resetCareerSummary = useCallback(() => {
        reset();
    }, [reset]);

    const saveCareerSummaryWithValidation = useCallback(
        async (opts?: { silent?: boolean }) => {
            await save(opts);
        },
        [save],
    );

    const printCareerSummary = useCallback(
        () => printDocument(),
        [printDocument],
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
            totalValidationErrorCount: 0,
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
