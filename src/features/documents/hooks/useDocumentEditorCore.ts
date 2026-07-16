import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { exportDocumentPdf } from '@/features/documents/model/document.export';

type SaveOptions = {
  silent?: boolean;
};

type UseDocumentEditorCoreOptions<TDocument> = {
  documentId: string;
  loadDocument: (documentId: string) => TDocument;
  saveDocument: (documentId: string, document: TDocument) => void;
  createDefaultDocument: () => TDocument;
  getPrintFileName: (document: TDocument) => string;
  validateBeforePrint?: () => boolean;
  onDocumentLoaded?: () => void;
  onReset?: () => void;
};

export function useDocumentEditorCore<TDocument>({
  documentId,
  loadDocument,
  saveDocument,
  createDefaultDocument,
  getPrintFileName,
  validateBeforePrint,
  onDocumentLoaded,
  onReset,
}: UseDocumentEditorCoreOptions<TDocument>) {
  const [document, setDocument] = useState<TDocument>(() =>
    loadDocument(documentId),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [resetVersion, setResetVersion] = useState(0);
  useEffect(() => {
    setDocument(loadDocument(documentId));
    setIsDirty(false);
    setLastSavedAt(null);
    onDocumentLoaded?.();
  }, [documentId, loadDocument, onDocumentLoaded]);

  const setDocumentSafe = useCallback(
    (next: TDocument) => {
      setDocument(next);
      setIsDirty(true);
    },
    [],
  );

  const save = useCallback(
    async (opts?: SaveOptions) => {
      setIsSaving(true);
      try {
        saveDocument(documentId, document);
        setIsDirty(false);
        setLastSavedAt(Date.now());
        if (!opts?.silent) toast.success('저장 완료');
      } catch {
        toast.error('저장에 실패했습니다.');
      } finally {
        setIsSaving(false);
      }
    },
    [document, documentId, saveDocument],
  );

  const reset = useCallback(() => {
    setDocument(createDefaultDocument());
    setResetVersion((version) => version + 1);
    setIsDirty(true);
    setLastSavedAt(null);
    onReset?.();
  }, [createDefaultDocument, onReset]);

  const printDocument = useCallback(async (validate?: () => boolean) => {
    const canPrint = validate ?? validateBeforePrint;
    if (canPrint && !canPrint()) return;

    setIsExporting(true);
    try {
      exportDocumentPdf({ fileName: getPrintFileName(document) });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'PDF 저장에 실패했습니다.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [document, getPrintFileName, validateBeforePrint]);

  useEffect(() => {
    if (!isDirty || isSaving) return;

    const AUTO_SAVE_DELAY = 60_000;
    const timer = setTimeout(() => save({ silent: true }), AUTO_SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [document, isDirty, isSaving, save]);

  return {
    document,
    setDocument: setDocumentSafe,
    save,
    reset,
    printDocument,
    resetVersion,
    isDirty,
    isExporting,
    isSaving,
    lastSavedAt,
  };
}
