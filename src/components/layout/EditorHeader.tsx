import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ImageDownIcon, RefreshCcw, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatRelativeTime } from '@/utils/time.ts';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator.tsx';
import { ConfirmDialog } from '@/components/ui/confirm-dialog.tsx';
import { cn } from '@/lib/utils';

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
  const [isMobileActionBarFixed, setIsMobileActionBarFixed] = useState(false);

  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => forceTick((v) => v + 1), 60_000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    const updateActionBarPosition = () => {
      setIsMobileActionBarFixed(mobileQuery.matches && window.scrollY > 0);
    };

    updateActionBarPosition();
    window.addEventListener('scroll', updateActionBarPosition, {
      passive: true,
    });
    mobileQuery.addEventListener('change', updateActionBarPosition);

    return () => {
      window.removeEventListener('scroll', updateActionBarPosition);
      mobileQuery.removeEventListener('change', updateActionBarPosition);
    };
  }, []);

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
    <header className="relative border-b md:bg-background/95 md:shadow-sm md:sticky md:top-0 md:z-20 md:backdrop-blur">
      <div className="mx-auto flex flex-wrap flex-col md:flex-row md:items-center md:justify-between gmd:ap-3">
        <div className="flex min-w-0 items-center gap-3 px-4 py-3 ">
          <h1 className="shrink-0">
            <a href="/" className="flex min-h-10 items-center">
              <img src="/logo.svg" className="h-5 w-auto" alt="DocKit" />
            </a>
          </h1>
          <div className="flex items-center gap-2 min-w-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 ">
            <p className="text-xs text-white bg-black rounded-full px-2 py-1">
              국문 이력서
            </p>
            <strong className="font-normal truncate">
              {title || '새 이력서'}
            </strong>
          </div>
        </div>

        <div
          className={cn(
            'mobileActionBar flex w-full items-center gap-2 px-4 py-3 bg-background/95',
            'transition-[box-shadow,background-color,border-color] duration-200',
            'md:static md:z-auto md:w-auto md:overflow-visible md:border-b-0 md:bg-transparent md:shadow-none md:backdrop-blur-none md:gap-3',
            'max-md:shadow-sm',
            isMobileActionBarFixed
              ? 'fixed inset-x-0 top-0 z-50 border-b backdrop-blur'
              : 'relative border-transparent',
          )}
        >
          <span className="inline-flex min-h-9 items-center gap-1 text-sm text-muted-foreground max-md:absolute right-2 top-full mt-1">
            {statusNode}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="이미지 저장"
                onClick={onExportImage}
                disabled={isExporting}
              >
                <ImageDownIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {isExporting ? '이미지 저장 중' : '이미지 저장'}
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <ConfirmDialog
              title="전체 초기화할까요?"
              description="입력한 내용이 모두 초기화됩니다. 이 작업은 되돌릴 수 없어요."
              confirmText="초기화"
              onConfirm={onReset}
              trigger={
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label="전체 초기화"
                    disabled={!isDirty}
                  >
                    <RefreshCcw />
                  </Button>
                </TooltipTrigger>
              }
            />
            <TooltipContent>
              <p className="text-sm">전체 초기화</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-2 h-4!" />

          <div className="flex flex-1 justify-end gap-1">
            <Button onClick={onSave} disabled={!isDirty || isSaving}>
              문서저장
            </Button>

            {isDirty ? (
              <ConfirmDialog
                title="저장되지 않은 변경사항이 있어요"
                description="저장하지 않은 변경사항은 메인으로 나가면 사라질 수 있어요. 그래도 나갈까요?"
                confirmText="나가기"
                onConfirm={onExitHome}
                trigger={
                  <Button variant="outline" aria-label="메인으로 나가기">
                    나가기
                  </Button>
                }
              />
            ) : (
              <Button
                variant="outline"
                onClick={onExitHome}
                aria-label="메인으로 나가기"
              >
                나가기
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
