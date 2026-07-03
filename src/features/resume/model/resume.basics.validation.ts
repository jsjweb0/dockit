import type { ResumeBasics } from './resume.types';
import { isValidDate } from '@/utils/date';

export type BasicsValidatedField =
  | 'name'
  | 'email'
  | 'phone'
  | 'workerTitle'
  | 'birth';

export const BASICS_VALIDATED_FIELDS: BasicsValidatedField[] = [
  'workerTitle',
  'name',
  'phone',
  'email',
  'birth',
];

export type BasicsFieldErrors = Partial<Record<BasicsValidatedField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KOREAN_MOBILE_REGEX = /^010-\d{4}-\d{4}$/;

export function validateBasicsField(
  field: BasicsValidatedField,
  basics: ResumeBasics,
): string | undefined {
  switch (field) {
    case 'workerTitle': {
      if (!basics.title.trim()) return '지원부문을 입력해 주세요.';
      return undefined;
    }
    case 'name': {
      if (!basics.name.trim()) return '이름을 입력해 주세요.';
      return undefined;
    }
    case 'phone': {
      const phone = basics.phone.trim();
      if (!phone) return '연락처를 입력해 주세요.';
      if (!KOREAN_MOBILE_REGEX.test(phone)) {
        return '010-0000-0000 형식으로 입력해 주세요.';
      }
      return undefined;
    }
    case 'email': {
      const email = basics.email.trim();
      if (!email) return '이메일을 입력해 주세요.';
      if (!EMAIL_REGEX.test(email)) return '올바른 이메일 형식이 아닙니다.';
      return undefined;
    }
    case 'birth': {
      const birthDate = basics.birth?.trim() ?? '';

      if (!birthDate) return undefined;

      if (!isValidDate(birthDate))
        return '생년월일은 YYYY-MM-DD 형식으로 입력해 주세요. 예: 1998-03-07';

      return undefined;
    }
  }
}

export function validateBasics(basics: ResumeBasics): {
  isValid: boolean;
  errors: BasicsFieldErrors;
} {
  const errors: BasicsFieldErrors = {};

  for (const field of BASICS_VALIDATED_FIELDS) {
    const message = validateBasicsField(field, basics);
    if (message) errors[field] = message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
