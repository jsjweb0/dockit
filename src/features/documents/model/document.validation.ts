export type DocumentValidationResult<TErrors> = {
  isValid: boolean;
  errors: TErrors;
  firstMessage: string;
};

export type DocumentValidationAdapter<TDocument, TErrors, TFieldKey> = {
  createEmptyErrors: () => TErrors;
  createEmptyTouchedFields: () => Set<TFieldKey>;

  validateField: (
    document: TDocument,
    fieldKey: TFieldKey,
  ) => string | undefined;

  setFieldError: (
    errors: TErrors,
    fieldKey: TFieldKey,
    message?: string,
  ) => TErrors;

  validateAll: (document: TDocument) => DocumentValidationResult<TErrors>;

  getAllTouchedFields: (document: TDocument) => Set<TFieldKey>;

  getErrorCount: (errors: TErrors) => number;
};
