import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ImageDownIcon, RefreshCcw, FileInput, FilePenLine } from 'lucide-react';
import type {
  EditorActions,
  EditorStatus,
} from '@/components/layout/EditorHeader';

type Props = {
  actions: EditorActions;
  status: EditorStatus;
};

export function DesktopEditorActions({ actions, status }: Props) {
  const { onReset, onLoadSample, onExportImage, onPrintResume } = actions;
  const { isDirty, isExporting } = status;

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" aria-label="이력서 예시 내용 불러오기" className="gap-1 border-blue-100 shadow-none rounded-full bg-blue-50">
            <FilePenLine className="size-3.5 stroke-[1.5px] stroke-blue-700" aria-hidden="true" />
            <span className="text-blue-600 font-normal">예시 불러오기</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>예시 내용 불러오기</AlertDialogTitle>
            <AlertDialogDescription>
              현재 작성 중인 내용이 예시 데이터로 덮어써집니다.
              계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onLoadSample}>적용</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full" aria-label="PDF 다운로드"
            onClick={onPrintResume}
            disabled={isExporting}
          >
            <FileInput className="size-5" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {isExporting ? 'PDF 저장 중' : 'PDF로 저장'}
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
            <ImageDownIcon className="size-5" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {isExporting ? '이미지 저장 중' : '이미지 저장'}
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="전체 초기화"
                disabled={!isDirty}
              >
                <RefreshCcw aria-hidden="true" />
              </Button>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>전체 초기화할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                현재 작성 중인 내용이 모두 초기화됩니다. 저장하지 않은 변경 사항은 삭제되며, 기존 저장본은 유지됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>초기화</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TooltipContent>
          <p className="text-sm">전체 초기화</p>
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="mx-2 h-4! max-lg:hidden" />
    </div>
  );
}
