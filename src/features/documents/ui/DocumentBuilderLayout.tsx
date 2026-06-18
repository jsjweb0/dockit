import type { ReactNode, RefObject } from 'react';
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
  previewRef: RefObject<HTMLElement | null>;
  previewControls: DocumentPreviewControls;
};

export function DocumentBuilderLayout({
  form,
  preview,
  previewRef,
  previewControls,
}: DocumentBuilderLayoutProps) {
  return (
    <>
      <section className="documentEditorPane lg:px-10 lg:pt-9 lg:pb-15">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">문서작성</h2>
        </div>
        {form}
      </section>
      <DocumentPreviewPanel ref={previewRef} {...previewControls}>
        {preview}
      </DocumentPreviewPanel>
    </>
  );
}
