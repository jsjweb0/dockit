import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { exportDocumentPdf } from '@/features/documents/model/document.export';
import { useDocumentEditorStatus } from '@/features/documents/hooks/useDocumentEditorStatus';

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
  const {
    isDirty,
    setIsDirty,
    isSaving,
    setIsSaving,
    isExporting,
    setIsExporting,
    lastSavedAt,
    setLastSavedAt,
  } = useDocumentEditorStatus();
  const [resetVersion, setResetVersion] = useState(0);
  const previewRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setDocument(loadDocument(documentId));
    setIsDirty(false);
    setLastSavedAt(null);
    onDocumentLoaded?.();
  }, [documentId, loadDocument, onDocumentLoaded, setIsDirty, setLastSavedAt]);

  const setDocumentSafe = useCallback(
    (next: TDocument) => {
      setDocument(next);
      setIsDirty(true);
    },
    [setIsDirty],
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
    [
      document,
      documentId,
      saveDocument,
      setIsDirty,
      setIsSaving,
      setLastSavedAt,
    ],
  );

  const reset = useCallback(() => {
    setDocument(createDefaultDocument());
    setResetVersion((version) => version + 1);
    setIsDirty(true);
    setLastSavedAt(null);
    onReset?.();
  }, [createDefaultDocument, onReset, setIsDirty, setLastSavedAt]);

  const printDocument = useCallback(async (validate?: () => boolean) => {
    const canPrint = validate ?? validateBeforePrint;
    if (canPrint && !canPrint()) return;

    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

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
  }, [document, getPrintFileName, setIsExporting, validateBeforePrint]);

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
    previewRef,
    resetVersion,
    isDirty,
    isExporting,
    isSaving,
    lastSavedAt,
  };
}
