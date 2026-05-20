import { useEffect, useRef, useState } from 'react';
import { DesktopEditorActions } from '@/components/layout/DesktopEditorActions';
import { MobileEditorActions } from './MobileEditorActions';
import { ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '@/utils/time.ts';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type EditorActions = {
  onSave: () => void;
  onReset: () => void;
  onExportImage: () => void;
  onExitHome: () => void;
};

export type EditorStatus = {
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
  lastSavedAt: number | null;
};

type Props = {
  title: string;
  actions: EditorActions;
  status: EditorStatus;
  isPreviewOpen: boolean;
  onTogglePreview: () => void;
};

export function EditorHeader({
  title,
  actions,
  status,
  isPreviewOpen,
  onTogglePreview,
}: Props) {
  const { onSave, onExitHome } = actions;
  const { isDirty, isSaving, lastSavedAt } = status;
  const [, forceTick] = useState(0);
  const wasDirtyRef = useRef(isDirty);

  const [isMobileActionVisible, setIsMobileActionVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => forceTick((v) => v + 1), 60_000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  const statusText = lastSavedAt ? formatRelativeTime(lastSavedAt) : null;

  useEffect(() => {
    if (isSaving) {
      toast.loading('자동 저장중...', { id: 'save-status' });
      return;
    }

    toast.dismiss('save-status');
  }, [isSaving]);

  useEffect(() => {
    if (isDirty && !wasDirtyRef.current) {
      toast.warning('저장하지 않은 변경 사항이 있습니다.', {
        id: 'dirty-status',
      });
    }

    if (!isDirty) {
      toast.dismiss('dirty-status');
    }

    wasDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;

      if (currentScrollY < 24 || isScrollingUp) {
        setIsMobileActionVisible(true);
      } else {
        setIsMobileActionVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 lg:backdrop-blur px-2 py-2.5 lg:px-6">
      <div className="mx-auto flex lg:flex-wrap items-center justify-between md:gap-3">
        <div className="flex min-w-0 items-center gap-3 max-lg:grow max-lg:pl-2 max-lg:pr-6">
          {isDirty ? (
            <ConfirmDialog
              title="메인으로 나갈까요?"
              description="메인으로 나가면 편집 중인 내용이 모두 사라집니다. 그래도 나갈까요?"
              confirmText="나가기"
              onConfirm={onExitHome}
              trigger={
                <button
                  type="button"
                  className="shrink-0 flex min-h-10 items-center"
                >
                  <img src="/logo.svg" className="h-4 w-auto" alt="DocKit" />
                </button>
              }
            />
          ) : (
            <button
              type="button"
              onClick={onExitHome}
              className="shrink-0 flex min-h-10 items-center"
              aria-label="메인으로 나가기"
            >
              <img src="/logo.svg" className="h-4 w-auto" alt="DocKit" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0 md:absolute md:left-1/2 md:-translate-x-1/2 max-md:grow max-md:justify-center">
            <p className="shrink-0 text-xs text-white bg-black rounded-full px-2 py-1">
              국문 이력서
            </p>
            <strong className="font-normal truncate">
              {title || '새 이력서'}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {statusText && (
            <span className="inline-flex min-h-9 items-center gap-1 text-sm text-muted-foreground max-md:absolute right-2 top-full">
              {statusText}
            </span>
          )}

          <DesktopEditorActions actions={actions} status={status} />

          <MobileEditorActions actions={actions} status={status} />

          <div
            className={cn(
              'flex flex-1 gap-2 z-50 fixed left-0 bottom-0 w-full justify-center',
              'lg:gap-1 lg:justify-end lg:translate-none lg:static lg:p-0 lg:shadow-none lg:bg-transparent lg:border-t-0',
              'px-4 py-3 bg-background border-t shadow-[0_-4px_14px_rgba(0,0,0,0.08)]',
              'transition-transform duration-300',
              isMobileActionVisible ? 'translate-y-0' : 'translate-y-full',
            )}
          >
            {isDirty ? (
              <ConfirmDialog
                title="저장되지 않은 변경사항이 있어요"
                description="저장하지 않은 변경사항은 메인으로 나가면 사라질 수 있어요. 그래도 나갈까요?"
                confirmText="나가기"
                onConfirm={onExitHome}
                trigger={
                  <Button
                    variant="outline"
                    aria-label="메인으로 나가기"
                    className="max-lg:w-1/2"
                  >
                    나가기
                  </Button>
                }
              />
            ) : (
              <Button
                variant="outline"
                onClick={onExitHome}
                aria-label="메인으로 나가기"
                className="max-lg:grow"
              >
                나가기
              </Button>
            )}

            <Button
              onClick={onSave}
              disabled={!isDirty || isSaving}
              className="max-lg:grow"
            >
              문서저장
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={isPreviewOpen ? '미리보기 닫기' : '미리보기 열기'}
              className="shrink-0 w-10 lg:hidden"
              onClick={onTogglePreview}
              aria-expanded={isPreviewOpen}
              aria-controls="preview-panel"
            >
              <ChevronRight
                className={cn(
                  'size-5 transition-transform',
                  !isPreviewOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
