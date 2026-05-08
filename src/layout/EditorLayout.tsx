import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import { Toaster } from "@/components/ui/sonner";
import {EditorHeader} from "@/components/layout/EditorHeader";
import {ResumeEditorProvider, useResumeEditor} from "@/features/resume/context/resumeEditor.context";

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

// Provider 안에서만 useResumeEditor 사용
function EditorInner() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { resume, save, reset, isDirty, isSaving, lastSavedAt } = useResumeEditor();

    const handleBack = () => {
        if (window.history.length <= 1) {
            navigate("/", { replace: true });
            return;
        }
        navigate(-1);
    };

    // /resume 로 들어오면 새 id 생성 후 /resume/:id 로 교체
    useEffect(() => {
        if (!id) navigate(`/resume/${uid()}`, { replace: true });
    }, [id, navigate]);

    // 저장 안 한 상태에서 탭닫기/새로고침/브라우저 뒤로가기에 confirm
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    return (
        <>
            <EditorHeader
                title={resume.basics?.name ?? "이력서"}
                onSave={() => save({ silent: false })}
                onReset={reset}
                onBack={handleBack}
                isDirty={isDirty}
                isSaving={isSaving}
                lastSavedAt={lastSavedAt}
            />

            <div className="mx-auto max-w-7xl px-4 py-6">
                <Outlet />
            </div>

            <Toaster />
        </>
    );
}

export function EditorLayout() {
    const { id } = useParams();
    const resumeId = id ?? "new";

    return (
        <div className="min-h-dvh text-foreground">
            <ResumeEditorProvider resumeId={resumeId}>
                <EditorInner />
            </ResumeEditorProvider>
        </div>
    );
}