import { describe, expect, it } from 'vitest';
import { defaultProjectReport } from './projectReport.defaults';
import {
  PROJECT_REPORT_VALIDATED_FIELDS,
  validateProjectReport,
  validateProjectReportField,
} from './projectReport.validation';
import type { ProjectReport } from './projectReport.types';

const createValidProjectReport = (): ProjectReport => ({
  ...defaultProjectReport(),
  title: 'DocKit',
  summary: '국문 제출 문서를 작성하는 웹 도구입니다.',
  role: '1인 프론트엔드 개발',
  period: '2026.04 ~ 2026.08',
  techStack: 'React, TypeScript, Vite',
  keyFeatures: '실시간 미리보기',
});

describe('validateProjectReportField', () => {
  it.each(PROJECT_REPORT_VALIDATED_FIELDS)(
    '%s에 빈 값이 있으면 필수 오류를 반환한다',
    (field) => {
      const projectReport = createValidProjectReport();
      projectReport[field] = '   ';

      expect(validateProjectReportField(field, projectReport)).toBe(
        '필수 항목을 입력해 주세요.',
      );
    },
  );

  it.each(PROJECT_REPORT_VALIDATED_FIELDS)(
    '%s에 값이 있으면 오류를 반환하지 않는다',
    (field) => {
      expect(
        validateProjectReportField(field, createValidProjectReport()),
      ).toBeUndefined();
    },
  );
});

describe('validateProjectReport', () => {
  it('기본 상태의 모든 필수 필드를 오류로 반환한다', () => {
    const result = validateProjectReport(defaultProjectReport());

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(PROJECT_REPORT_VALIDATED_FIELDS);
  });

  it('모든 필수 필드가 작성되면 유효하다', () => {
    expect(validateProjectReport(createValidProjectReport())).toEqual({
      isValid: true,
      errors: {},
    });
  });

  it('선택 필드가 비어 있어도 유효하다', () => {
    const projectReport = createValidProjectReport();

    expect(projectReport.problem).toBe('');
    expect(projectReport.githubUrl).toBe('');
    expect(validateProjectReport(projectReport).isValid).toBe(true);
  });
});
