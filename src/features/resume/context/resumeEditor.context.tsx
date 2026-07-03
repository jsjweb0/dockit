import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import { useDocumentValidation } from '@/features/documents/hooks/useDocumentValidation';
import type { Resume } from '../model/resume.types';
import { defaultResume } from '../model/resume.defaults';
import { loadResume, saveResume } from '../model/resume.storage';
import {
  type BasicsFieldErrors,
  type BasicsValidatedField,
} from '../model/resume.basics.validation';
import {
  type ResumeListSection,
  type ResumeSectionErrors,
} from '../model/resume.optionalSections.validation';
import {
  getBasicsFieldKey,
  getFirstResumeValidationErrorTarget,
  getResumeValidationErrorCounts,
  getSectionFieldKey,
  getTotalResumeValidationErrorCount,
  resumeValidationAdapter,
  type ResumeValidationTab,
  type ValidationErrorCounts,
  type ValidationErrorTarget,
} from '../model/resume.validationAdapter';

export type { ResumeValidationTab } from '../model/resume.validationAdapter';

type ResumeEditorState = {
  resumeId: string;
  resume: Resume;
  setResume: (next: Resume) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printResume: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  basicsErrors: BasicsFieldErrors;
  sectionErrors: ResumeSectionErrors;
  resetVersion: number;
  validationErrorCounts: ValidationErrorCounts;
  totalValidationErrorCount: number;
  getFirstValidationErrorTarget: (
    tab?: ResumeValidationTab,
  ) => ValidationErrorTarget | null;
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

export function ResumeEditorProvider({
  documentId,
  children,
}: {
  documentId: string;
  children: React.ReactNode;
}) {
  const resumeId = documentId;
  const getResumePrintFileName = useCallback((resume: Resume) => {
    const name = resume.basics.name.trim() || 'resume';
    return `${name}-${resume.basics.title}.pdf`;
  }, []);

  const {
    document: resume,
    setDocument: setResumeSafe,
    save: persist,
    reset,
    printDocument: printDocumentCore,
    previewRef,
    resetVersion,
    isDirty,
    isExporting,
    isSaving,
    lastSavedAt,
  } = useDocumentEditorCore({
    documentId: resumeId,
    loadDocument: loadResume,
    saveDocument: saveResume,
    createDefaultDocument: defaultResume,
    getPrintFileName: getResumePrintFileName,
  });

  const resumeValidation = useDocumentValidation({
    document: resume,
    adapter: resumeValidationAdapter,
  });
  const {
    errors: validationErrors,
    resetValidation,
    touchField,
    revalidateField,
    validateBeforeSubmit,
  } = resumeValidation;

  useEffect(() => {
    resetValidation();
  }, [resumeId, resetVersion, resetValidation]);

  const { basicsErrors, sectionErrors } = validationErrors;

  const touchBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      touchField(getBasicsFieldKey(field), {
        ...resume,
        basics,
      });
    },
    [resume, touchField],
  );

  const revalidateBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      revalidateField(getBasicsFieldKey(field), {
        ...resume,
        basics,
      });
    },
    [resume, revalidateField],
  );

  const touchSectionField = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      nextResume = resume,
    ) => {
      touchField(
        getSectionFieldKey(section, id, field),
        nextResume,
      );
    },
    [resume, touchField],
  );

  const revalidateSectionField = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      nextResume = resume,
    ) => {
      revalidateField(
        getSectionFieldKey(section, id, field),
        nextResume,
      );
    },
    [resume, revalidateField],
  );

  const validateResumeBeforeExport = useCallback(() => {
    const result = validateBeforeSubmit();

    if (result.isValid) {
      return true;
    }

    toast.error(result.firstMessage);
    return false;
  }, [validateBeforeSubmit]);

  const printResume = useCallback(
    () => printDocumentCore(validateResumeBeforeExport),
    [printDocumentCore, validateResumeBeforeExport],
  );

  const validationErrorCounts = useMemo(
    () =>
      getResumeValidationErrorCounts({
        basicsErrors,
        sectionErrors,
      }),
    [basicsErrors, sectionErrors],
  );

  const totalValidationErrorCount = useMemo(
    () => getTotalResumeValidationErrorCount(validationErrorCounts),
    [validationErrorCounts],
  );

  const getFirstValidationErrorTarget = useCallback(
    (tab?: ResumeValidationTab) =>
      getFirstResumeValidationErrorTarget({
        tab,
        resume,
        basicsErrors,
        sectionErrors,
      }),
    [basicsErrors, resume, sectionErrors],
  );

  const value = useMemo(
    () => ({
      resumeId,
      resume,
      setResume: setResumeSafe,
      save: persist,
      reset,
      printResume,
      previewRef,
      basicsErrors,
      sectionErrors,
      resetVersion,
      validationErrorCounts,
      totalValidationErrorCount,
      getFirstValidationErrorTarget,
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
      resumeId,
      resume,
      setResumeSafe,
      persist,
      reset,
      printResume,
      previewRef,
      basicsErrors,
      sectionErrors,
      resetVersion,
      validationErrorCounts,
      totalValidationErrorCount,
      getFirstValidationErrorTarget,
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
