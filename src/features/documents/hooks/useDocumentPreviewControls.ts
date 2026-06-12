import { useState } from 'react';
import { getInitialPreviewOpen } from '@/constants/editor';

export function useDocumentPreviewControls() {
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

  return {
    isPreviewOpen,
    isPreviewClosing,
    shouldAnimatePreviewOpen:
      isPreviewOpen && !isPreviewClosing && hasPreviewBeenClosed,
    onTogglePreview: handleTogglePreview,
    onPreviewAnimationEnd: handlePreviewAnimationEnd,
  };
}
