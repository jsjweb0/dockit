import { useCallback, useEffect, useState } from 'react';
import { getInitialPreviewOpen } from '@/constants/editor';

export function useDocumentPreviewControls() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(getInitialPreviewOpen);
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const [hasPreviewBeenClosed, setHasPreviewBeenClosed] = useState(false);

  const finishClosing = useCallback(() => {
    setIsPreviewOpen(false);
    setIsPreviewClosing(false);
    setHasPreviewBeenClosed(true);
  }, []);

  useEffect(() => {
    if (!isPreviewClosing) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      if (motionQuery.matches) finishClosing();
    };
    // CSS 닫힘 애니메이션(250ms)의 종료 이벤트가 누락되어도 복구합니다.
    const timer = window.setTimeout(finishClosing, 300);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.clearTimeout(timer);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [isPreviewClosing, finishClosing]);

  const closePreview = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClosing();
      return;
    }
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

    finishClosing();
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
