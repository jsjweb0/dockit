import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { CoverLetter } from '../model/coverLetter.types';
import { defaultCoverLetter } from '../model/coverLetter.defaults';
import { loadCoverLetter, saveCoverLetter } from '../model/coverLetter.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import type { CoverLetterFieldErrors } from '../model/coverLetter.validation';
import {
  validateCoverLetter,
  validateCoverLetterSection,
} from '../model/coverLetter.validation';
import { toast } from 'sonner';

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

  const [coverLetterErrors, setCoverLetterErrors] =
    useState<CoverLetterFieldErrors>({ sections: {} });
  const [touchedSectionIds, setTouchedSectionIds] = useState<Set<string>>(
    () => new Set(),
  );

  const setSectionError = useCallback((sectionId: string, message?: string) => {
    setCoverLetterErrors((prev) => {
      const nextSections = { ...prev.sections };

      if (message) {
        nextSections[sectionId] = message;
      } else {
        delete nextSections[sectionId];
      }

      return { sections: nextSections };
    });
  }, []);

  const touchCoverLetterSection = useCallback(
    (sectionId: string, nextCoverLetter = coverLetter) => {
      setTouchedSectionIds((prev) => new Set(prev).add(sectionId));

      const section = nextCoverLetter.sections.find(
        (item) => item.id === sectionId,
      );
      setSectionError(
        sectionId,
        section ? validateCoverLetterSection(section) : undefined,
      );
    },
    [coverLetter, setSectionError],
  );

  const revalidateCoverLetterSection = useCallback(
    (sectionId: string, nextCoverLetter: CoverLetter) => {
      if (!touchedSectionIds.has(sectionId)) return;
      touchCoverLetterSection(sectionId, nextCoverLetter);
    },
    [touchedSectionIds, touchCoverLetterSection],
  );

  const validateCoverLetterBeforeExport = useCallback(() => {
    const result = validateCoverLetter(coverLetter);
    setCoverLetterErrors(result.errors);
    setTouchedSectionIds(
      new Set(coverLetter.sections.map((section) => section.id)),
    );

    if (!result.isValid) {
      toast.error(
        Object.values(result.errors.sections)[0] ?? '입력 정보를 확인해 주세요.',
      );
      return false;
    }

    return true;
  }, [coverLetter]);

  const resetCoverLetter = useCallback(() => {
    reset();
    setCoverLetterErrors({ sections: {} });
    setTouchedSectionIds(new Set());
  }, [reset]);

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
      totalValidationErrorCount: Object.keys(coverLetterErrors.sections).length,
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
