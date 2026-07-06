import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { useDocumentValidation } from '@/features/documents/hooks/useDocumentValidation';
import type { Resume } from '../model/resume.types';
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

export type ResumeValidationState = {
  basicsErrors: BasicsFieldErrors;
  sectionErrors: ResumeSectionErrors;
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
  validateResumeBeforeExport: () => boolean;
};

const ResumeValidationContext = createContext<ResumeValidationState | null>(
  null,
);

export function useResumeValidationController({
  resumeId,
  resume,
  resetVersion,
}: {
  resumeId: string;
  resume: Resume;
  resetVersion: number;
}): ResumeValidationState {
  const {
    errors: validationErrors,
    resetValidation,
    touchField,
    revalidateField,
    validateBeforeSubmit,
  } = useDocumentValidation({
    document: resume,
    adapter: resumeValidationAdapter,
  });

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
      touchField(getSectionFieldKey(section, id, field), nextResume);
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
      revalidateField(getSectionFieldKey(section, id, field), nextResume);
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

  return useMemo(
    () => ({
      basicsErrors,
      sectionErrors,
      validationErrorCounts,
      totalValidationErrorCount,
      getFirstValidationErrorTarget,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionField,
      validateResumeBeforeExport,
    }),
    [
      basicsErrors,
      sectionErrors,
      validationErrorCounts,
      totalValidationErrorCount,
      getFirstValidationErrorTarget,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionField,
      validateResumeBeforeExport,
    ],
  );
}

export function ResumeValidationProvider({
  value,
  children,
}: {
  value: ResumeValidationState;
  children: ReactNode;
}) {
  return (
    <ResumeValidationContext.Provider value={value}>
      {children}
    </ResumeValidationContext.Provider>
  );
}

export function useResumeValidation() {
  const ctx = useContext(ResumeValidationContext);
  if (!ctx) {
    throw new Error(
      'useResumeValidation must be used within ResumeValidationProvider',
    );
  }
  return ctx;
}
