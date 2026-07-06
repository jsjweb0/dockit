import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import type { CoverLetter } from '../model/coverLetter.types';
import {
  validateCoverLetter,
  validateCoverLetterSection,
  type CoverLetterFieldErrors,
} from '../model/coverLetter.validation';

export type CoverLetterValidationState = {
  coverLetterErrors: CoverLetterFieldErrors;
  totalValidationErrorCount: number;
  touchCoverLetterSection: (sectionId: string) => void;
  revalidateCoverLetterSection: (
    sectionId: string,
    nextCoverLetter: CoverLetter,
  ) => void;
  validateCoverLetterBeforeExport: () => boolean;
};

const CoverLetterValidationContext =
  createContext<CoverLetterValidationState | null>(null);

type CoverLetterValidationData = {
  scopeKey: string;
  errors: CoverLetterFieldErrors;
  touchedSectionIds: Set<string>;
};

export function useCoverLetterValidationController({
  coverLetterId,
  coverLetter,
  resetVersion,
}: {
  coverLetterId: string;
  coverLetter: CoverLetter;
  resetVersion: number;
}): CoverLetterValidationState {
  const scopeKey = `${coverLetterId}:${resetVersion}`;
  const createEmptyValidationData = useCallback(
    (): CoverLetterValidationData => ({
      scopeKey,
      errors: { sections: {} },
      touchedSectionIds: new Set(),
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
  const coverLetterErrors = currentValidationData.errors;
  const touchedSectionIds = currentValidationData.touchedSectionIds;

  const setSectionError = useCallback((sectionId: string, message?: string) => {
    setValidationData((prev) => {
      const base =
        prev.scopeKey === scopeKey ? prev : createEmptyValidationData();
      const sections = { ...base.errors.sections };

      if (message) {
        sections[sectionId] = message;
      } else {
        delete sections[sectionId];
      }

      return {
        ...base,
        errors: { sections },
      };
    });
  }, [createEmptyValidationData, scopeKey]);

  const validateSection = useCallback(
    (sectionId: string, nextCoverLetter: CoverLetter) => {
      const section = nextCoverLetter.sections.find(
        (item) => item.id === sectionId,
      );

      return section ? validateCoverLetterSection(section) : undefined;
    },
    [],
  );

  const touchCoverLetterSection = useCallback(
    (sectionId: string, nextCoverLetter = coverLetter) => {
      setValidationData((prev) => {
        const base =
          prev.scopeKey === scopeKey ? prev : createEmptyValidationData();

        return {
          ...base,
          touchedSectionIds: new Set(base.touchedSectionIds).add(sectionId),
        };
      });
      setSectionError(sectionId, validateSection(sectionId, nextCoverLetter));
    },
    [
      coverLetter,
      createEmptyValidationData,
      scopeKey,
      setSectionError,
      validateSection,
    ],
  );

  const revalidateCoverLetterSection = useCallback(
    (sectionId: string, nextCoverLetter: CoverLetter) => {
      if (!touchedSectionIds.has(sectionId)) return;
      setSectionError(sectionId, validateSection(sectionId, nextCoverLetter));
    },
    [setSectionError, touchedSectionIds, validateSection],
  );

  const validateCoverLetterBeforeExport = useCallback(() => {
    const result = validateCoverLetter(coverLetter);
    setValidationData({
      scopeKey,
      errors: result.errors,
      touchedSectionIds: new Set(
        coverLetter.sections.map((section) => section.id),
      ),
    });

    if (!result.isValid) {
      toast.error(
        Object.values(result.errors.sections)[0] ??
          '입력 정보를 확인해 주세요.',
      );
      return false;
    }

    return true;
  }, [coverLetter, scopeKey]);

  const totalValidationErrorCount = useMemo(
    () => Object.keys(coverLetterErrors.sections).length,
    [coverLetterErrors],
  );

  return useMemo(
    () => ({
      coverLetterErrors,
      totalValidationErrorCount,
      touchCoverLetterSection,
      revalidateCoverLetterSection,
      validateCoverLetterBeforeExport,
    }),
    [
      coverLetterErrors,
      totalValidationErrorCount,
      touchCoverLetterSection,
      revalidateCoverLetterSection,
      validateCoverLetterBeforeExport,
    ],
  );
}

export function CoverLetterValidationProvider({
  value,
  children,
}: {
  value: CoverLetterValidationState;
  children: ReactNode;
}) {
  return (
    <CoverLetterValidationContext.Provider value={value}>
      {children}
    </CoverLetterValidationContext.Provider>
  );
}

export function useCoverLetterValidation() {
  const ctx = useContext(CoverLetterValidationContext);
  if (!ctx) {
    throw new Error(
      'useCoverLetterValidation must be used within CoverLetterValidationProvider',
    );
  }
  return ctx;
}
