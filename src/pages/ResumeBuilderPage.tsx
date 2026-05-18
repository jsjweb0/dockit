import { ResumeForm } from '@/features/resume/ui/ResumeForm';
import { ResumePreview } from '@/features/resume/ui/ResumePreview';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { useResumeEditor } from '@/features/resume/context/resumeEditor.context.tsx';
import { Info, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const A4_PREVIEW_WIDTH = 794;
const A4_PREVIEW_HEIGHT = 1123;

export function ResumeBuilderPage() {
  const { resume, setResume, previewRef } = useResumeEditor();
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return;
    const mobileQuery = window.matchMedia('(max-width: 1024px)');

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <ResumeForm value={resume} onChange={setResume} />

      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild aria-label="미리보기 안내">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-18 absolute top-11 -right-12"
            >
              <ChevronRight className="size-7" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>미리보기 닫기</p>
          </TooltipContent>
        </Tooltip>

        <section
          className={cn(
            'rounded-xl bg-[#f7f8fa] p-3 md:p-8',
            'max-lg:overflow-hidden',
          )}
          aria-labelledby="resume-preview-title"
        >
          <div className="mb-4 flex items-center gap-1.5 border-b border-gray-200 pb-3 md:mb-6 md:pb-4">
            <h2
              id="resume-preview-title"
              className="text-xl font-semibold md:text-2xl"
            >
              미리보기
            </h2>
            <TooltipProvider delayDuration={0}>
              <Tooltip defaultOpen>
                <TooltipTrigger asChild aria-label="미리보기 안내">
                  <Info className="fill-black stroke-white" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>입력하면 자동 반영됩니다.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
    </div>
  );
}
