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
import type { CareerSummary } from '../model/careerSummary.types';
import { defaultCareerSummary } from '../model/careerSummary.defaults';
import {
  loadCareerSummary,
  saveCareerSummary,
} from '../model/careerSummary.storage';
import {
  type CareerSummaryExperienceErrorMap,
  type CareerSummaryExperienceField,
} from '../model/careerSummary.validation';
import {
  careerSummaryValidationAdapter,
  getExperienceFieldKey,
} from '../model/careerSummary.validationAdapter';

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

  const {
    errors: experienceErrors,
    errorCount: totalValidationErrorCount,
    resetValidation,
    touchField,
    revalidateField,
    validateBeforeSubmit,
  } = useDocumentValidation({
    document: careerSummary,
    adapter: careerSummaryValidationAdapter,
  });

  useEffect(() => {
    resetValidation();
  }, [careerSummaryId, resetVersion, resetValidation]);

  const touchCareerSummary = useCallback(
    (
      sectionId: string,
      field: CareerSummaryExperienceField,
      nextSummary = careerSummary,
    ) => {
      touchField(getExperienceFieldKey(sectionId, field), nextSummary);
    },
    [careerSummary, touchField],
  );

  const revalidateExperience = useCallback(
    (
      sectionId: string,
      field: CareerSummaryExperienceField,
      nextSummary = careerSummary,
    ) => {
      revalidateField(getExperienceFieldKey(sectionId, field), nextSummary);
    },
    [careerSummary, revalidateField],
  );

  const validateCareerSummaryBeforeExport = useCallback(() => {
    const result = validateBeforeSubmit();

    if (!result.isValid) {
      toast.error(result.firstMessage);
      return false;
    }

    return true;
  }, [validateBeforeSubmit]);

  const resetCareerSummary = useCallback(() => {
    reset();
    resetValidation();
  }, [reset, resetValidation]);

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
      careerSummaryId,
      careerSummary,
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
