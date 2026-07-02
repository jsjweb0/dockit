import type { DocumentValidationAdapter } from '@/features/documents/model/document.validation';
import type { CoverLetter } from './coverLetter.types';
import {
  validateCoverLetter,
  validateCoverLetterSection,
  type CoverLetterFieldErrors,
} from './coverLetter.validation';

type CoverLetterValidationFieldKey = `section:${string}`;

export const getCoverLetterSectionFieldKey = (
  sectionId: string,
): CoverLetterValidationFieldKey => `section:${sectionId}`;

const getSectionIdFromFieldKey = (fieldKey: CoverLetterValidationFieldKey) =>
  fieldKey.replace(/^section:/, '');

export const coverLetterValidationAdapter: DocumentValidationAdapter<
  CoverLetter,
  CoverLetterFieldErrors,
  CoverLetterValidationFieldKey
> = {
  createEmptyErrors: () => ({ sections: {} }),
  createEmptyTouchedFields: () => new Set(),

  validateField: (coverLetter, fieldKey) => {
    const sectionId = getSectionIdFromFieldKey(fieldKey);
    const section = coverLetter.sections.find((item) => item.id === sectionId);
    return section ? validateCoverLetterSection(section) : undefined;
  },

  setFieldError: (errors, fieldKey, message) => {
    const sectionId = getSectionIdFromFieldKey(fieldKey);
    const sections = { ...errors.sections };

    if (message) {
      sections[sectionId] = message;
    } else {
      delete sections[sectionId];
    }

    return { sections };
  },

  validateAll: (coverLetter) => {
    const result = validateCoverLetter(coverLetter);

    return {
      isValid: result.isValid,
      errors: result.errors,
      firstMessage:
        Object.values(result.errors.sections)[0] ??
        '입력 정보를 확인해 주세요.',
    };
  },

  getAllTouchedFields: (coverLetter) =>
    new Set(
      coverLetter.sections.map((section) =>
        getCoverLetterSectionFieldKey(section.id),
      ),
    ),

  getErrorCount: (errors) => Object.keys(errors.sections).length,
};
