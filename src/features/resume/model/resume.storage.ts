import type { Resume } from './resume.types';
import { defaultResume } from './resume.defaults';
import {
  createDocumentStorage,
  type DocumentDraftSummary,
} from '@/features/documents/model/document.storage';

export type ResumeDraftSummary = DocumentDraftSummary;

const RESUME_DOCUMENT_TITLE = '국문 이력서';

function getDraftTitle(resume: Resume) {
  const name = resume.basics.name.trim();
  return name ? `${name} ${RESUME_DOCUMENT_TITLE}` : RESUME_DOCUMENT_TITLE;
}

function getDraftDescription(resume: Resume) {
  const role = resume.basics.title.trim();
  const email = resume.basics.email.trim();
  if (role && email) return `${role} · ${email}`;
  return role || email || '작성 중인 문서';
}

function normalizeResume(parsed: Partial<Resume>, defaults: Resume): Resume {
  return {
    ...defaults,
    ...parsed,
    meta: { ...defaults.meta, ...parsed.meta },
    basics: { ...defaults.basics, ...parsed.basics },
    education: Array.isArray(parsed.education)
      ? parsed.education
      : defaults.education,
    certifications: Array.isArray(parsed.certifications)
      ? parsed.certifications
      : defaults.certifications,
    experience: Array.isArray(parsed.experience)
      ? parsed.experience
      : defaults.experience,
    projects: Array.isArray(parsed.projects)
      ? parsed.projects
      : defaults.projects,
    links: Array.isArray(parsed.links) ? parsed.links : defaults.links,
    skills: { ...defaults.skills, ...parsed.skills },
  };
}

const resumeStorage = createDocumentStorage<Resume>({
  documentType: 'resume',
  storageKeyPrefix: 'resume',
  draftsKey: 'resume:drafts',
  createDefault: defaultResume,
  normalize: normalizeResume,
  getDraftContent: (resume) => ({
    title: getDraftTitle(resume),
    description: getDraftDescription(resume),
  }),
});

export const loadResume = resumeStorage.load;
export const saveResume = resumeStorage.save;
export const deleteResumeDraft = resumeStorage.deleteDraft;
export const listRecentResumeDrafts = resumeStorage.listRecentDrafts;
