import { describe, expect, it } from 'vitest';
import {
  validateBasics,
  validateBasicsField,
} from './resume.basics.validation';
import type { ResumeBasics } from './resume.types';

const validBasics: ResumeBasics = {
  applicationType: 'new',
  title: '프론트엔드 개발자',
  name: '김수진',
  nameEn: 'Sujin Kim',
  birth: '2000-01-01',
  phone: '010-1234-5678',
  email: 'sujin@example.com',
  address: '서울시',
  summary: '웹 퍼블리셔 지원자입니다.',
  submittedAt: '2026-06-11T12:00:00.000Z',
};

describe('validateBasicsField', () => {
  it('이름이 비어 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('name', {
        ...validBasics,
        name: '',
      }),
    ).toBe('이름을 입력해 주세요.');
  });

  it('이름이 공백만 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('name', {
        ...validBasics,
        name: '   ',
      }),
    ).toBe('이름을 입력해 주세요.');
  });

  it('연락처가 비어 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('phone', {
        ...validBasics,
        phone: '',
      }),
    ).toBe('연락처를 입력해 주세요.');
  });

  it('연락처에 공백만 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('phone', {
        ...validBasics,
        phone: '   ',
      }),
    ).toBe('연락처를 입력해 주세요.');
  });

  it('올바르지 않은 연락처면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('phone', {
        ...validBasics,
        phone: '0312345678',
      }),
    ).toBe('올바른 휴대폰 번호 형식이 아닙니다.');
  });

  it('010-1234-5678 형식은 통과한다', () => {
    expect(
      validateBasicsField('phone', {
        ...validBasics,
        phone: '010-1234-5678',
      }),
    ).toBeUndefined();
  });

  it('올바르지 않은 이메일이면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('email', {
        ...validBasics,
        email: 'wrong-email',
      }),
    ).toBe('올바른 이메일 형식이 아닙니다.');
  });

  it('이메일이 비어 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('email', {
        ...validBasics,
        email: '',
      }),
    ).toBe('이메일을 입력해 주세요.');
  });

  it('이메일이 공백만 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('email', {
        ...validBasics,
        email: '   ',
      }),
    ).toBe('이메일을 입력해 주세요.');
  });

  it('지원부문이 비어 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('workerTitle', {
        ...validBasics,
        title: '',
      }),
    ).toBe('지원부문을 입력해 주세요.');
  });

  it('지원부문이 공백만 있으면 에러 메시지를 반환한다', () => {
    expect(
      validateBasicsField('workerTitle', {
        ...validBasics,
        title: '   ',
      }),
    ).toBe('지원부문을 입력해 주세요.');
  });
});

describe('validateBasics', () => {
  it('모든 필수 값이 유효하면 isValid true와 빈 errors를 반환한다', () => {
    expect(validateBasics(validBasics)).toEqual({
      isValid: true,
      errors: {},
    });
  });

  it('여러 필드가 비어 있으면 각 필드의 에러를 반환한다', () => {
    expect(
      validateBasics({
        ...validBasics,
        title: '',
        name: '',
      }),
    ).toEqual({
      isValid: false,
      errors: {
        workerTitle: '지원부문을 입력해 주세요.',
        name: '이름을 입력해 주세요.',
      },
    });
  });

  it('여러 필드에 공백만 있으면 각 필드의 에러를 반환한다', () => {
    expect(
      validateBasics({
        ...validBasics,
        title: '   ',
        name: '   ',
      }),
    ).toEqual({
      isValid: false,
      errors: {
        workerTitle: '지원부문을 입력해 주세요.',
        name: '이름을 입력해 주세요.',
      },
    });
  });
});
