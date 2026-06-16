import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CoverLetter } from '../model/coverLetter.types';
import { defaultCoverLetter } from '../model/coverLetter.defaults';
import { loadCoverLetter, saveCoverLetter } from '../model/coverLetter.storage';
import { toast } from 'sonner';
import {
    exportDocumentImage,
    exportDocumentPdf,
} from '@/features/documents/model/document.export';
import { useDocumentEditorStatus } from '@/features/documents/hooks/useDocumentEditorStatus';

type CoverLetterEditorState = {
  coverLetterId: string;
  coverLetter: CoverLetter;
  setCoverLetter: (next: CoverLetter) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  exportImage: () => Promise<void>;
  printCoverLetter: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  resetVersion: number;
  totalValidationErrorCount: number;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
};

const CoverLetterEditorContext =
  createContext<CoverLetterEditorState | null>(null);

export function CoverLetterEditorProvider({
  coverLetterId,
  children,
}: {
  coverLetterId: string;
  children: React.ReactNode;
}) {
  const [coverLetter, setCoverLetter] = useState<CoverLetter>(() =>
    loadCoverLetter(coverLetterId),
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
    setCoverLetter(loadCoverLetter(coverLetterId));
    setIsDirty(false);
    setLastSavedAt(null);
  }, [coverLetterId, setIsDirty, setLastSavedAt]);

  const setCoverLetterSafe = useCallback(
    (next: CoverLetter) => {
      setCoverLetter(next);
      setIsDirty(true);
    },
    [setIsDirty],
  );

  const persist = useCallback(
    async (opts?: { silent?: boolean }) => {
      setIsSaving(true);
      try {
        saveCoverLetter(coverLetterId, coverLetter);
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
      coverLetter,
      coverLetterId,
      setIsDirty,
      setIsSaving,
      setLastSavedAt,
    ],
  );

  const reset = useCallback(() => {
    setCoverLetter(defaultCoverLetter());
    setResetVersion((version) => version + 1);
    setIsDirty(true);
    setLastSavedAt(null);
  }, [setIsDirty, setLastSavedAt]);

  const getExportFileName = useCallback(
    (extension: 'png' | 'pdf') => {
      const title = coverLetter.title.trim() || 'cover-letter';
      return `${title}.${extension}`;
    },
    [coverLetter.title],
  );

  const exportImage = useCallback(async () => {
    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      await exportDocumentImage({
        fileName: getExportFileName('png'),
        target: previewRef.current,
      });
      toast.success('이미지 저장 완료');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '이미지 저장에 실패했습니다.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [getExportFileName, setIsExporting]);

  const printCoverLetter = useCallback(async () => {
    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      exportDocumentPdf({ fileName: getExportFileName('pdf') });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'PDF 저장에 실패했습니다.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [getExportFileName, setIsExporting]);

  useEffect(() => {
    if (!isDirty || isSaving) return;

    const AUTO_SAVE_DELAY = 60_000;
    const timer = setTimeout(() => persist({ silent: true }), AUTO_SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [persist, isDirty, isSaving]);

  const value = useMemo(
    () => ({
      coverLetterId,
      coverLetter,
      setCoverLetter: setCoverLetterSafe,
      save: persist,
      reset,
      exportImage,
      printCoverLetter,
      previewRef,
      resetVersion,
      totalValidationErrorCount: 0,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      coverLetter,
      coverLetterId,
      setCoverLetterSafe,
      persist,
      reset,
      exportImage,
      printCoverLetter,
      resetVersion,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <CoverLetterEditorContext.Provider value={value}>
      {children}
    </CoverLetterEditorContext.Provider>
  );
}

export function useCoverLetterEditor() {
  const ctx = useContext(CoverLetterEditorContext);
  if (!ctx) {
    throw new Error(
      'useCoverLetterEditor must be used within CoverLetterEditorProvider',
    );
  }
  return ctx;
}
