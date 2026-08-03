import type { DocumentDraftSummary } from '@/features/documents/model/document.storage';
import {
  deleteCareerSummaryDraft,
  listRecentCareerSummaryDrafts,
} from '@/features/careerSummary/model/careerSummary.storage';
import {
  deleteCoverLetterDraft,
  listRecentCoverLetterDrafts,
} from '@/features/coverLetter/model/coverLetter.storage';
import {
  deleteResumeDraft,
  listRecentResumeDrafts,
} from '@/features/resume/model/resume.storage';
import { getDocumentTemplate } from '@/layout/documentTemplates';

type RecentDocumentDraftSource = {
  documentLabel: string;
  href: string;
  listDrafts: (limit?: number) => DocumentDraftSummary[];
  deleteDraft: (id: string) => void;
};

export type RecentDocumentDraft = DocumentDraftSummary & {
  href: string;
  documentLabel: string;
  deleteDraft: (id: string) => void;
};

const recentDocumentDraftSources: RecentDocumentDraftSource[] = [
  {
    template: getDocumentTemplate('resume'),
    listDrafts: listRecentResumeDrafts,
    deleteDraft: deleteResumeDraft,
  },
  {
    template: getDocumentTemplate('cover-letter'),
    listDrafts: listRecentCoverLetterDrafts,
    deleteDraft: deleteCoverLetterDraft,
  },
  {
    template: getDocumentTemplate('career-summary'),
    listDrafts: listRecentCareerSummaryDrafts,
    deleteDraft: deleteCareerSummaryDraft,
  },
].flatMap(({ template, listDrafts, deleteDraft }) => {
  if (template.status !== 'available' || !template.href) return [];

  return {
    documentLabel: template.title,
    href: template.href,
    listDrafts,
    deleteDraft,
  };
});

export function listRecentDocumentDrafts(limit = 3): RecentDocumentDraft[] {
  return recentDocumentDraftSources
    .flatMap((source) =>
      source.listDrafts(limit).map((draft) => ({
        ...draft,
        href: `${source.href}/${draft.id}`,
        documentLabel: source.documentLabel,
        deleteDraft: source.deleteDraft,
      })),
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}
