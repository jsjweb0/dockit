import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type { Resume } from "../model/resume.types";
import { loadResume, resetResume, saveResume } from "../model/resume.storage";
import {toast} from "sonner";

type ResumeEditorState = {
    resumeId: string;
    resume: Resume;
    setResume: (next: Resume) => void;
    save: (opts?: { silent?: boolean }) => Promise<void>;
    reset: () => void;
    isDirty: boolean;
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
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

    useEffect(() => {
        setResume(loadResume(resumeId));
        setIsDirty(false);
    }, [resumeId]);

    const setResumeSafe = useCallback((next: Resume) => {
        setResume(next);
        setIsDirty(true);
    }, []);

    const persist = useCallback(async (opts?: { silent?: boolean }) => {
        setIsSaving(true);
        try {
            saveResume(resumeId, resume);
            setIsDirty(false);
            setLastSavedAt(Date.now());
            // 수동 저장일 때만 토스트 띄우고 싶으면 여기서
            if (!opts?.silent) toast.success("저장 완료");
        } finally {
            setIsSaving(false);
        }
    }, [resume, resumeId]);

    const reset = useCallback(() => {
        resetResume(resumeId);
        setResume(loadResume(resumeId));
        setIsDirty(false);
        setLastSavedAt(null);
    }, [resumeId]);

    // 자동 저장
    useEffect(() => {
        if (!isDirty || isSaving) return;

        const AUTO_SAVE_DELAY = 60_000; // 1분
        const timer = setTimeout(() => persist({ silent: true }), AUTO_SAVE_DELAY);
        return () => clearTimeout(timer);
    }, [persist, resume, isDirty, isSaving]);

    const value = useMemo(() => ({
        resumeId,
        resume,
        setResume: setResumeSafe,
        save: persist,
        reset,
        isDirty,
        isSaving,
        lastSavedAt,
    }), [resume, resumeId, setResumeSafe, persist, reset, isDirty, isSaving, lastSavedAt]);

    return (
        <ResumeEditorContext.Provider value={value}>
            {children}
        </ResumeEditorContext.Provider>
    );
}

export function useResumeEditor() {
    const ctx = useContext(ResumeEditorContext);
    if (!ctx) throw new Error("useResumeEditor must be used within ResumeEditorProvider");
    return ctx;
}
