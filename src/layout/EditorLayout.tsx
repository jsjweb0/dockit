import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { EditorHeader } from '@/components/layout/EditorHeader';
import {
  ResumeEditorProvider,
  useResumeEditor,
} from '@/features/resume/context/resumeEditor.context';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { sampleResume } from '@/features/resume/model/resume.sample';
import { useDocumentPreviewControls } from '@/features/documents/hooks/useDocumentPreviewControls';
import { useUnsavedChangesWarning } from '@/features/documents/hooks/useUnsavedChangesWarning';
import type { DocumentPreviewControls } from '@/features/documents/ui/DocumentBuilderLayout';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

type EditorInnerProps = {
  previewControls: DocumentPreviewControls;
};

// Provider 안에서만 useResumeEditor 사용
function EditorInner({ previewControls }: EditorInnerProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    resume,
    setResume,
    save,
    reset,
    exportImage,
    printResume,
    isDirty,
    isSaving,
    isExporting,
    lastSavedAt,
    totalValidationErrorCount,
  } = useResumeEditor();

  const handleExitHome = () => {
    navigate('/');
  };

  const actions = {
    onSave: () => save({ silent: false }),
    onReset: reset,
    onLoadSample: () => setResume(sampleResume()),
    onExportImage: exportImage,
    onPrintResume: printResume,
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

  useUnsavedChangesWarning(isDirty);

  const name = resume.basics?.name?.trim();
  usePageTitle(name ? `${name} 이력서` : `새 이력서`);

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
        {totalValidationErrorCount > 0 && (
          <div
            className={cn(
              'flex items-start gap-2 mb-6 lg:mt-6 lg:ml-5 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700',
              !isPreviewOpen && 'lg:mr-5',
            )}
            role="status"
          >
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <p>
              검증 결과 <strong>{totalValidationErrorCount}</strong>개의 오류가
              있습니다. 각 탭을 확인해주세요.
            </p>
          </div>
        )}

        <div
          className={cn(
            'lg:grid lg:relative',
            isPreviewOpen
              ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]'
              : 'lg:grid-cols-[minmax(0,1fr)_auto]',
          )}
        >
          <Outlet context={{ previewControls, onSave: actions.onSave }} />
        </div>
      </main>

      <Toaster />
    </>
  );
}

export function EditorLayout() {
  const { id } = useParams();
  const resumeId = id ?? 'new';
  const previewControls = useDocumentPreviewControls();

  return (
    <div className="min-h-dvh ">
      <ResumeEditorProvider resumeId={resumeId}>
        <EditorInner previewControls={previewControls} />
      </ResumeEditorProvider>
    </div>
  );
}
