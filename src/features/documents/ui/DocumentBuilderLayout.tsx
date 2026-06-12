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
};

export function DocumentBuilderLayout({
  form,
  preview,
  previewControls,
}: DocumentBuilderLayoutProps) {
  return (
    <>
      {form}
      <DocumentPreviewPanel {...previewControls}>{preview}</DocumentPreviewPanel>
    </>
  );
}
