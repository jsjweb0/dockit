import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator.tsx';
import { ConfirmDialog } from '@/components/ui/confirm-dialog.tsx';
import { ImageDownIcon, RefreshCcw } from 'lucide-react';

type Props = {
  onSave: () => void;
  onReset: () => void;
  onExportImage: () => void;
  onExitHome: () => void;
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
};

export function DesktopEditorActions({
  onSave,
  onReset,
  onExportImage,
  onExitHome,
  isDirty,
  isSaving,
  isExporting,
}: Props) {
  return (
    <div className="hidden items-center gap-3 md:flex">
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

      <Separator orientation="vertical" className="mx-2 h-4! max-md:hidden" />

      <div className="flex flex-1 justify-end gap-1">
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

        <Button onClick={onSave} disabled={!isDirty || isSaving}>
          문서저장
          </Button>
      </div>
    </div>
  );
}
