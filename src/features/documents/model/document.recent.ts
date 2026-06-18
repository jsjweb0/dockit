import type { DocumentDraftSummary } from '@/features/documents/model/document.storage';
import { editorConfigs } from '@/layout/editor.config';

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

const recentDocumentDraftSources: RecentDocumentDraftSource[] =
  editorConfigs.flatMap(({ template, recent }) => {
    if (template.status !== 'available' || !template.href || !recent) return [];

    return {
      documentLabel: template.title,
      href: template.href,
      ...recent,
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
