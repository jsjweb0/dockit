export type DocumentDraftSummary = {
  id: string;
  documentType: string;
  title: string;
  description: string;
  updatedAt: number;
};

type DraftContent = {
  title: string;
  description: string;
};

type CreateDocumentStorageOptions<TDocument> = {
  documentType: string;
  storageKeyPrefix?: string;
  draftsKey?: string;
  createDefault: () => TDocument;
  normalize?: (document: Partial<TDocument>, defaults: TDocument) => TDocument;
  getDraftContent: (document: TDocument) => DraftContent;
};

function isDocumentDraftSummary(
  draft: Partial<DocumentDraftSummary>,
): draft is DocumentDraftSummary {
  return (
    typeof draft.id === 'string' &&
    typeof draft.title === 'string' &&
    typeof draft.description === 'string' &&
    typeof draft.updatedAt === 'number'
  );
}

export function createDocumentStorage<TDocument>({
  documentType,
  storageKeyPrefix = documentType,
  draftsKey = `${storageKeyPrefix}:drafts`,
  createDefault,
  normalize,
  getDraftContent,
}: CreateDocumentStorageOptions<TDocument>) {
  const keyOf = (id: string) => `${storageKeyPrefix}:${id}`;

  function readDrafts(): DocumentDraftSummary[] {
    const raw = localStorage.getItem(draftsKey);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as Partial<DocumentDraftSummary>[];
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(isDocumentDraftSummary)
        .map((draft) => ({
          id: draft.id,
          documentType:
            typeof draft.documentType === 'string'
              ? draft.documentType
              : documentType,
          title: draft.title,
          description: draft.description,
          updatedAt: draft.updatedAt,
        }));
    } catch {
      return [];
    }
  }

  function writeDrafts(drafts: DocumentDraftSummary[]) {
    localStorage.setItem(draftsKey, JSON.stringify(drafts));
  }

  function load(id: string): TDocument {
    const defaults = createDefault();
    const raw = localStorage.getItem(keyOf(id));
    if (!raw) return defaults;

    try {
      const parsed = JSON.parse(raw) as Partial<TDocument> | null;
      if (!parsed) return defaults;

      return normalize ? normalize(parsed, defaults) : { ...defaults, ...parsed };
    } catch {
      return defaults;
    }
  }

  function save(id: string, document: TDocument) {
    const updatedAt = Date.now();
    const draftContent = getDraftContent(document);
    const nextDraft: DocumentDraftSummary = {
      id,
      documentType,
      ...draftContent,
      updatedAt,
    };
    const otherDrafts = readDrafts().filter((draft) => draft.id !== id);

    localStorage.setItem(keyOf(id), JSON.stringify(document));
    writeDrafts(
      [nextDraft, ...otherDrafts].sort((a, b) => b.updatedAt - a.updatedAt),
    );
  }

  function deleteDraft(id: string) {
    localStorage.removeItem(keyOf(id));
    writeDrafts(readDrafts().filter((draft) => draft.id !== id));
  }

  function listRecentDrafts(limit = 3): DocumentDraftSummary[] {
    return readDrafts()
      .filter((draft) => localStorage.getItem(keyOf(draft.id)))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  }

  return {
    load,
    save,
    deleteDraft,
    listRecentDrafts,
  };
}
