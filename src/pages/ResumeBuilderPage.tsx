import { ResumeForm } from '@/features/resume/ui/ResumeForm';
import { ResumePreview } from '@/features/resume/ui/ResumePreview';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { useResumeEditor } from '@/features/resume/context/resumeEditor.context.tsx';
import { Info, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useOutletContext } from 'react-router-dom';
import { MOBILE_PREVIEW_QUERY } from '@/constants/editor';

type ResumeBuilderOutletContext = {
  previewControls: {
    isPreviewOpen: boolean;
    isPreviewClosing: boolean;
    shouldAnimatePreviewOpen: boolean;
    onTogglePreview: () => void;
    onPreviewAnimationEnd: () => void;
  };
  onSave: () => void;
};

const A4_PREVIEW_WIDTH = 794;
const A4_PREVIEW_HEIGHT = 1123;

export function ResumeBuilderPage() {
  const { previewControls, onSave } =
    useOutletContext<ResumeBuilderOutletContext>();
  const {
    isPreviewOpen,
    isPreviewClosing,
    shouldAnimatePreviewOpen,
    onTogglePreview,
    onPreviewAnimationEnd,
  } = previewControls;

  const { resume, setResume, previewRef } = useResumeEditor();
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return;

    const mobileQuery = window.matchMedia(MOBILE_PREVIEW_QUERY);

    const updatePreviewScale = () => {
      const nextScale = mobileQuery.matches
        ? Math.min(1, viewport.clientWidth / A4_PREVIEW_WIDTH)
        : 1;
      setPreviewScale(Number(nextScale.toFixed(3)));
    };

    updatePreviewScale();

    const resizeObserver = new ResizeObserver(updatePreviewScale);
    resizeObserver.observe(viewport);
    mobileQuery.addEventListener('change', updatePreviewScale);

    return () => {
      resizeObserver.disconnect();
      mobileQuery.removeEventListener('change', updatePreviewScale);
    };
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_PREVIEW_QUERY);

    if ((isPreviewOpen || isPreviewClosing) && mobileQuery.matches) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreviewOpen, isPreviewClosing]);

  return (
    <div
      className={cn(
        'lg:grid',
        isPreviewOpen
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]'
          : 'lg:grid-cols-[minmax(0,1fr)_auto]',
      )}
    >
      <ResumeForm value={resume} onChange={setResume} onSubmit={onSave} />

      {!isPreviewOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="fixed right-6 top-[calc(var(--editor-header-height)+24px)] z-10 gap-2 bg-background shadow-sm max-lg:hidden"
              onClick={onTogglePreview}
              aria-expanded={isPreviewOpen}
              aria-controls="preview-panel"
              aria-label="미리보기 열기"
            >
              <PanelRightOpen className="size-4" aria-hidden="true" />
              미리보기 열기
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>작성 화면 옆에 미리보기를 다시 표시합니다.</p>
          </TooltipContent>
        </Tooltip>
      )}

      <section
        id="preview-panel"
        onAnimationEnd={onPreviewAnimationEnd}
        className={cn(
          'overflow-auto fixed inset-0 pt-[calc(var(--editor-header-height)+18px)] pb-[calc(var(--editor-mobile-actions-height)+24px)]',
          'lg:static bg-[#f7f8fa] px-4 lg:border-l lg:border-l-gray-100 md:px-8 lg:pt-8 lg:pb-8',
          isPreviewOpen || isPreviewClosing ? 'block' : 'hidden',
          shouldAnimatePreviewOpen && 'animate-preview-open',
          isPreviewClosing && 'animate-preview-close',
        )}
        aria-labelledby="resume-preview-title"
      >
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-200 pb-3 md:mb-5 md:pb-4">
          <div className="flex items-center gap-1.5">
            <h2
              id="resume-preview-title"
              className="text-xl font-semibold md:text-2xl"
            >
              미리보기
            </h2>
            <p className="flex gap-2 items-center">
              <Info className="fill-black stroke-white size-5 md:size-6" />
              <span className="text-xs md:text-sm text-primary/60">입력하면 자동 반영됩니다.</span>
            </p>
            {/* <TooltipProvider delayDuration={0}>
              <Tooltip defaultOpen>
                <TooltipTrigger asChild aria-label="미리보기 안내">
                  <Info className="fill-black stroke-white" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>입력하면 자동 반영됩니다.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-background max-lg:hidden"
                onClick={onTogglePreview}
                aria-expanded={isPreviewOpen}
                aria-controls="preview-panel"
                aria-label="미리보기 닫기"
              >
                <PanelRightClose className="size-4" aria-hidden="true" />
                닫기
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>미리보기 패널을 닫습니다.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Card className="border-0 py-0 shadow-none">
          <CardContent className="overflow-x-auto p-4 md:p-6">
            <div ref={previewViewportRef} className="resumePreviewViewport">
              <div
                className="resumePreviewScaler"
                style={{
                  height: A4_PREVIEW_HEIGHT * previewScale,
                  transform: `scale(${previewScale})`,
                }}
              >
                <ResumePreview ref={previewRef} value={resume} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
