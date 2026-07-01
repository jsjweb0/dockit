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
        startDate: '2025-03',
        endDate: '',
        isCurrent: true,
        responsibilities: 'Frontend Developer',
        achievements: [
          {
            title: '웹 성능 및 사용자 경험(UX) 최적화',
            description: '',
          },
          {
            title: '컴포넌트 재사용성 강화',
            description: '',
          },
          {
            title:
              '단위 테스트(Unit Test) 및 E2E 테스트 도입으로 배포 안정성 확보',
            description: '',
          },
        ],
        techStack: ['React', 'TypeScript', 'JavaScript', 'Git'],
      },
      {
        id: createId(),
        company: '네이보(NAVO)',
        team: '개발팀',
        role: '사원',
        startDate: '2018-01',
        endDate: '2025-03',
        isCurrent: false,
        responsibilities: 'Frontend Developer',
        achievements: [
          {
            title: '웹 성능 및 사용자 경험(UX) 최적화',
            description:
              '- 초기 로딩 속도를 단축하여 페이지 이탈률 감소 및 체류 시간 증가.\n' +
              '- 반응형 웹 및 접근성 구현: 다양한 디바이스(모바일, 태블릿, 데스크톱) 환경에서 일관된 화면을 제공\n' +
              '- 웹 접근성을 준수하여 사용자 만족도(CS) 향상.\n' +
              '- SEO(검색엔진 최적화) 개선: Next.js를 도입해 SSR을 적용, 검색 엔진 노출수 증가 및 유기적 트래픽 상승',
          },
          {
            title: '기술 및 운영 성과',
            description:
              '- 프로젝트 번들 사이즈 최적화\n' +
              '- 컴포넌트 재사용성 및 유지보수성 향상\n' +
              '- 크로스 브라우징 및 에러율 감소',
          },
        ],
        techStack: ['React', 'TypeScript', 'JavaScript', 'Git'],
      },
    ],
  };
}
