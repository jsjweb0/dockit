import type { DocumentValidationAdapter } from '@/features/documents/model/document.validation';
import type { CareerSummary } from './careerSummary.types';
import {
  CAREER_SUMMARY_EXPERIENCE_FIELDS,
  validateCareerSummary,
  validateCareerSummaryExperience,
  type CareerSummaryExperienceErrorMap,
  type CareerSummaryExperienceField,
} from './careerSummary.validation';

export type CareerSummaryValidationFieldKey =
  `${string}:${CareerSummaryExperienceField}`;

export const getExperienceFieldKey = (
  sectionId: string,
  field: CareerSummaryExperienceField,
): CareerSummaryValidationFieldKey => `${sectionId}:${field}`;

const parseExperienceFieldKey = (fieldKey: CareerSummaryValidationFieldKey) => {
  const separatorIndex = fieldKey.lastIndexOf(':');

  return {
    sectionId: fieldKey.slice(0, separatorIndex),
    field: fieldKey.slice(separatorIndex + 1) as CareerSummaryExperienceField,
  };
};

const getFirstCareerSummaryErrorMessage = (
  errors: CareerSummaryExperienceErrorMap,
) =>
  Object.values(errors)
    .flatMap((experienceErrors) => Object.values(experienceErrors))
    .find(Boolean) ?? '입력 정보를 확인해 주세요.';

export const careerSummaryValidationAdapter: DocumentValidationAdapter<
  CareerSummary,
  CareerSummaryExperienceErrorMap,
  CareerSummaryValidationFieldKey
> = {
  createEmptyErrors: () => ({}),
  createEmptyTouchedFields: () => new Set<CareerSummaryValidationFieldKey>(),
  validateField: (careerSummary, fieldKey) => {
    const { sectionId, field } = parseExperienceFieldKey(fieldKey);
    const experience = careerSummary.experiences.find(
      (item) => item.id === sectionId,
    );

    return experience
      ? validateCareerSummaryExperience(experience)[field]
      : undefined;
  },
  setFieldError: (errors, fieldKey, message) => {
    const { sectionId, field } = parseExperienceFieldKey(fieldKey);
    const sectionErrors = { ...(errors[sectionId] ?? {}) };

    if (message) {
      sectionErrors[field] = message;
    } else {
      delete sectionErrors[field];
    }

    if (Object.keys(sectionErrors).length === 0) {
      const nextErrors = { ...errors };
      delete nextErrors[sectionId];
      return nextErrors;
    }

    return {
      ...errors,
      [sectionId]: sectionErrors,
    };
  },
  validateAll: (careerSummary) => {
    const result = validateCareerSummary(careerSummary);

    return {
      isValid: result.isValid,
      errors: result.errors,
      firstMessage: getFirstCareerSummaryErrorMessage(result.errors),
    };
  },
  getAllTouchedFields: (careerSummary) =>
    new Set(
      careerSummary.experiences.flatMap((experience) =>
        CAREER_SUMMARY_EXPERIENCE_FIELDS.map((field) =>
          getExperienceFieldKey(experience.id, field),
        ),
      ),
    ),
  getErrorCount: (errors) =>
    Object.values(errors).reduce(
      (total, experienceErrors) =>
        total + Object.keys(experienceErrors).length,
      0,
    ),
};
