import {
  FileText,
  IdCard,
  ListChecks,
  PanelsTopLeft,
  Presentation,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DocumentTemplateStatus = 'available' | 'planned';

export type DocumentTemplate = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  status: DocumentTemplateStatus;
  href?: string;
  icon: LucideIcon;
};

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'resume',
    title: '국문 이력서',
    description:
      '기본 정보, 학력, 경력, 프로젝트, 스킬을 입력하고 문서 형태로 미리봅니다.',
    purpose: '채용 제출용 이력서 작성',
    status: 'available',
    href: '/resume',
    icon: IdCard,
  },
  {
    id: 'cover-letter',
    title: '자기소개서',
    description:
      '성장과정, 성격 및 장단점, 지원동기 등을 정리해 읽기 좋은 제출 문서로 구성합니다.',
    purpose: '문항별 자기소개서 작성',
    status: 'available',
    href: '/cover-letter',
    icon: FileText,
  },
  {
    id: 'career-summary',
    title: '경력기술서',
    description:
      '회사, 역할, 주요 업무, 성과를 항목별로 정리해 경력 중심 문서로 보여줍니다.',
    purpose: '경력/실무 경험 정리',
    status: 'available',
    href: '/career-summary',
    icon: ListChecks,
  },
  {
    id: 'project-report',
    title: '프로젝트 보고서',
    description:
      '프로젝트 목적, 역할, 문제 해결, 개선 결과를 포트폴리오 설명용 문서로 만듭니다.',
    purpose: '포트폴리오 프로젝트 정리',
    status: 'planned',
    icon: PanelsTopLeft,
  },
  {
    id: 'meeting-minutes',
    title: '회의록',
    description: '회의 중에 일어난 일을 기록해 문서로 만듭니다.',
    purpose: '회의록',
    status: 'planned',
    icon: Presentation,
  },
];

export const getDocumentTemplate = (id: string) => {
  const template = documentTemplates.find((item) => item.id === id);
  if (!template) throw new Error(`Unknown document template: ${id}`);
  return template;
};
