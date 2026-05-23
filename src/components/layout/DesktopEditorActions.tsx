import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator.tsx';
import { ConfirmDialog } from '@/components/ui/confirm-dialog.tsx';
import { ImageDownIcon, RefreshCcw, FileText as FileTextIcon } from 'lucide-react';
import type {
  EditorActions,
  EditorStatus,
} from '@/components/layout/EditorHeader';

type Props = {
  actions: EditorActions;
  status: EditorStatus;
};

export function DesktopEditorActions({ actions, status }: Props) {
  const { onReset, onExportImage, onExportPdf } = actions;
  const { isDirty, isExporting } = status;

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full" aria-label="PDF 다운로드"
          onClick={onExportPdf}
          disabled={isExporting}
          >
            <FileTextIcon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {isExporting ? 'PDF 저장 중' : 'PDF 저장'}
          </p>
        </TooltipContent>
      </Tooltip>
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

      <Separator orientation="vertical" className="mx-2 h-4! max-lg:hidden" />
    </div>
  );
}
