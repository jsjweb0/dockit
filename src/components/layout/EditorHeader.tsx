import { useEffect, useRef, useState } from 'react';
import { DesktopEditorActions } from '@/components/layout/DesktopEditorActions';
import { MobileEditorActions } from './MobileEditorActions';
import { ChevronLeft } from 'lucide-react';
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
};

export function EditorHeader({ title, actions, status }: Props) {
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
    <header className="sticky top-0 z-20 border-b bg-background/95 shadow-sm md:backdrop-blur px-2 py-2.5 md:px-6">
      <div className="mx-auto flex md:flex-wrap items-center justify-between md:gap-3">
        <div className="flex min-w-0 items-center gap-3 max-md:grow">
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
                  <img
                    src="/logo.svg"
                    className="h-4 w-auto max-md:hidden"
                    alt="DocKit"
                  />
                  <ChevronLeft
                    className="size-6 md:hidden"
                    aria-hidden="true"
                  />
                </button>
              }
            />
          ) : (
            <button
              type="button"
              onClick={onExitHome}
              className="flex min-h-10 items-center"
              aria-label="메인으로 나가기"
            >
              <img
                src="/logo.svg"
                className="h-4 w-auto max-md:hidden"
                alt="DocKit"
              />
              <ChevronLeft className="size-6 md:hidden" aria-hidden="true" />
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
              'flex flex-1 justify-end gap-1 md:translate-none',
              'max-md:z-50 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:w-full max-md:justify-center',
              'max-md:px-4 max-md:py-3 max-md:bg-background max-md:border-t max-md:shadow-[0_-4px_14px_rgba(0,0,0,0.08)]',
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
                    className="max-md:w-1/2"
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
                className="max-md:w-1/2"
              >
                나가기
              </Button>
            )}

            <Button
              onClick={onSave}
              disabled={!isDirty || isSaving}
              className="max-md:w-1/2"
            >
              문서저장
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
