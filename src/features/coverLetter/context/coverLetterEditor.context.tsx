import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type { CoverLetter } from '../model/coverLetter.types';
import { defaultCoverLetter } from '../model/coverLetter.defaults';
import { loadCoverLetter, saveCoverLetter } from '../model/coverLetter.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';

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
};

const CoverLetterEditorContext =
  createContext<CoverLetterEditorState | null>(null);

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

  const value = useMemo(
    () => ({
      coverLetterId,
      document: coverLetter,
      coverLetter,
      setDocument: setCoverLetter,
      setCoverLetter,
      save,
      reset,
      printDocument,
      printCoverLetter: printDocument,
      previewRef,
      resetVersion,
      totalValidationErrorCount: 0,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      coverLetter,
      coverLetterId,
      setCoverLetter,
      save,
      reset,
      printDocument,
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
