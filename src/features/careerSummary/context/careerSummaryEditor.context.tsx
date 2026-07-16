import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import type { CareerSummary } from '../model/careerSummary.types';
import { defaultCareerSummary } from '../model/careerSummary.defaults';
import {
  loadCareerSummary,
  saveCareerSummary,
} from '../model/careerSummary.storage';
import {
  CareerSummaryValidationProvider,
  useCareerSummaryValidationController,
} from '../hooks/useCareerSummaryValidation';

type CareerSummaryEditorState = {
  careerSummaryId: string;
  careerSummary: CareerSummary;
  setCareerSummary: (next: CareerSummary) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printCareerSummary: () => Promise<void>;
  resetVersion: number;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
};

const CareerSummaryEditorContext =
  createContext<CareerSummaryEditorState | null>(null);

export function CareerSummaryEditorProvider({
  documentId,
  children,
}: {
  documentId: string;
  children: React.ReactNode;
}) {
  const careerSummaryId = documentId;
  const getCareerSummaryPrintFileName = useCallback(
    (careerSummary: CareerSummary) => {
      const title = careerSummary.title.trim() || 'career-summary';
      return `${title}.pdf`;
    },
    [],
  );

  const {
    document: careerSummary,
    setDocument: setCareerSummary,
    save,
    reset,
    printDocument,
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

  const careerSummaryValidation = useCareerSummaryValidationController({
    careerSummaryId,
    careerSummary,
    resetVersion,
  });

  const resetCareerSummary = useCallback(() => {
    reset();
  }, [reset]);

  const saveCareerSummaryWithValidation = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!careerSummaryValidation.validateCareerSummaryBeforeExport()) return;
      await save(opts);
    },
    [careerSummaryValidation, save],
  );

  const printCareerSummary = useCallback(
    () =>
      printDocument(careerSummaryValidation.validateCareerSummaryBeforeExport),
    [careerSummaryValidation, printDocument],
  );

  const value = useMemo(
    () => ({
      careerSummaryId,
      careerSummary,
      setCareerSummary,
      save: saveCareerSummaryWithValidation,
      reset: resetCareerSummary,
      printCareerSummary,
      resetVersion,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      careerSummaryId,
      careerSummary,
      setCareerSummary,
      saveCareerSummaryWithValidation,
      resetCareerSummary,
      printCareerSummary,
      resetVersion,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <CareerSummaryEditorContext.Provider value={value}>
      <CareerSummaryValidationProvider value={careerSummaryValidation}>
        {children}
      </CareerSummaryValidationProvider>
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
