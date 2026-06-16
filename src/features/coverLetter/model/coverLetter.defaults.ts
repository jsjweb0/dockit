import { createId } from '@/lib/utils';
import type { CoverLetter } from './coverLetter.types';

export function defaultCoverLetter(): CoverLetter {
  return {
    meta: { version: 1 },
    title: '',
    sections: [
      {
        id: createId(),
        title: '성장 과정',
        prompt: '지원 직무와 연결되는 경험이나 가치관을 작성해 주세요.',
        content: '',
      },
      {
        id: createId(),
        title: '성격 및 장단점',
        prompt: '업무에 도움이 되는 강점과 개선 중인 점을 함께 작성해 주세요.',
        content: '',
      },
      {
        id: createId(),
        title: '지원 동기',
        prompt: '지원한 직무나 회사에 관심을 갖게 된 이유를 작성해 주세요.',
        content: '',
      },
      {
        id: createId(),
        title: '입사 후 포부',
        prompt: '입사 후 기여하고 싶은 점과 성장 목표를 작성해 주세요.',
        content: '',
      },
    ],
  };
}
