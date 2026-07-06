import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import type { CareerSummary } from '../model/careerSummary.types';
import {
  CAREER_SUMMARY_EXPERIENCE_FIELDS,
  type CareerSummaryExperienceErrorMap,
  type CareerSummaryExperienceField,
  validateCareerSummary,
  validateCareerSummaryExperience,
} from '../model/careerSummary.validation';

export type CareerSummaryValidationState = {
  experienceErrors: CareerSummaryExperienceErrorMap;
  totalValidationErrorCount: number;
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
  validateCareerSummaryBeforeExport: () => boolean;
};

const CareerSummaryValidationContext =
  createContext<CareerSummaryValidationState | null>(null);

type CareerSummaryValidationData = {
  scopeKey: string;
  errors: CareerSummaryExperienceErrorMap;
  touchedFields: Set<string>;
};

export function useCareerSummaryValidationController({
  careerSummaryId,
  careerSummary,
  resetVersion,
}: {
  careerSummaryId: string;
  careerSummary: CareerSummary;
  resetVersion: number;
}): CareerSummaryValidationState {
  const scopeKey = `${careerSummaryId}:${resetVersion}`;
  const createEmptyValidationData = useCallback(
    (): CareerSummaryValidationData => ({
      scopeKey,
      errors: {},
      touchedFields: new Set(),
    }),
    [scopeKey],
  );
  const [validationData, setValidationData] = useState(
    createEmptyValidationData,
  );
  const currentValidationData =
    validationData.scopeKey === scopeKey
      ? validationData
      : createEmptyValidationData();
  const experienceErrors = currentValidationData.errors;
  const touchedFields = currentValidationData.touchedFields;

  const getFieldKey = useCallback(
    (sectionId: string, field: CareerSummaryExperienceField) =>
      `${sectionId}:${field}`,
    [],
  );

  const setExperienceFieldError = useCallback(
    (
      sectionId: string,
      field: CareerSummaryExperienceField,
      message?: string,
    ) => {
      setValidationData((prev) => {
        const base =
          prev.scopeKey === scopeKey ? prev : createEmptyValidationData();
        const sectionErrors = { ...(base.errors[sectionId] ?? {}) };

        if (message) {
          sectionErrors[field] = message;
        } else {
          delete sectionErrors[field];
        }

        if (Object.keys(sectionErrors).length === 0) {
          const nextErrors = { ...base.errors };
          delete nextErrors[sectionId];
          return {
            ...base,
            errors: nextErrors,
          };
        }

        return {
          ...base,
          errors: {
            ...base.errors,
            [sectionId]: sectionErrors,
          },
        };
      });
    },
    [createEmptyValidationData, scopeKey],
  );

  const validateExperienceField = useCallback(
    (
      sectionId: string,
      field: CareerSummaryExperienceField,
      nextSummary: CareerSummary,
    ) => {
      const experience = nextSummary.experiences.find(
        (item) => item.id === sectionId,
      );

      return experience
        ? validateCareerSummaryExperience(experience)[field]
        : undefined;
    },
    [],
  );

  const touchCareerSummary = useCallback(
    (
      sectionId: string,
      field: CareerSummaryExperienceField,
      nextSummary = careerSummary,
    ) => {
      setValidationData((prev) => {
        const base =
          prev.scopeKey === scopeKey ? prev : createEmptyValidationData();

        return {
          ...base,
          touchedFields: new Set(base.touchedFields).add(
            getFieldKey(sectionId, field),
          ),
        };
      });
      setExperienceFieldError(
        sectionId,
        field,
        validateExperienceField(sectionId, field, nextSummary),
      );
    },
    [
      careerSummary,
      createEmptyValidationData,
      getFieldKey,
      scopeKey,
      setExperienceFieldError,
      validateExperienceField,
    ],
  );

  const revalidateExperience = useCallback(
    (
      sectionId: string,
      field: CareerSummaryExperienceField,
      nextSummary = careerSummary,
    ) => {
      if (!touchedFields.has(getFieldKey(sectionId, field))) return;
      setExperienceFieldError(
        sectionId,
        field,
        validateExperienceField(sectionId, field, nextSummary),
      );
    },
    [
      careerSummary,
      getFieldKey,
      setExperienceFieldError,
      touchedFields,
      validateExperienceField,
    ],
  );

  const validateCareerSummaryBeforeExport = useCallback(() => {
    const result = validateCareerSummary(careerSummary);
    setValidationData({
      scopeKey,
      errors: result.errors,
      touchedFields: new Set(
        careerSummary.experiences.flatMap((experience) =>
          CAREER_SUMMARY_EXPERIENCE_FIELDS.map((field) =>
            getFieldKey(experience.id, field),
          ),
        ),
      ),
    });

    if (!result.isValid) {
      toast.error(
        Object.values(result.errors)
          .flatMap((sectionErrors) => Object.values(sectionErrors))
          .find(Boolean) ?? '입력 정보를 확인해 주세요.',
      );
      return false;
    }

    return true;
  }, [careerSummary, getFieldKey, scopeKey]);

  const totalValidationErrorCount = useMemo(
    () =>
      Object.values(experienceErrors).reduce(
        (total, sectionErrors) => total + Object.keys(sectionErrors).length,
        0,
      ),
    [experienceErrors],
  );

  return useMemo(
    () => ({
      experienceErrors,
      totalValidationErrorCount,
      touchCareerSummary,
      revalidateExperience,
      validateCareerSummaryBeforeExport,
    }),
    [
      experienceErrors,
      totalValidationErrorCount,
      touchCareerSummary,
      revalidateExperience,
      validateCareerSummaryBeforeExport,
    ],
  );
}

export function CareerSummaryValidationProvider({
  value,
  children,
}: {
  value: CareerSummaryValidationState;
  children: ReactNode;
}) {
  return (
    <CareerSummaryValidationContext.Provider value={value}>
      {children}
    </CareerSummaryValidationContext.Provider>
  );
}

export function useCareerSummaryValidation() {
  const ctx = useContext(CareerSummaryValidationContext);
  if (!ctx) {
    throw new Error(
      'useCareerSummaryValidation must be used within CareerSummaryValidationProvider',
    );
  }
  return ctx;
}
