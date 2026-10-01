import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  SECTION_VALIDATED_FIELDS,
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
  focusRequestId: number;
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
  clearSectionItem: (section: ResumeListSection, id: string) => void;
  revalidateSectionItem: (
    section: ResumeListSection,
    id: string,
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
  const [focusRequestId, setFocusRequestId] = useState(0);
  const {
    errors: validationErrors,
    resetValidation,
    clearFields,
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

  const clearSectionItem = useCallback(
    (section: ResumeListSection, id: string) => {
      clearFields(
        SECTION_VALIDATED_FIELDS[section].map(
          (field) => getSectionFieldKey(section, id, field),
        ),
      );
    },
    [clearFields],
  );

  const revalidateSectionItem = useCallback(
    (
      section: ResumeListSection,
      id: string,
      nextResume = resume,
    ) => {
      // 선택 항목의 필수 여부는 같은 항목의 다른 입력값에도 의존한다.
      // 아직 건드리지 않은 필드는 기존처럼 오류를 표시하지 않는다.
      SECTION_VALIDATED_FIELDS[section].forEach((field) => {
        revalidateField(getSectionFieldKey(section, id, field), nextResume);
      });
    },
    [resume, revalidateField],
  );

  const validateResumeBeforeExport = useCallback(() => {
    const result = validateBeforeSubmit();

    if (result.isValid) {
      return true;
    }

    setFocusRequestId((current) => current + 1);
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
      focusRequestId,
      getFirstValidationErrorTarget,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionItem,
      clearSectionItem,
      validateResumeBeforeExport,
    }),
    [
      basicsErrors,
      sectionErrors,
      validationErrorCounts,
      totalValidationErrorCount,
      focusRequestId,
      getFirstValidationErrorTarget,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionItem,
      clearSectionItem,
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
