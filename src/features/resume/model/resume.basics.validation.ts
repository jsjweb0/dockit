import type { ResumeBasics } from './resume.types';

export type BasicsValidatedField = 'name' | 'email' | 'phone' | 'workerTitle';

export const BASICS_VALIDATED_FIELDS: BasicsValidatedField[] = [
  'workerTitle',
  'name',
  'phone',
  'email',
];

export type BasicsFieldErrors = Partial<Record<BasicsValidatedField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KOREAN_MOBILE_REGEX = /^01[016789]-\d{3,4}-\d{4}$/;

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
        return '올바른 휴대폰 번호 형식이 아닙니다.';
      }
      return undefined;
    }
    case 'email': {
      const email = basics.email.trim();
      if (!email) return '이메일을 입력해 주세요.';
      if (!EMAIL_REGEX.test(email)) return '올바른 이메일 형식이 아닙니다.';
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
