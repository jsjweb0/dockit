import type { ProjectReport } from './projectReport.types';

export const PROJECT_REPORT_VALIDATED_FIELDS = [
  'title',
  'summary',
  'role',
  'period',
  'techStack',
  'keyFeatures',
] as const satisfies readonly (keyof Omit<ProjectReport, 'meta'>)[];

export type ProjectReportValidatedField =
  (typeof PROJECT_REPORT_VALIDATED_FIELDS)[number];

export type ProjectReportFieldErrors = Partial<
  Record<ProjectReportValidatedField, string>
>;

export function validateProjectReportField(
  field: ProjectReportValidatedField,
  projectReport: ProjectReport,
): string | undefined {
  const value = projectReport[field].trim();

  if (!value) {
    return '필수 항목을 입력해 주세요.';
  }

  return undefined;
}

export function validateProjectReport(projectReport: ProjectReport): {
  isValid: boolean;
  errors: ProjectReportFieldErrors;
} {
  const errors: ProjectReportFieldErrors = {};

  PROJECT_REPORT_VALIDATED_FIELDS.forEach((field) => {
    const message = validateProjectReportField(field, projectReport);

    if (message) {
      errors[field] = message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
