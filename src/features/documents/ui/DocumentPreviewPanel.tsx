import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, Info } from 'lucide-react';
import { MOBILE_PREVIEW_QUERY } from '@/constants/editor';

type DocumentPreviewPanelProps = {
  children: ReactNode;
  isPreviewOpen: boolean;
  isPreviewClosing: boolean;
  shouldAnimatePreviewOpen: boolean;
  onTogglePreview: () => void;
  onPreviewAnimationEnd: () => void;
};

const A4_PREVIEW_WIDTH = 794;
const A4_PREVIEW_HEIGHT = 1123;

export function DocumentPreviewPanel({
  children,
  isPreviewOpen,
  isPreviewClosing,
  shouldAnimatePreviewOpen,
  onTogglePreview,
  onPreviewAnimationEnd,
}: DocumentPreviewPanelProps) {
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const updatePreviewScale = useCallback(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return;

    const nextScale = Math.min(1, viewport.clientWidth / A4_PREVIEW_WIDTH);
    setPreviewScale(Number(nextScale.toFixed(3)));
  }, []);

  useEffect(() => {
    if (!isPreviewOpen && !isPreviewClosing) return;

    updatePreviewScale();

    const viewport = previewViewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver(updatePreviewScale);
    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isPreviewOpen, isPreviewClosing, updatePreviewScale]);

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
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="previewToggleButton absolute right-4.5 top-3 z-20 w-18 h-18 rounded-full bg-background shadow-sm max-lg:hidden"
            onClick={onTogglePreview}
            aria-expanded={isPreviewOpen}
            aria-controls="preview-panel"
            aria-label={isPreviewOpen ? '미리보기 닫기' : '미리보기 열기'}
          >
            <ChevronRight
              className={cn('size-8.5', !isPreviewOpen && 'rotate-180')}
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          {isPreviewOpen
            ? '미리보기 패널을 닫습니다.'
            : '작성 화면 옆에 미리보기를 다시 표시합니다.'}
        </TooltipContent>
      </Tooltip>

      <section
        id="preview-panel"
        onAnimationEnd={onPreviewAnimationEnd}
        className={cn(
          'overflow-auto fixed inset-0 z-10 pt-[calc(var(--editor-header-height)+20px)] pb-[calc(var(--editor-mobile-actions-height)+24px)]',
          'lg:static bg-[#f7f8fa] px-4 lg:border-l lg:border-l-gray-100 md:px-8 lg:pt-4 lg:pb-8',
          isPreviewOpen || isPreviewClosing ? 'block' : 'hidden',
          shouldAnimatePreviewOpen && 'animate-preview-open',
          isPreviewClosing && 'animate-preview-close',
        )}
        aria-labelledby="document-preview-panel-title"
        aria-describedby="document-preview-panel-description"
      >
        <div className="documentPreview__title mb-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 mb-4 lg:pt-4.5">
            <h2
              id="document-preview-panel-title"
              className="text-xl font-semibold md:text-2xl"
            >
              미리보기
            </h2>
            <p className="flex gap-2 items-center">
              <Info
                className="fill-black stroke-white size-5 md:size-6"
                aria-hidden="true"
              />
              <span className="text-xs md:text-sm text-primary/60">
                입력하면 자동 반영됩니다.
              </span>
            </p>
          </div>
        </div>

        <p id="document-preview-panel-description" className="sr-only">
          이 영역은 왼쪽 입력 내용을 시각적으로 확인하는 출력 미리보기입니다.
          내용 수정은 왼쪽 입력 폼에서 진행해 주세요.
        </p>

        <Card className="border-0 py-0 shadow-none">
          <CardContent className="overflow-y-auto p-4 md:p-6">
            <div ref={previewViewportRef} className="documentPreviewViewport">
              <div
                className="documentPreviewFrame"
                style={{
                  width: A4_PREVIEW_WIDTH * previewScale,
                  height: A4_PREVIEW_HEIGHT * previewScale,
                }}
              >
                <div
                  className="documentPreviewScaler"
                  style={{
                    transform: `scale(${previewScale})`,
                  }}
                >
                  <section className="documentPreview" aria-hidden="true">
                    {children}
                  </section>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
