import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import type { Resume } from '../model/resume.types';
import { defaultResume } from '../model/resume.defaults';
import { loadResume, saveResume } from '../model/resume.storage';
import {
  ResumeValidationProvider,
  useResumeValidationController,
} from '../hooks/useResumeValidation';

export type { ResumeValidationTab } from '../model/resume.validationAdapter';

type ResumeEditorState = {
  resumeId: string;
  resume: Resume;
  setResume: (next: Resume) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printResume: () => Promise<void>;
  resetVersion: number;
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

  const resumeValidation = useResumeValidationController({
    resumeId,
    resume,
    resetVersion,
  });

  const printResume = useCallback(
    () => printDocumentCore(resumeValidation.validateResumeBeforeExport),
    [printDocumentCore, resumeValidation.validateResumeBeforeExport],
  );

  const value = useMemo(
    () => ({
      resumeId,
      resume,
      setResume: setResumeSafe,
      save: persist,
      reset,
      printResume,
      resetVersion,
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
      resetVersion,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <ResumeEditorContext.Provider value={value}>
      <ResumeValidationProvider value={resumeValidation}>
        {children}
      </ResumeValidationProvider>
    </ResumeEditorContext.Provider>
  );
}

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx)
    throw new Error('useResumeEditor must be used within ResumeEditorProvider');
  return ctx;
}
