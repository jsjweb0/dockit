import { useCallback, useMemo, useState } from 'react';
import {
  PROJECT_REPORT_VALIDATED_FIELDS,
  validateProjectReport,
  validateProjectReportField,
  type ProjectReportFieldErrors,
  type ProjectReportValidatedField,
} from '../model/projectReport.validation';
import type { ProjectReport } from '../model/projectReport.types';

export type ProjectReportValidationState = {
  errors: ProjectReportFieldErrors;
  touchedFields: Set<ProjectReportValidatedField>;
  errorCount: number;
  validateField: (
    field: ProjectReportValidatedField,
    nextProjectReport?: ProjectReport,
  ) => void;
  validateAll: () => boolean;
  clearValidation: () => void;
};

export function useProjectReportValidation(
  projectReport: ProjectReport,
): ProjectReportValidationState {
  const [errors, setErrors] = useState<ProjectReportFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState(
    () => new Set<ProjectReportValidatedField>(),
  );

  const validateField = useCallback(
    (
      field: ProjectReportValidatedField,
      nextProjectReport = projectReport,
    ) => {
      const message = validateProjectReportField(field, nextProjectReport);

      setTouchedFields((current) => new Set(current).add(field));
      setErrors((current) => {
        const next = { ...current };

        if (message) {
          next[field] = message;
        } else {
          delete next[field];
        }

        return next;
      });
    },
    [projectReport],
  );

  const validateAll = useCallback(() => {
    const result = validateProjectReport(projectReport);

    setErrors(result.errors);
    setTouchedFields(new Set(PROJECT_REPORT_VALIDATED_FIELDS));

    return result.isValid;
  }, [projectReport]);

  const clearValidation = useCallback(() => {
    setErrors({});
    setTouchedFields(new Set());
  }, []);

  const errorCount = useMemo(() => Object.keys(errors).length, [errors]);

  return useMemo(
    () => ({
      errors,
      touchedFields,
      errorCount,
      validateField,
      validateAll,
      clearValidation,
    }),
    [
      clearValidation,
      errorCount,
      errors,
      touchedFields,
      validateAll,
      validateField,
    ],
  );
}
