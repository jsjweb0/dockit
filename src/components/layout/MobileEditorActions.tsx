import { useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, RefreshCcw, FileInput, FilePenLine } from 'lucide-react';
import type {
  EditorActions,
  EditorStatus,
} from '@/components/layout/EditorHeader';

type Props = {
  actions: EditorActions;
  status: EditorStatus;
};

export function MobileEditorActions({ actions, status }: Props) {
  const { onReset, onLoadSample, onPrintResume } = actions;
  const { isDirty, isSaving, isExporting } = status;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isLoadSampleDialogOpen, setIsLoadSampleDialogOpen] = useState(false);

  const focusMenuButton = () => {
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  };

  const handleResetDialogOpenChange = (open: boolean) => {
    setIsResetDialogOpen(open);

    if (!open) {
      focusMenuButton();
    }
  };

  const handleLoadSampleDialogOpenChange = (open: boolean) => {
    setIsLoadSampleDialogOpen(open);

    if (!open) {
      focusMenuButton();
    }
  };

  return (
    <div className="flex items-center gap-2 lg:hidden">
      {/* <Button onClick={onSave} disabled={!isDirty || isSaving}>
        {isSaving ? '저장 중' : '문서저장'}
      </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={menuButtonRef}
            variant="outline"
            size="icon"
            aria-label="문서 작업 메뉴"
            className="border-0 shadow-none"
          >
            <MoreVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>작업</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setIsLoadSampleDialogOpen(true)}>
              <FilePenLine className="size-4" />
              예시 불러오기
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onPrintResume} disabled={isExporting}>
              <FileInput className="size-4" />
              {isExporting ? 'PDF 저장 중' : 'PDF로 저장'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={!isDirty || isSaving || isExporting}
              onSelect={() => setIsResetDialogOpen(true)}
            >
              <RefreshCcw className="size-4" />
              전체 초기화
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isLoadSampleDialogOpen}
        onOpenChange={handleLoadSampleDialogOpenChange}
      >
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

      <AlertDialog
        open={isResetDialogOpen}
        onOpenChange={handleResetDialogOpenChange}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>전체 초기화할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              입력한 내용이 모두 초기화됩니다. 이 작업은 되돌릴 수 없어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onReset}>초기화</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
