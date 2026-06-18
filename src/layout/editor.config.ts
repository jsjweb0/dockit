import type { ComponentType, ReactNode } from 'react';
import {
  FileText,
  IdCard,
  ListChecks,
  PanelsTopLeft,
  Presentation,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  ResumeEditorProvider,
  useResumeEditor,
} from '@/features/resume/context/resumeEditor.context';
import type { Resume } from '@/features/resume/model/resume.types';
import {
  deleteResumeDraft,
  listRecentResumeDrafts,
} from '@/features/resume/model/resume.storage';
import {
  CoverLetterEditorProvider,
  useCoverLetterEditor,
} from '@/features/coverLetter/context/coverLetterEditor.context';
import type { CoverLetter } from '@/features/coverLetter/model/coverLetter.types';
import {
  deleteCoverLetterDraft,
  listRecentCoverLetterDrafts,
} from '@/features/coverLetter/model/coverLetter.storage';
import { sampleResume } from '@/features/resume/model/resume.sample';
import { sampleCoverLetter } from '@/features/coverLetter/model/coverLetter.sample';
import type { DocumentDraftSummary } from '@/features/documents/model/document.storage';

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

export type DocumentEditorProviderProps = {
  documentId: string;
  children: ReactNode;
};

export type CommonDocumentEditorState<TDocument> = {
  document: TDocument;
  setDocument: (next: TDocument) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printDocument: () => Promise<void>;
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
  lastSavedAt: number | null;
  totalValidationErrorCount: number;
};

export type DocumentEditorConfig<TDocument> = {
  template: DocumentTemplate;
  Provider: ComponentType<DocumentEditorProviderProps>;
  useEditor: () => CommonDocumentEditorState<TDocument>;
  getTitle: (document: TDocument) => string;
  getPageTitle: (document: TDocument, template: DocumentTemplate) => string;
  createSample: () => TDocument;
  recent?: {
    listDrafts: (limit?: number) => DocumentDraftSummary[];
    deleteDraft: (id: string) => void;
  };
};

export type AnyDocumentEditorConfig = DocumentEditorConfig<unknown>;

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
    status: 'planned',
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

const getDocumentTemplate = (id: string) => {
  const template = documentTemplates.find((item) => item.id === id);
  if (!template) throw new Error(`Unknown document template: ${id}`);
  return template;
};

const createDocumentEditorConfig = <TDocument,>(
  config: DocumentEditorConfig<TDocument>,
): AnyDocumentEditorConfig => config as unknown as AnyDocumentEditorConfig;

const resumeTemplate = getDocumentTemplate('resume');
const coverLetterTemplate = getDocumentTemplate('cover-letter');

const resumeEditorConfig = createDocumentEditorConfig<Resume>({
  template: resumeTemplate,
  Provider: ResumeEditorProvider,
  useEditor: useResumeEditor,
  getTitle: (resume) => resume.basics?.name?.trim() ?? '',
  getPageTitle: (resume, template) => {
    const name = resume.basics?.name?.trim();
    return name ? `${name} 이력서` : `새 ${template.title}`;
  },
  createSample: sampleResume,
  recent: {
    listDrafts: listRecentResumeDrafts,
    deleteDraft: deleteResumeDraft,
  },
});

const coverLetterEditorConfig = createDocumentEditorConfig<CoverLetter>({
  template: coverLetterTemplate,
  Provider: CoverLetterEditorProvider,
  useEditor: useCoverLetterEditor,
  getTitle: (coverLetter) => coverLetter.title.trim(),
  getPageTitle: (coverLetter, template) => {
    const title = coverLetter.title.trim();
    return title || `새 ${template.title}`;
  },
  createSample: sampleCoverLetter,
  recent: {
    listDrafts: listRecentCoverLetterDrafts,
    deleteDraft: deleteCoverLetterDraft,
  },
});

export const editorConfigs = [resumeEditorConfig, coverLetterEditorConfig];

export const getEditorConfigByPathname = (pathname: string) => {
  const config = editorConfigs.find(({ template }) => {
    if (!template.href) return false;
    return pathname === template.href || pathname.startsWith(`${template.href}/`);
  });

  if (!config) throw new Error(`Unknown editor route: ${pathname}`);
  return config;
};
