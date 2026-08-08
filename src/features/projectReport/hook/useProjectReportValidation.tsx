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
  focusRequestId: number;
  validateField: (
    field: ProjectReportValidatedField,
    nextProjectReport?: ProjectReport,
  ) => void;
  revalidateField: (
    field: ProjectReportValidatedField,
    nextProjectReport: ProjectReport,
  ) => void;
  validateAll: () => boolean;
  clearValidation: () => void;
};

export function useProjectReportValidation(
  projectReport: ProjectReport,
): ProjectReportValidationState {
  const [focusRequestId, setFocusRequestId] = useState(0);
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

  const revalidateField = useCallback(
    (
      field: ProjectReportValidatedField,
      nextProjectReport: ProjectReport,
    ) => {
      if (!touchedFields.has(field)) return;

      const message = validateProjectReportField(
        field,
        nextProjectReport,
      );

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
    [touchedFields],
  );

  const validateAll = useCallback(() => {
    const result = validateProjectReport(projectReport);

    setErrors(result.errors);
    setTouchedFields(new Set(PROJECT_REPORT_VALIDATED_FIELDS));

    if (!result.isValid) {
      setFocusRequestId((current) => current + 1);
    }

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
      focusRequestId,
      validateField,
      revalidateField,
      validateAll,
      clearValidation,
    }),
    [
      clearValidation,
      errorCount,
      errors,
      focusRequestId,
      revalidateField,
      touchedFields,
      validateAll,
      validateField,
    ],
  );
}
