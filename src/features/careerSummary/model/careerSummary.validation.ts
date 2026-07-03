import type { CareerSummary, CareerExperience } from './careerSummary.types';
import { isValidYearMonth } from '@/utils/date';

export type CareerSummaryExperienceField =
  | 'company'
  | 'startDate'
  | 'endDate'
  | 'responsibilities'
  | 'achievements';

export const CAREER_SUMMARY_EXPERIENCE_FIELDS: CareerSummaryExperienceField[] =
  ['company', 'startDate', 'endDate', 'responsibilities', 'achievements'];

export type CareerSummaryExperienceErrors = Partial<
  Record<CareerSummaryExperienceField, string>
>;

export type CareerSummaryExperienceErrorMap = Record<
  string,
  CareerSummaryExperienceErrors
>;

export function validateCareerSummaryExperience(
  experience: CareerExperience,
): CareerSummaryExperienceErrors {
  const errors: CareerSummaryExperienceErrors = {};
  const startDate = experience.startDate.trim();
  const endDate = experience.endDate?.trim() ?? '';

  if (!startDate) {
    errors.startDate = '시작일을 입력해 주세요.';
  } else if (!isValidYearMonth(startDate)) {
    errors.startDate = '시작일은 YYYY-MM 형식으로 입력해 주세요. 예: 2024-03';
  }

  if (!experience.isCurrent) {
    if (!endDate) {
      errors.endDate = '종료일을 입력해 주세요.';
    } else if (!isValidYearMonth(endDate)) {
      errors.endDate = '종료일은 YYYY-MM 형식으로 입력해 주세요. 예: 2025-08';
    }
  }

  if (
    startDate &&
    endDate &&
    !experience.isCurrent &&
    isValidYearMonth(startDate) &&
    isValidYearMonth(endDate) &&
    endDate < startDate
  ) {
    errors.endDate = '종료일은 시작일보다 늦어야 합니다.';
  }

  if (!experience.responsibilities.trim()) {
    errors.responsibilities = '주요 업무를 입력해 주세요.';
  }

  const hasAchievementTitle = experience.achievements.some((achievement) =>
    achievement.title.trim(),
  );

  if (!hasAchievementTitle) {
    errors.achievements = '주요 성과를 1개 이상 입력해 주세요.';
  }

  return errors;
}

export function validateCareerSummary(summary: CareerSummary): {
  isValid: boolean;
  errors: CareerSummaryExperienceErrorMap;
} {
  const errors = summary.experiences.reduce<CareerSummaryExperienceErrorMap>(
    (result, experience) => {
      const experienceErrors = validateCareerSummaryExperience(experience);

      if (Object.keys(experienceErrors).length > 0) {
        result[experience.id] = experienceErrors;
      }

      return result;
    },
    {},
  );

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
