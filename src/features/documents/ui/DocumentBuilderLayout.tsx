import type { ReactNode } from 'react';
import { DocumentPreviewPanel } from '@/features/documents/ui/DocumentPreviewPanel';

export type DocumentPreviewControls = {
  isPreviewOpen: boolean;
  isPreviewClosing: boolean;
  shouldAnimatePreviewOpen: boolean;
  onTogglePreview: () => void;
  onPreviewAnimationEnd: () => void;
};

type DocumentBuilderLayoutProps = {
  form: ReactNode;
  preview: ReactNode;
  previewControls: DocumentPreviewControls;
  validationSummary?: ReactNode;
};

export function DocumentBuilderLayout({
  form,
  preview,
  previewControls,
  validationSummary,
}: DocumentBuilderLayoutProps) {
  const { isPreviewOpen } = previewControls;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-5 pb-[calc(var(--editor-mobile-actions-height)+12px)] lg:p-0">
      {validationSummary}

      <div
        className={
          isPreviewOpen
            ? 'lg:relative lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]'
            : 'lg:relative lg:grid lg:grid-cols-[minmax(0,1fr)_auto]'
        }
      >
        <section className="documentEditorPane lg:px-10 lg:pt-9 lg:pb-15">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold md:text-2xl">문서작성</h2>
          </div>
          {form}
        </section>
        <DocumentPreviewPanel {...previewControls}>
          {preview}
        </DocumentPreviewPanel>
      </div>
    </main>
  );
}
