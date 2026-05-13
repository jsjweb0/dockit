import type { Resume } from './resume.types';
import { documentTemplates } from '../../documents/model/documentTemplates';
import type { DocumentTemplate } from '../../documents/model/documentTemplates';
import { defaultResume } from './resume.defaults';

const keyOf = (id: string) => `resume:${id}`;
const draftsKey = 'resume:drafts';

export type ResumeDraftSummary = {
  id: string;
  title: string;
  description: string;
  updatedAt: number;
};

function getDraftTitle(
  resume: Resume,
  template: DocumentTemplate = documentTemplates[0],
) {
  const name = resume.basics.name.trim();
  return name ? `${name} ${template.title}` : template.title;
}

function getDraftDescription(resume: Resume) {
  const role = resume.basics.title.trim();
  const email = resume.basics.email.trim();
  if (role && email) return `${role} · ${email}`;
  return role || email || '작성 중인 문서';
}

function readDrafts(): ResumeDraftSummary[] {
  const raw = localStorage.getItem(draftsKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ResumeDraftSummary[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (draft) =>
        typeof draft.id === 'string' &&
        typeof draft.title === 'string' &&
        typeof draft.description === 'string' &&
        typeof draft.updatedAt === 'number',
    );
  } catch {
    return [];
  }
}

function writeDrafts(drafts: ResumeDraftSummary[]) {
  localStorage.setItem(draftsKey, JSON.stringify(drafts));
}

export function loadResume(id: string): Resume {
  const raw = localStorage.getItem(keyOf(id));
  if (!raw) return defaultResume();

  try {
    const parsed = JSON.parse(raw) as Resume;
    // 최소 안전장치: basics 없으면 기본값으로
    return parsed ?? defaultResume();
  } catch {
    return defaultResume();
  }
}

export function saveResume(id: string, resume: Resume) {
  const updatedAt = Date.now();
  const nextDraft: ResumeDraftSummary = {
    id,
    title: getDraftTitle(resume),
    description: getDraftDescription(resume),
    updatedAt,
  };
  const otherDrafts = readDrafts().filter((draft) => draft.id !== id);

  localStorage.setItem(keyOf(id), JSON.stringify(resume));
  writeDrafts(
    [nextDraft, ...otherDrafts].sort((a, b) => b.updatedAt - a.updatedAt),
  );
}

export function resetResume(id: string) {
  localStorage.removeItem(keyOf(id));
  writeDrafts(readDrafts().filter((draft) => draft.id !== id));
}

export function listRecentResumeDrafts(limit = 3): ResumeDraftSummary[] {
  return readDrafts()
    .filter((draft) => localStorage.getItem(keyOf(draft.id)))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}
