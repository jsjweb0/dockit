import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Resume } from '../model/resume.types';
import { loadResume, resetResume, saveResume } from '../model/resume.storage';
import { toast } from 'sonner';
import {
  exportResumeImage,
  exportResumePdf as exportResumePdfFile,
} from '../model/resume.export';
import {
  BASICS_VALIDATED_FIELDS,
  validateBasics,
  validateBasicsField,
  type BasicsFieldErrors,
  type BasicsValidatedField,
} from '../model/resume.basics.validation';
import {
  emptyResumeSectionErrors,
  SECTION_VALIDATED_FIELDS,
  validateOptionalSections,
  validateSectionItem,
  type ResumeListSection,
  type ResumeSectionErrors,
} from '../model/resume.optionalSections.validation';

type SectionFieldKey = `${ResumeListSection}:${string}:${string}`;

type ResumeEditorState = {
  resumeId: string;
  resume: Resume;
  setResume: (next: Resume) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  exportImage: () => Promise<void>;
  exportResumePdf: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  basicsErrors: BasicsFieldErrors;
  sectionErrors: ResumeSectionErrors;
  touchBasicsField: (
    field: BasicsValidatedField,
    basics?: Resume['basics'],
  ) => void;
  revalidateBasicsField: (
    field: BasicsValidatedField,
    basics?: Resume['basics'],
  ) => void;
  touchSectionField: (
    section: ResumeListSection,
    id: string,
    field: string,
    nextResume?: Resume,
  ) => void;
  revalidateSectionField: (
    section: ResumeListSection,
    id: string,
    field: string,
    nextResume?: Resume,
  ) => void;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
};

const ResumeEditorContext = createContext<ResumeEditorState | null>(null);

const emptyTouchedBasicsFields = () => new Set<BasicsValidatedField>();
const emptyTouchedSectionFields = () => new Set<SectionFieldKey>();

const getSectionFieldKey = (
  section: ResumeListSection,
  id: string,
  field: string,
): SectionFieldKey => `${section}:${id}:${field}`;

export function ResumeEditorProvider({
  resumeId,
  children,
}: {
  resumeId: string;
  children: React.ReactNode;
}) {
  const [resume, setResume] = useState<Resume>(() => loadResume(resumeId));
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [basicsErrors, setBasicsErrors] = useState<BasicsFieldErrors>({});
  const [sectionErrors, setSectionErrors] = useState<ResumeSectionErrors>(
    emptyResumeSectionErrors,
  );
  const [touchedBasicsFields, setTouchedBasicsFields] = useState(
    emptyTouchedBasicsFields,
  );
  const [touchedSectionFields, setTouchedSectionFields] = useState(
    emptyTouchedSectionFields,
  );

  const previewRef = useRef<HTMLElement | null>(null);

  const clearBasicsValidation = useCallback(() => {
    setBasicsErrors({});
    setTouchedBasicsFields(emptyTouchedBasicsFields());
  }, []);

  const clearSectionValidation = useCallback(() => {
    setSectionErrors(emptyResumeSectionErrors());
    setTouchedSectionFields(emptyTouchedSectionFields());
  }, []);

  useEffect(() => {
    setResume(loadResume(resumeId));
    setIsDirty(false);
    clearBasicsValidation();
    clearSectionValidation();
  }, [resumeId, clearBasicsValidation, clearSectionValidation]);

  const setResumeSafe = useCallback((next: Resume) => {
    setResume(next);
    setIsDirty(true);
  }, []);

  const touchBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      setTouchedBasicsFields((prev) => new Set(prev).add(field));
      const message = validateBasicsField(field, basics);
      setBasicsErrors((prev) => {
        if (!message) {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        }
        return { ...prev, [field]: message };
      });
    },
    [resume.basics],
  );

  const revalidateBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      if (!touchedBasicsFields.has(field)) return;

      const message = validateBasicsField(field, basics);
      setBasicsErrors((prev) => {
        if (!message) {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        }
        return { ...prev, [field]: message };
      });
    },
    [resume.basics, touchedBasicsFields],
  );

  const validateAllBasics = useCallback(() => {
    const result = validateBasics(resume.basics);
    setBasicsErrors(result.errors);
    setTouchedBasicsFields(new Set(BASICS_VALIDATED_FIELDS));
    return result;
  }, [resume.basics]);

  const setSectionFieldError = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      message?: string,
    ) => {
      setSectionErrors((prev) => {
        const sectionItemErrors = { ...prev[section] };
        const itemErrors = { ...(sectionItemErrors[id] ?? {}) };

        if (message) {
          itemErrors[field] = message;
        } else {
          delete itemErrors[field];
        }

        if (Object.keys(itemErrors).length > 0) {
          sectionItemErrors[id] = itemErrors;
        } else {
          delete sectionItemErrors[id];
        }

        return { ...prev, [section]: sectionItemErrors };
      });
    },
    [],
  );

  const touchSectionField = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      nextResume = resume,
    ) => {
      setTouchedSectionFields((prev) =>
        new Set(prev).add(getSectionFieldKey(section, id, field)),
      );

      const message = validateSectionItem(section, nextResume, id)[field];
      setSectionFieldError(section, id, field, message);
    },
    [resume, setSectionFieldError],
  );

  const revalidateSectionField = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      nextResume = resume,
    ) => {
      if (!touchedSectionFields.has(getSectionFieldKey(section, id, field))) {
        return;
      }

      const message = validateSectionItem(section, nextResume, id)[field];
      setSectionFieldError(section, id, field, message);
    },
    [resume, setSectionFieldError, touchedSectionFields],
  );

  const validateAllOptionalSections = useCallback(() => {
    const result = validateOptionalSections(resume);
    setSectionErrors(result.errors);
    setTouchedSectionFields(
      new Set(
        (
          Object.entries(SECTION_VALIDATED_FIELDS) as [
            ResumeListSection,
            string[],
          ][]
        ).flatMap(([section, fields]) =>
          resume[section].flatMap((item) =>
            fields.map((field) => getSectionFieldKey(section, item.id, field)),
          ),
        ),
      ),
    );
    return result;
  }, [resume]);

  const validateResumeBeforeExport = useCallback(() => {
    const basicsValidation = validateAllBasics();
    const sectionValidation = validateAllOptionalSections();

    if (basicsValidation.isValid && sectionValidation.isValid) {
      return true;
    }

    const firstMessage =
      BASICS_VALIDATED_FIELDS.map(
        (field) => basicsValidation.errors[field],
      ).find(Boolean) ??
      Object.values(sectionValidation.errors)
        .flatMap((itemErrors) =>
          Object.values(itemErrors).flatMap((errors) => Object.values(errors)),
        )
        .find(Boolean) ??
      '입력 정보를 확인해 주세요.';

    toast.error(firstMessage);
    return false;
  }, [validateAllBasics, validateAllOptionalSections]);

  const persist = useCallback(
    async (opts?: { silent?: boolean }) => {
      setIsSaving(true);
      try {
        saveResume(resumeId, resume);
        setIsDirty(false);
        setLastSavedAt(Date.now());
        if (!opts?.silent) toast.success('저장 완료');
      } catch {
        toast.error('저장에 실패했습니다.');
      } finally {
        setIsSaving(false);
      }
    },
    [resume, resumeId],
  );

  const reset = useCallback(() => {
    resetResume(resumeId);
    setResume(loadResume(resumeId));
    setIsDirty(false);
    setLastSavedAt(null);
    clearBasicsValidation();
    clearSectionValidation();
  }, [resumeId, clearBasicsValidation, clearSectionValidation]);

  const exportImage = useCallback(async () => {
    if (!validateResumeBeforeExport()) return;

    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      const name = resume.basics.name.trim() || 'resume';
      await exportResumeImage({
        fileName: `${name}-${resume.basics.title}.png`,
        target: previewRef.current,
      });
      toast.success('이미지 저장 완료');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '이미지 저장에 실패했습니다.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [
    resume.basics.name,
    resume.basics.title,
    validateResumeBeforeExport,
  ]);

  const exportResumePdf = useCallback(async () => {
    if (!validateResumeBeforeExport()) return;

    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      const name = resume.basics.name.trim() || 'resume';
      await exportResumePdfFile({
        fileName: `${name}-${resume.basics.title}.pdf`,
        target: previewRef.current,
      });
      toast.success('PDF 저장 완료');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'PDF 저장에 실패했습니다.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [resume.basics, validateResumeBeforeExport]);

  useEffect(() => {
    if (!isDirty || isSaving) return;

    const AUTO_SAVE_DELAY = 60_000;
    const timer = setTimeout(() => persist({ silent: true }), AUTO_SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [persist, resume, isDirty, isSaving]);

  const value = useMemo(
    () => ({
      resumeId,
      resume,
      setResume: setResumeSafe,
      save: persist,
      reset,
      exportImage,
      exportResumePdf,
      previewRef,
      basicsErrors,
      sectionErrors,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionField,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      resume,
      resumeId,
      setResumeSafe,
      persist,
      reset,
      exportImage,
      exportResumePdf,
      basicsErrors,
      sectionErrors,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionField,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <ResumeEditorContext.Provider value={value}>
      {children}
    </ResumeEditorContext.Provider>
  );
}

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx)
    throw new Error('useResumeEditor must be used within ResumeEditorProvider');
  return ctx;
}
