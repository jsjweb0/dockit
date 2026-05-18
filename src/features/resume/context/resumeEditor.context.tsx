import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Resume } from '../model/resume.types';
import { loadResume, resetResume, saveResume } from '../model/resume.storage';
import { toast } from 'sonner';
import { exportResumeImage } from '../model/resume.export';

type ResumeEditorState = {
  resumeId: string;
  resume: Resume;
  setResume: (next: Resume) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  exportImage: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
};

const ResumeEditorContext = createContext<ResumeEditorState | null>(null);

export function ResumeEditorProvider({
  resumeId,
  children,
}: {
  resumeId: string;
  children: React.ReactNode;
}) {
  const [resume, setResume] = useState<Resume>(() => loadResume(resumeId));
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setResume(loadResume(resumeId));
    setIsDirty(false);
  }, [resumeId]);

  const setResumeSafe = useCallback((next: Resume) => {
    setResume(next);
    setIsDirty(true);
  }, []);

  const persist = useCallback(
    async (opts?: { silent?: boolean }) => {
      setIsSaving(true);
      try {
        saveResume(resumeId, resume);
        setIsDirty(false);
        setLastSavedAt(Date.now());
        // 수동 저장일 때만 토스트
        if (!opts?.silent) toast.success('저장 완료');
      } catch {
        toast.error('저장에 실패했습니다.');
      } finally {
        setIsSaving(false);
      }
    },
    [resume, resumeId],
  );

  const reset = useCallback(() => {
    resetResume(resumeId);
    setResume(loadResume(resumeId));
    setIsDirty(false);
    setLastSavedAt(null);
  }, [resumeId]);

  const exportImage = useCallback(async () => {
    if (!previewRef.current) {
      toast.error('내보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      const name = resume.basics.name.trim() || 'resume';
      await exportResumeImage({
        fileName: `${name}-resume.png`,
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
  }, [resume.basics.name]);

  // 자동 저장
  useEffect(() => {
    if (!isDirty || isSaving) return;

    const AUTO_SAVE_DELAY = 60_000; // 1분
    const timer = setTimeout(() => persist({ silent: true }), AUTO_SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [persist, resume, isDirty, isSaving]);

  const value = useMemo(
    () => ({
      resumeId,
      resume,
      setResume: setResumeSafe,
      save: persist,
      reset,
      exportImage,
      previewRef,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      resume,
      resumeId,
      setResumeSafe,
      persist,
      reset,
      exportImage,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <ResumeEditorContext.Provider value={value}>
      {children}
    </ResumeEditorContext.Provider>
  );
}

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx)
    throw new Error('useResumeEditor must be used within ResumeEditorProvider');
  return ctx;
}
