import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { EditorHeader } from '@/components/layout/EditorHeader';
import {
  ResumeEditorProvider,
  useResumeEditor,
} from '@/features/resume/context/resumeEditor.context';
import { getInitialPreviewOpen } from '@/constants/editor';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

type PreviewControls = {
  isPreviewOpen: boolean;
  isPreviewClosing: boolean;
  shouldAnimatePreviewOpen: boolean;
  onTogglePreview: () => void;
  onPreviewAnimationEnd: () => void;
};

type EditorInnerProps = {
  previewControls: PreviewControls;
};

// Provider 안에서만 useResumeEditor 사용
function EditorInner({ previewControls }: EditorInnerProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    resume,
    save,
    reset,
    exportImage,
    exportResumePdf,
    isDirty,
    isSaving,
    isExporting,
    lastSavedAt,
  } = useResumeEditor();

  const handleExitHome = () => {
    navigate('/');
  };

  const actions = {
    onSave: () => save({ silent: false }),
    onReset: reset,
    onExportImage: exportImage,
    onExportPdf: exportResumePdf,
    onExitHome: handleExitHome,
  };

  const status = {
    isDirty,
    isSaving,
    isExporting,
    lastSavedAt,
  };

  const { isPreviewOpen, onTogglePreview } = previewControls;

  // /resume 로 들어오면 새 id 생성 후 /resume/:id 로 교체
  useEffect(() => {
    if (!id) navigate(`/resume/${uid()}`, { replace: true });
  }, [id, navigate]);

  // 저장 안 한 상태에서 탭닫기/새로고침/브라우저 뒤로가기에 confirm
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  return (
    <>
      <EditorHeader
        title={resume.basics?.name ?? '이력서'}
        actions={actions}
        status={status}
        isPreviewOpen={isPreviewOpen}
        onTogglePreview={onTogglePreview}
      />

      <main className="mx-auto max-w-7xl px-4 pt-5 pb-[calc(var(--editor-mobile-actions-height)+12px)] lg:p-0">
        <Outlet context={{ previewControls, onSave: actions.onSave }} />
      </main>

      <Toaster />
    </>
  );
}

export function EditorLayout() {
  const { id } = useParams();
  const resumeId = id ?? 'new';

  const [isPreviewOpen, setIsPreviewOpen] = useState(getInitialPreviewOpen);
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const [hasPreviewBeenClosed, setHasPreviewBeenClosed] = useState(false);

  const closePreview = () => {
    setIsPreviewClosing(true);
  };

  const handleTogglePreview = () => {
    if (isPreviewClosing) return;

    if (isPreviewOpen) {
      closePreview();
      return;
    }

    setIsPreviewOpen(true);
  };

  const handlePreviewAnimationEnd = () => {
    if (!isPreviewClosing) return;

    setIsPreviewOpen(false);
    setIsPreviewClosing(false);
    setHasPreviewBeenClosed(true);
  };

  const previewControls = {
    isPreviewOpen,
    isPreviewClosing,
    shouldAnimatePreviewOpen:
      isPreviewOpen && !isPreviewClosing && hasPreviewBeenClosed,
    onTogglePreview: handleTogglePreview,
    onPreviewAnimationEnd: handlePreviewAnimationEnd,
  };

  return (
    <div className="min-h-dvh ">
      <ResumeEditorProvider resumeId={resumeId}>
        <EditorInner previewControls={previewControls} />
      </ResumeEditorProvider>
    </div>
  );
}
