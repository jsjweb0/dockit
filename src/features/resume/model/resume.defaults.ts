import { createId } from '@/lib/utils';
import type { Resume } from './resume.types';

function todayKorea() {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
  });

  return formatter.format(new Date()); // YYYY-MM-DD
}

export function defaultResume(): Resume {
  return {
    meta: { version: 1 },
    basics: {
      applicationType: '',
      name: '',
      nameEn: '',
      birth: '',
      phone: '',
      email: '',
      address: '',
      title: '프론트엔드 개발자',
      summary: '',
      submittedAt: todayKorea(),
    },
    education: [
      {
        id: createId(),
        period: '',
        institution: '',
        major: '',
      },
    ],
    certifications: [
      {
        id: createId(),
        acquiredAt: '',
        name: '',
        issuer: '',
      },
    ],
    experience: [
      {
        id: createId(),
        company: '',
        role: '',
        start: '',
        isCurrent: false,
        end: '',
        description: '',
      },
    ],
    projects: [
      {
        id: createId(),
        name: '',
        period: '',
        stack: '',
        description: '',
        link: '',
      },
    ],
    links: [{ id: createId(), label: '', url: '' }],
    skills: {
      primary: [],
      tools: [],
    },
  };
}
