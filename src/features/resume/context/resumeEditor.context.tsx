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
import {
  exportResumeImage,
  exportResumePdf as exportResumePdfFile,
} from '../model/resume.export';
import {
  BASICS_VALIDATED_FIELDS,
  validateBasics,
  validateBasicsField,
  type BasicsFieldErrors,
  type BasicsValidatedField,
} from '../model/resume.basics.validation';

type ResumeEditorState = {
  resumeId: string;
  resume: Resume;
  setResume: (next: Resume) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  exportImage: () => Promise<void>;
  exportResumePdf: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  basicsErrors: BasicsFieldErrors;
  touchBasicsField: (
    field: BasicsValidatedField,
    basics?: Resume['basics'],
  ) => void;
  revalidateBasicsField: (
    field: BasicsValidatedField,
    basics?: Resume['basics'],
  ) => void;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
};

const ResumeEditorContext = createContext<ResumeEditorState | null>(null);

const emptyTouchedBasicsFields = () =>
  new Set<BasicsValidatedField>();

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
  const [basicsErrors, setBasicsErrors] = useState<BasicsFieldErrors>({});
  const [touchedBasicsFields, setTouchedBasicsFields] =
    useState(emptyTouchedBasicsFields);
  const previewRef = useRef<HTMLElement | null>(null);

  const clearBasicsValidation = useCallback(() => {
    setBasicsErrors({});
    setTouchedBasicsFields(emptyTouchedBasicsFields());
  }, []);

  useEffect(() => {
    setResume(loadResume(resumeId));
    setIsDirty(false);
    clearBasicsValidation();
  }, [resumeId, clearBasicsValidation]);

  const setResumeSafe = useCallback((next: Resume) => {
    setResume(next);
    setIsDirty(true);
  }, []);

  const touchBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      setTouchedBasicsFields((prev) => new Set(prev).add(field));
      const message = validateBasicsField(field, basics);
      setBasicsErrors((prev) => {
        if (!message) {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        }
        return { ...prev, [field]: message };
      });
    },
    [resume.basics],
  );

  const revalidateBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      if (!touchedBasicsFields.has(field)) return;

      const message = validateBasicsField(field, basics);
      setBasicsErrors((prev) => {
        if (!message) {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        }
        return { ...prev, [field]: message };
      });
    },
    [resume.basics, touchedBasicsFields],
  );

  const validateAllBasics = useCallback(() => {
    const result = validateBasics(resume.basics);
    setBasicsErrors(result.errors);
    setTouchedBasicsFields(new Set(BASICS_VALIDATED_FIELDS));
    return result;
  }, [resume.basics]);

  const persist = useCallback(
    async (opts?: { silent?: boolean }) => {
      setIsSaving(true);
      try {
        saveResume(resumeId, resume);
        setIsDirty(false);
        setLastSavedAt(Date.now());
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
    clearBasicsValidation();
  }, [resumeId, clearBasicsValidation]);

  const exportImage = useCallback(async () => {
    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      const name = resume.basics.name.trim() || 'resume';
      await exportResumeImage({
        fileName: `${name}-${resume.basics.title}.png`,
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
  }, [resume.basics.name, resume.basics.title]);

  const exportResumePdf = useCallback(async () => {
    const validation = validateAllBasics();
    if (!validation.isValid) {
      const firstMessage =
        BASICS_VALIDATED_FIELDS.map((field) => validation.errors[field]).find(
          Boolean,
        ) ?? '기본 정보를 확인해 주세요.';
      toast.error(firstMessage);
      return;
    }

    if (!previewRef.current) {
      toast.error('보낼 미리보기를 찾지 못했습니다.');
      return;
    }

    setIsExporting(true);
    try {
      const name = resume.basics.name.trim() || 'resume';
      await exportResumePdfFile({
        fileName: `${name}-${resume.basics.title}.pdf`,
        target: previewRef.current,
      });
      toast.success('PDF 저장 완료');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'PDF 저장에 실패했습니다.',
      );
    } finally {
      setIsExporting(false);
    }
  }, [resume.basics, validateAllBasics]);

  useEffect(() => {
    if (!isDirty || isSaving) return;

    const AUTO_SAVE_DELAY = 60_000;
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
      exportResumePdf,
      previewRef,
      basicsErrors,
      touchBasicsField,
      revalidateBasicsField,
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
      exportResumePdf,
      basicsErrors,
      touchBasicsField,
      revalidateBasicsField,
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
