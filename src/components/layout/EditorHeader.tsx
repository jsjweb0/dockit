import { useEffect, useMemo, useState } from 'react';
import { DesktopEditorActions } from '@/components/layout/DesktopEditorActions';
import { MobileEditorActions } from './MobileEditorActions';
import { TriangleAlert, ChevronLeft } from 'lucide-react';
import { formatRelativeTime } from '@/utils/time.ts';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type Props = {
  title: string;
  onSave: () => void;
  onReset: () => void;
  onExportImage: () => void;
  onExitHome: () => void;
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
  lastSavedAt: number | null;
};

export function EditorHeader({
  title,
  onSave,
  onReset,
  onExportImage,
  onExitHome,
  isDirty,
  isSaving,
  isExporting,
  lastSavedAt,
}: Props) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => forceTick((v) => v + 1), 60_000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  const statusNode = useMemo(() => {
    if (isSaving) {
      return (
        <>
          <Spinner /> 자동 저장 중…
        </>
      );
    }
    if (lastSavedAt) return formatRelativeTime(lastSavedAt);
    if (isDirty) {
      return (
        <>
          <TriangleAlert className="size-4" /> 저장 필요
        </>
      );
    }
    return null;
  }, [isSaving, lastSavedAt, isDirty]);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 shadow-sm backdrop-blur px-2 py-2.5 md:px-6">
      <div className="mx-auto flex md:flex-wrap items-center justify-between md:gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
          <div className="flex items-center gap-2 min-w-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2 ">
            <p className="shrink-0 text-xs text-white bg-black rounded-full px-2 py-1">
              국문 이력서
            </p>
            <strong className="font-normal truncate">
              {title || '새 이력서'}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex min-h-9 items-center gap-1 text-sm text-muted-foreground max-md:absolute right-2 top-full">
            {statusNode}
          </span>

          <DesktopEditorActions
            onSave={onSave}
            onReset={onReset}
            onExportImage={onExportImage}
            onExitHome={onExitHome}
            isDirty={isDirty}
            isSaving={isSaving}
            isExporting={isExporting}
          />

          <MobileEditorActions
            onSave={onSave}
            onReset={onReset}
            onExportImage={onExportImage}
            onExitHome={onExitHome}
            isDirty={isDirty}
            isSaving={isSaving}
            isExporting={isExporting}
          />
        </div>
      </div>
    </header>
  );
}
