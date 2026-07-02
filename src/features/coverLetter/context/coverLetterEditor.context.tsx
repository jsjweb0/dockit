import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import type { CoverLetter } from '../model/coverLetter.types';
import { defaultCoverLetter } from '../model/coverLetter.defaults';
import { loadCoverLetter, saveCoverLetter } from '../model/coverLetter.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import type { CoverLetterFieldErrors } from '../model/coverLetter.validation';
import { toast } from 'sonner';
import { useDocumentValidation } from '@/features/documents/hooks/useDocumentValidation';
import { coverLetterValidationAdapter, getCoverLetterSectionFieldKey } from '../model/coverLetter.validationAdapter';

type CoverLetterEditorState = {
  coverLetterId: string;
  document: CoverLetter;
  coverLetter: CoverLetter;
  setDocument: (next: CoverLetter) => void;
  setCoverLetter: (next: CoverLetter) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printDocument: () => Promise<void>;
  printCoverLetter: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  resetVersion: number;
  totalValidationErrorCount: number;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
  coverLetterErrors: CoverLetterFieldErrors;
  touchCoverLetterSection: (sectionId: string) => void;
  revalidateCoverLetterSection: (
    sectionId: string,
    nextCoverLetter: CoverLetter,
  ) => void;
};

const CoverLetterEditorContext = createContext<CoverLetterEditorState | null>(null);

export function CoverLetterEditorProvider({
  documentId,
  children,
}: {
  documentId: string;
  children: React.ReactNode;
}) {
  const coverLetterId = documentId;
  const getCoverLetterPrintFileName = useCallback((coverLetter: CoverLetter) => {
    const title = coverLetter.title.trim() || 'cover-letter';
    return `${title}.pdf`;
  }, []);

  const {
    document: coverLetter,
    setDocument: setCoverLetter,
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
    documentId: coverLetterId,
    loadDocument: loadCoverLetter,
    saveDocument: saveCoverLetter,
    createDefaultDocument: defaultCoverLetter,
    getPrintFileName: getCoverLetterPrintFileName,
  });

  const coverLetterValidation = useDocumentValidation({
    document: coverLetter,
    adapter: coverLetterValidationAdapter,
  });
  const {
    errors: coverLetterErrors,
    errorCount: totalValidationErrorCount,
    resetValidation,
    touchField,
    revalidateField,
    validateBeforeSubmit,
  } = coverLetterValidation;

  useEffect(() => {
    resetValidation();
  }, [coverLetterId, resetVersion, resetValidation]);

  const touchCoverLetterSection = useCallback(
    (sectionId: string, nextCoverLetter = coverLetter) => {
      touchField(getCoverLetterSectionFieldKey(sectionId), nextCoverLetter);
    },
    [coverLetter, touchField],
  );

  const revalidateCoverLetterSection = useCallback(
    (sectionId: string, nextCoverLetter: CoverLetter) => {
      revalidateField(getCoverLetterSectionFieldKey(sectionId), nextCoverLetter);
    },
    [revalidateField],
  );

  const validateCoverLetterBeforeExport = useCallback(() => {
    const result = validateBeforeSubmit();

    if (!result.isValid) {
      toast.error(result.firstMessage);
      return false;
    }

    return true;
  }, [validateBeforeSubmit]);

  const resetCoverLetter = useCallback(() => {
    reset();
    resetValidation();
  }, [reset, resetValidation]);

  const saveCoverLetterWithValidation = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!validateCoverLetterBeforeExport()) return;
      await save(opts);
    },
    [save, validateCoverLetterBeforeExport],
  );

  const printCoverLetter = useCallback(
    () => printDocument(validateCoverLetterBeforeExport),
    [printDocument, validateCoverLetterBeforeExport],
  );

  const value = useMemo(
    () => ({
      coverLetterId,
      document: coverLetter,
      coverLetter,
      setDocument: setCoverLetter,
      setCoverLetter,
      save: saveCoverLetterWithValidation,
      reset: resetCoverLetter,
      printDocument: printCoverLetter,
      printCoverLetter,
      previewRef,
      resetVersion,
      coverLetterErrors,
      touchCoverLetterSection,
      revalidateCoverLetterSection,
      totalValidationErrorCount,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      coverLetter,
      coverLetterId,
      setCoverLetter,
      saveCoverLetterWithValidation,
      resetCoverLetter,
      printCoverLetter,
      coverLetterErrors,
      touchCoverLetterSection,
      revalidateCoverLetterSection,
      previewRef,
      resetVersion,
      totalValidationErrorCount,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <CoverLetterEditorContext.Provider value={value}>
      {children}
    </CoverLetterEditorContext.Provider>
  );
}

export function useCoverLetterEditor() {
  const ctx = useContext(CoverLetterEditorContext);
  if (!ctx) {
    throw new Error(
      'useCoverLetterEditor must be used within CoverLetterEditorProvider',
    );
  }
  return ctx;
}
