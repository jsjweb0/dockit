import { describe, expect, it } from 'vitest';
import { validateCareerSummaryExperience } from './careerSummary.validation';
import type { CareerExperience } from './careerSummary.types';

const createValidExperience = (): CareerExperience => ({
  id: 'experience-1',
  company: '도킷컴퍼니',
  team: '프론트엔드팀',
  role: '개발자',
  startDate: '2024-01',
  endDate: '2025-01',
  isCurrent: false,
  responsibilities: '문서 편집 화면을 구현했습니다.',
  achievements: [{ title: '접근성 개선', description: '키보드 흐름 개선' }],
  techStack: ['React'],
});

describe('validateCareerSummaryExperience', () => {
  it('회사명이 비어 있거나 공백뿐이면 필수 오류를 반환한다', () => {
    const result = validateCareerSummaryExperience({
      ...createValidExperience(),
      company: '   ',
    });

    expect(result.company).toBe('회사명을 입력해 주세요.');
  });

  it('회사명이 입력되면 회사명 오류를 반환하지 않는다', () => {
    const result = validateCareerSummaryExperience(createValidExperience());

    expect(result.company).toBeUndefined();
  });
});
