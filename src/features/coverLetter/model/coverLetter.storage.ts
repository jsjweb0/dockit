import { documentTemplates } from '@/features/documents/model/documentTemplates';
import type { DocumentTemplate } from '@/features/documents/model/documentTemplates';
import {
  createDocumentStorage,
  type DocumentDraftSummary,
} from '@/features/documents/model/document.storage';
import { defaultCoverLetter } from './coverLetter.defaults';
import type { CoverLetter } from './coverLetter.types';

export type CoverLetterDraftSummary = DocumentDraftSummary;

function getDraftTitle(
  coverLetter: CoverLetter,
  template: DocumentTemplate = documentTemplates[1],
) {
  const title = coverLetter.title.trim();
  return title || template.title;
}

function getDraftDescription(coverLetter: CoverLetter) {
  const completedSectionCount = coverLetter.sections.filter((section) =>
    section.content.trim(),
  ).length;

  if (completedSectionCount > 0)
    return `${completedSectionCount}개 문항 작성 중`;

  return '작성 중인 문서';
}

function normalizeCoverLetter(
  parsed: Partial<CoverLetter>,
  defaults: CoverLetter,
): CoverLetter {
  return {
    ...defaults,
    ...parsed,
    meta: { ...defaults.meta, ...parsed.meta },
    title: typeof parsed.title === 'string' ? parsed.title : defaults.title,
    sections: Array.isArray(parsed.sections)
      ? parsed.sections
      : defaults.sections,
  };
}

const coverLetterStorage = createDocumentStorage<CoverLetter>({
  documentType: 'cover-letter',
  storageKeyPrefix: 'cover-letter',
  draftsKey: 'cover-letter:drafts',
  createDefault: defaultCoverLetter,
  normalize: normalizeCoverLetter,
  getDraftContent: (coverLetter) => ({
    title: getDraftTitle(coverLetter),
    description: getDraftDescription(coverLetter),
  }),
});

export const loadCoverLetter = coverLetterStorage.load;
export const saveCoverLetter = coverLetterStorage.save;
export const deleteCoverLetterDraft = coverLetterStorage.deleteDraft;
export const listRecentCoverLetterDrafts = coverLetterStorage.listRecentDrafts;
