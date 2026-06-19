import type { CoverLetter, CoverLetterSection } from './coverLetter.types';

export type CoverLetterFieldErrors = {
  sections: Record<string, string>;
};

export function validateCoverLetterSection(
  section: CoverLetterSection,
): string | undefined {
  if (!section.content.trim()) return `${section.title}을 입력해 주세요.`;
  return undefined;
}

export function validateCoverLetter(coverLetter: CoverLetter): {
  isValid: boolean;
  errors: CoverLetterFieldErrors;
} {
  const errors: CoverLetterFieldErrors = {
    sections: {},
  };

  coverLetter.sections.forEach((section) => {
    const message = validateCoverLetterSection(section);
    if (message) errors.sections[section.id] = message;
  });

  return {
    isValid: Object.keys(errors.sections).length === 0,
    errors,
  };
}
