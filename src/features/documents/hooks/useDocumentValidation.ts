import { useCallback, useMemo, useState } from 'react';
import type { DocumentValidationAdapter } from '../model/document.validation';

export function useDocumentValidation<TDocument, TErrors, TFieldKey>({
  document,
  adapter,
}: {
  document: TDocument;
  adapter: DocumentValidationAdapter<TDocument, TErrors, TFieldKey>;
}) {
  const [errors, setErrors] = useState(adapter.createEmptyErrors);
  const [touchedFields, setTouchedFields] = useState(
    adapter.createEmptyTouchedFields,
  );

  const resetValidation = useCallback(() => {
    setErrors(adapter.createEmptyErrors());
    setTouchedFields(adapter.createEmptyTouchedFields());
  }, [adapter]);

  const clearFields = useCallback(
    (fieldKeys: TFieldKey[]) => {
      setTouchedFields((prev) => {
        const next = new Set(prev);
        fieldKeys.forEach((key) => next.delete(key));
        return next;
      });
      setErrors((prev) => fieldKeys.reduce(
        (next, key) => adapter.setFieldError(next, key, undefined),
        prev,
      ));
    },
    [adapter],
  );

  const touchField = useCallback(
    (fieldKey: TFieldKey, nextDocument = document) => {
      setTouchedFields((prev) => new Set(prev).add(fieldKey));

      const message = adapter.validateField(nextDocument, fieldKey);
      setErrors((prev) => adapter.setFieldError(prev, fieldKey, message));
    },
    [adapter, document],
  );

  const revalidateField = useCallback(
    (fieldKey: TFieldKey, nextDocument = document) => {
      if (!touchedFields.has(fieldKey)) return;

      const message = adapter.validateField(nextDocument, fieldKey);
      setErrors((prev) => adapter.setFieldError(prev, fieldKey, message));
    },
    [adapter, document, touchedFields],
  );

  const validateBeforeSubmit = useCallback(() => {
    const result = adapter.validateAll(document);
    setErrors(result.errors);
    setTouchedFields(adapter.getAllTouchedFields(document));

    return result;
  }, [adapter, document]);

  const errorCount = useMemo(
    () => adapter.getErrorCount(errors),
    [adapter, errors],
  );

  return {
    errors,
    touchedFields,
    errorCount,
    resetValidation,
    clearFields,
    touchField,
    revalidateField,
    validateBeforeSubmit,
  };
}
