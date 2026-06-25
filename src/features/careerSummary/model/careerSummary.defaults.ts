import { createId } from '@/lib/utils';
import type { CareerSummary } from './careerSummary.types';

export function defaultCareerSummary(): CareerSummary {
  return {
    meta: { version: 1 },
    title: '',
    experiences: [
      {
        id: createId(),
        company: '',
        team: '',
        role: '',
        period: '',
        responsibilities: '',
        achievements: [
          {
            title: '주요 성과 1',
            description: '- 담당하신 업무와 성과 1',
          },
        ],
      },
    ],
    techStack: '',
  };
}
