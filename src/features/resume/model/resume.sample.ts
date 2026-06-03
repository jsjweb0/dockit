import type { Resume } from './resume.types';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function sampleResume(): Resume {
  return {
    meta: { version: 1 },
    basics: {
      applicationType: 'experienced',
      name: '김도킷',
      nameEn: 'Kim Dockit',
      birth: '1989-03-12',
      phone: '010-1234-5678',
      email: 'dockit@example.com',
      address: '서울특별시 강남구 삼성동',
      title: '프론트엔드 개발자',
      summary:
        'React와 TypeScript 기반의 반응형 UI 구현에 관심이 있는 주니어 프론트엔드 개발자입니다.',
      submittedAt: '2026-06-02',
    },
    education: [
      {
        id: uid(),
        period: '2012-03 - 2015-02',
        institution: '한국대학교',
        major: '컴퓨터공학과',
      },
    ],
    certifications: [
      {
        id: uid(),
        acquiredAt: '2017-04-04',
        name: '컴퓨터그래픽스운용기능사',
        issuer: '한국산업인력공단',
      },
      {
        id: uid(),
        acquiredAt: '2017-03-04',
        name: '웹디자인기능사',
        issuer: '한국산업인력공단',
      },
    ],
    experience: [
      {
        id: uid(),
        company: '프론트엔드 스튜디오',
        role: '과장',
        start: '2018-01',
        isCurrent: false,
        end: '2026-06',
        description:
          '- React와 TypeScript 기반의 입력 폼과 실시간 이력서 미리보기를 구현했습니다.\n' +
          '- 모바일/태블릿/데스크톱 화면에서 작성 흐름이 유지되도록 반응형 레이아웃을 조정했습니다.\n' +
          '- 키보드 포커스 이동, 다이얼로그 포커스 복귀, table caption/scope 적용으로 접근성을 개선했습니다.',
      },
    ],
    projects: [
      {
        id: uid(),
        name: 'Dockit',
        period: '2026-04 ~ 진행중',
        stack: 'React, TypeScript, Vite',
        description:
          'DocKit은 문서양식을 입력 폼으로 작성하고, 제출용 레이아웃을 실시간으로 확인하는 React 문서 작성 도구입니다.',
        link: 'https://dockit.jsjweb0.workers.dev/',
      },
      {
        id: uid(),
        name: 'NEWTRONOME',
        period: '2025-09 ~ 2026-04',
        stack: 'React, Vite, Firebase Authentication',
        description:
          'SoundCloud API를 연동해 트랙 검색, 랜덤 재생, 플레이리스트 재생, 로그인 후 좋아요 기능을 제공하는 React 음악 플레이어입니다.',
        link: 'https://newtronome.jsjweb0.workers.dev/',
      },
    ],
    links: [
      {
        id: uid(),
        label: 'Portfolio',
        url: 'https://github.com/jsjweb0/',
      },
      {
        id: uid(),
        label: 'Github',
        url: 'https://jsjweb0.github.io/Portfoliopage/',
      },
    ],
    skills: {
      primary: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
      tools: ['Git', 'GitHub', 'Figma', 'VS Code'],
    },
  };
}
