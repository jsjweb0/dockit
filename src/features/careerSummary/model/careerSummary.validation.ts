import type { CareerSummary, CareerExperience } from './careerSummary.types';

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

  if (!experience.company.trim()) {
    errors.company = '회사명을 입력해 주세요.';
  }

  if (!experience.startDate.trim()) {
    errors.startDate = '시작일을 입력해 주세요.';
  }

  if (!experience.isCurrent && !experience.endDate?.trim()) {
    errors.endDate = '종료일을 입력해 주세요.';
  }

  if (
    experience.startDate &&
    experience.endDate &&
    !experience.isCurrent &&
    experience.endDate < experience.startDate
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
