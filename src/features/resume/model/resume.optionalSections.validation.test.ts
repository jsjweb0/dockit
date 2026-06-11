import { describe, expect, it } from 'vitest';

import {
  validateLinkItem,
  validateEducationItem,
  validateCertificationItem,
  validateExperienceItem,
  validateOptionalSections,
  validateProjectItem,
} from './resume.optionalSections.validation';
import type {
  Certification,
  Education,
  Experience,
  LinkItem,
  Project,
  Resume,
} from './resume.types';

const validLink: LinkItem = {
  id: 'link-1',
  label: 'GitHub',
  url: 'https://github.com/example',
};

const validEducation: Education = {
  id: 'edu-1',
  institution: '한국대학교',
  period: '2021.03 - 2025.02',
  major: '컴퓨터공학과',
};

const validCertification: Certification = {
  id: 'cert-1',
  name: '정보처리기사',
  acquiredAt: '2025.06',
  issuer: '한국산업인력공단',
};

const validExperience: Experience = {
  id: 'exp-1',
  company: '도킷컴퍼니',
  role: '프론트엔드 인턴',
  start: '2025-01',
  end: '2025-06',
  isCurrent: false,
  description: '문서 작성 UI를 개선했습니다.',
};

const validProject: Project = {
  id: 'project-1',
  name: 'DocKit',
  period: '2026.01 - 2026.03',
  stack: 'React, TypeScript, Vite',
  description: '문서 템플릿 검색과 이력서 작성 기능을 구현했습니다.',
  link: 'https://example.com/dockit',
};

const validResume: Resume = {
  meta: { version: 1 },
  basics: {
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
  },
  education: [validEducation],
  certifications: [validCertification],
  experience: [validExperience],
  projects: [validProject],
  links: [validLink],
  skills: {
    primary: ['React', 'TypeScript'],
    tools: ['Git', 'Figma'],
  },
};

describe('validateLinkItem', () => {
  it('입력값이 모두 비어 있으면 에러를 반환하지 않는다', () => {
    expect(
      validateLinkItem({
        ...validLink,
        label: '',
        url: '',
      }),
    ).toEqual({});
  });

  it('링크 이름만 입력하면 URL 에러를 반환한다', () => {
    expect(
      validateLinkItem({
        ...validLink,
        label: 'GitHub',
        url: '',
      }),
    ).toEqual({
      url: 'URL을 입력해 주세요.',
    });
  });

  it('URL만 입력하면 링크 이름 에러를 반환한다', () => {
    expect(
      validateLinkItem({
        ...validLink,
        label: '',
        url: 'https://github.com/example',
      }),
    ).toEqual({
      label: '링크 이름을 입력해 주세요.',
    });
  });

  it('URL 형식이 올바르지 않으면 에러를 반환한다', () => {
    expect(
      validateLinkItem({
        ...validLink,
        url: 'github.com/example',
      }),
    ).toEqual({
      url: '올바른 URL 형식이 아닙니다.',
    });
  });

  it('링크 이름과 URL이 모두 유효하면 에러를 반환하지 않는다', () => {
    expect(validateLinkItem(validLink)).toEqual({});
  });
});

describe('validateEducationItem', () => {
  it('입력값이 모두 비어 있으면 에러를 반환하지 않는다', () => {
    expect(
      validateEducationItem({
        ...validEducation,
        institution: '',
        period: '',
        major: '',
      }),
    ).toEqual({});
  });

  it('학교만 입력하면 기간, 학과 에러를 반환한다', () => {
    expect(
      validateEducationItem({
        ...validEducation,
        period: '',
        major: '',
      }),
    ).toEqual({
      period: '기간을 입력해 주세요.',
      major: '학과(전공)를 입력해 주세요.',
    });
  });

  it('기간만 입력하면 학교, 학과 에러를 반환한다', () => {
    expect(
      validateEducationItem({
        ...validEducation,
        institution: '',
        major: '',
      }),
    ).toEqual({
      institution: '학교를 입력해 주세요.',
      major: '학과(전공)를 입력해 주세요.',
    });
  });

  it('학과만 입력하면 학교, 기간 에러를 반환한다', () => {
    expect(
      validateEducationItem({
        ...validEducation,
        institution: '',
        period: '',
      }),
    ).toEqual({
      institution: '학교를 입력해 주세요.',
      period: '기간을 입력해 주세요.',
    });
  });

  it('학교, 기간, 학과가 모두 유효하면 에러를 반환하지 않는다', () => {
    expect(validateEducationItem(validEducation)).toEqual({});
  });
});

describe('validateCertificationItem', () => {
  it('입력값이 모두 비어 있으면 에러를 반환하지 않는다', () => {
    expect(
      validateCertificationItem({
        ...validCertification,
        name: '',
        acquiredAt: '',
        issuer: '',
      }),
    ).toEqual({});
  });

  it('자격증명만 입력하면 취득일, 발행처 에러를 반환한다', () => {
    expect(
      validateCertificationItem({
        ...validCertification,
        acquiredAt: '',
        issuer: '',
      }),
    ).toEqual({
      acquiredAt: '취득일을 입력해 주세요.',
      issuer: '발행처를 입력해 주세요.',
    });
  });

  it('취득일만 입력하면 자격증명, 발행처 에러를 반환한다', () => {
    expect(
      validateCertificationItem({
        ...validCertification,
        name: '',
        issuer: '',
      }),
    ).toEqual({
      name: '자격증명을 입력해 주세요.',
      issuer: '발행처를 입력해 주세요.',
    });
  });

  it('발행처만 입력하면 자격증명, 취득일 에러를 반환한다', () => {
    expect(
      validateCertificationItem({
        ...validCertification,
        name: '',
        acquiredAt: '',
      }),
    ).toEqual({
      name: '자격증명을 입력해 주세요.',
      acquiredAt: '취득일을 입력해 주세요.',
    });
  });

  it('자격증명, 취득일, 발행처가 모두 유효하면 에러를 반환하지 않는다', () => {
    expect(validateCertificationItem(validCertification)).toEqual({});
  });
});

describe('validateExperienceItem', () => {
  it('입력값이 모두 비어 있으면 에러를 반환하지 않는다', () => {
    expect(
      validateExperienceItem({
        ...validExperience,
        company: '',
        role: '',
        start: '',
        end: '',
        isCurrent: false,
        description: '',
      }),
    ).toEqual({});
  });

  it('회사명만 입력하면 나머지 필수 항목 에러를 반환한다', () => {
    expect(
      validateExperienceItem({
        ...validExperience,
        role: '',
        start: '',
        end: '',
        description: '',
      }),
    ).toEqual({
      start: '시작일을 입력해 주세요.',
      end: '종료일을 입력해 주세요.',
      role: '직무/직책을 입력해 주세요.',
      description: '업무/성과를 입력해 주세요.',
    });
  });

  it('현재 재직 중이면 종료일이 없어도 종료일 에러를 반환하지 않는다', () => {
    expect(
      validateExperienceItem({
        ...validExperience,
        end: '',
        isCurrent: true,
      }),
    ).toEqual({});
  });

  it('현재 재직 중이 아니고 종료일이 없으면 종료일 에러를 반환한다', () => {
    expect(
      validateExperienceItem({
        ...validExperience,
        end: '',
        isCurrent: false,
      }),
    ).toEqual({
      end: '종료일을 입력해 주세요.',
    });
  });

  it('종료일이 시작일보다 빠르면 종료일 순서 에러를 반환한다', () => {
    expect(
      validateExperienceItem({
        ...validExperience,
        start: '2025-06',
        end: '2025-01',
      }),
    ).toEqual({
      end: '종료일은 시작일보다 늦어야 합니다.',
    });
  });

  it('회사명, 시작일, 종료일, 직무, 설명이 모두 유효하면 에러를 반환하지 않는다', () => {
    expect(validateExperienceItem(validExperience)).toEqual({});
  });
});

describe('validateProjectItem', () => {
  it('입력값이 모두 비어 있으면 에러를 반환하지 않는다', () => {
    expect(
      validateProjectItem({
        ...validProject,
        name: '',
        period: '',
        stack: '',
        link: '',
        description: '',
      }),
    ).toEqual({});
  });

  it('프로젝트명만 입력하면 나머지 필수 항목 에러를 반환한다', () => {
    expect(
      validateProjectItem({
        ...validProject,
        period: '',
        stack: '',
        link: '',
        description: '',
      }),
    ).toEqual({
      period: '기간을 입력해 주세요.',
      stack: '기술 스택을 입력해 주세요.',
      description: '설명을 입력해 주세요.',
    });
  });

  it('URL 형식이 올바르지 않으면 링크 에러를 반환한다', () => {
    expect(
      validateProjectItem({
        ...validProject,
        link: 'example.com/dockit',
      }),
    ).toEqual({
      link: '올바른 URL 형식이 아닙니다.',
    });
  });

  it('링크가 비어 있어도 다른 필수 값이 유효하면 에러를 반환하지 않는다', () => {
    expect(
      validateProjectItem({
        ...validProject,
        link: '',
      }),
    ).toEqual({});
  });

  it('프로젝트명, 기간, 기술 스택, 설명이 모두 유효하면 에러를 반환하지 않는다', () => {
    expect(validateProjectItem(validProject)).toEqual({});
  });
});

describe('validateOptionalSections', () => {
  it('모든 선택 섹션이 비어 있으면 isValid true와 빈 errors를 반환한다', () => {
    expect(
      validateOptionalSections({
        ...validResume,
        education: [],
        certifications: [],
        experience: [],
        projects: [],
        links: [],
      }),
    ).toEqual({
      isValid: true,
      errors: {
        education: {},
        certifications: {},
        experience: {},
        projects: {},
        links: {},
      },
    });
  });

  it('잘못된 항목이 있으면 section과 item id 기준으로 errors를 반환한다', () => {
    expect(
      validateOptionalSections({
        ...validResume,
        education: [
          {
            ...validEducation,
            period: '',
            major: '',
          },
        ],
        projects: [
          {
            ...validProject,
            link: 'example.com/dockit',
          },
        ],
      }),
    ).toEqual({
      isValid: false,
      errors: {
        education: {
          'edu-1': {
            period: '기간을 입력해 주세요.',
            major: '학과(전공)를 입력해 주세요.',
          },
        },
        certifications: {},
        experience: {},
        projects: {
          'project-1': {
            link: '올바른 URL 형식이 아닙니다.',
          },
        },
        links: {},
      },
    });
  });

  it('모든 선택 섹션 항목이 유효하면 isValid true와 빈 errors를 반환한다', () => {
    expect(validateOptionalSections(validResume)).toEqual({
      isValid: true,
      errors: {
        education: {},
        certifications: {},
        experience: {},
        projects: {},
        links: {},
      },
    });
  });
});
