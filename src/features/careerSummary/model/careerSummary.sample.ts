import { createId } from '@/lib/utils';
import type { CareerSummary } from './careerSummary.types';

export function sampleCareerSummary(): CareerSummary {
  return {
    meta: { version: 1 },
    title: '프론트엔드 개발자 경력기술서',
    experiences: [
      {
        id: createId(),
        company: '독킷스튜디오',
        team: '개발팀',
        role: '과장',
        period: '2018-01 - 2026-03',
        responsibilities: '프론트엔드 개발',
        achievements: [
          {
            title: '웹 성능 및 사용자 경험(UX) 최적화',
            description:
              '- 로딩 속도 개선: Lighthouse 또는 WebPageTest를 활용해 초기 로딩 속도를 단축하여 페이지 이탈률 감소 및 체류 시간 증가.\n' +
              '- 반응형 웹 및 접근성 구현: 다양한 디바이스(모바일, 태블릿, 데스크톱) 환경에서 일관된 화면을 제공하고 웹 접근성을 준수하여 사용자 만족도(CS) 향상.\n' +
              '- SEO(검색엔진 최적화) 개선: Next.js 등을 도입해 SSR(서버 사이드 렌더링)을 적용, 검색 엔진 노출수 증가 및 유기적 트래픽(Organic Traffic) 상승',
          },
        ],
      },
    ],
    techStack: 'React, TypeScript, JavaScript, Git',
  };
}
