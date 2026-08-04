import { describe, expect, it } from 'vitest';
import { validateCoverLetterSection } from './coverLetter.validation';
import type { CoverLetterSection } from './coverLetter.types';

const createEmptySection = (title: string): CoverLetterSection => ({
  id: title,
  title,
  prompt: '',
  content: '',
});

describe('validateCoverLetterSection', () => {
  it.each(['성장 과정', '지원 동기', '입사 후 포부'])(
    '%s 문항에 자연스러운 필수 오류 문구를 반환한다',
    (title) => {
      expect(validateCoverLetterSection(createEmptySection(title))).toBe(
        `${title} 내용을 입력해 주세요.`,
      );
    },
  );
});
