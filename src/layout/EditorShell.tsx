import { Outlet } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import {
  EditorHeader,
  type EditorActions,
  type EditorStatus,
} from '@/components/layout/EditorHeader';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUnsavedChangesWarning } from '@/features/documents/hooks/useUnsavedChangesWarning';
import type { DocumentPreviewControls } from '@/features/documents/ui/DocumentBuilderLayout';

type EditorShellProps = {
  title: string;
  documentLabel?: string;
  fallbackTitle: string;
  pageTitle: string;
  actions: EditorActions;
  status: EditorStatus;
  previewControls: DocumentPreviewControls;
  totalValidationErrorCount?: number;
};

export function EditorShell({
  title,
  documentLabel,
  fallbackTitle,
  pageTitle,
  actions,
  status,
  previewControls,
  totalValidationErrorCount = 0,
}: EditorShellProps) {
  const { isPreviewOpen } = previewControls;

  useUnsavedChangesWarning(status.isDirty);
  usePageTitle(pageTitle);

  return (
    <>
      <EditorHeader
        title={title}
        documentLabel={documentLabel}
        fallbackTitle={fallbackTitle}
        actions={actions}
        status={status}
        isPreviewOpen={isPreviewOpen}
        onTogglePreview={previewControls.onTogglePreview}
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
