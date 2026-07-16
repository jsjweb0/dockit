import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { CoverLetter } from '../model/coverLetter.types';
import { defaultCoverLetter } from '../model/coverLetter.defaults';
import { loadCoverLetter, saveCoverLetter } from '../model/coverLetter.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import {
  CoverLetterValidationProvider,
  useCoverLetterValidationController,
} from '../hooks/useCoverLetterValidation';

type CoverLetterEditorState = {
  coverLetterId: string;
  coverLetter: CoverLetter;
  setCoverLetter: (next: CoverLetter) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printCoverLetter: () => Promise<void>;
  resetVersion: number;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
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

  const coverLetterValidation = useCoverLetterValidationController({
    coverLetterId,
    coverLetter,
    resetVersion,
  });

  const resetCoverLetter = useCallback(() => {
    reset();
  }, [reset]);

  const saveCoverLetterWithValidation = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!coverLetterValidation.validateCoverLetterBeforeExport()) return;
      await save(opts);
    },
    [coverLetterValidation, save],
  );

  const printCoverLetter = useCallback(
    () => printDocument(coverLetterValidation.validateCoverLetterBeforeExport),
    [coverLetterValidation, printDocument],
  );

  const value = useMemo(
    () => ({
      coverLetterId,
      coverLetter,
      setCoverLetter,
      save: saveCoverLetterWithValidation,
      reset: resetCoverLetter,
      printCoverLetter,
      resetVersion,
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
      resetVersion,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <CoverLetterEditorContext.Provider value={value}>
      <CoverLetterValidationProvider value={coverLetterValidation}>
        {children}
      </CoverLetterValidationProvider>
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
