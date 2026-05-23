import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MoreVertical, FileText as FileTextIcon, ImageDownIcon, RefreshCcw  } from 'lucide-react';
import type {
  EditorActions,
  EditorStatus,
} from '@/components/layout/EditorHeader';

type Props = {
  actions: EditorActions;
  status: EditorStatus;
};

export function MobileEditorActions({ actions, status }: Props) {
  const { onReset, onExportImage, onExportPdf } = actions;
  const { isDirty, isSaving, isExporting } = status;

  return (
    <div className="flex items-center gap-2 lg:hidden">
      {/* <Button onClick={onSave} disabled={!isDirty || isSaving}>
        {isSaving ? '저장 중' : '문서저장'}
      </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
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
            <DropdownMenuItem onSelect={onExportPdf} disabled={isExporting}>
              <FileTextIcon className="size-4" />
              {isExporting ? 'PDF 저장 중' : 'PDF 저장'}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onExportImage} disabled={isExporting}>
              <ImageDownIcon className="size-4" />
              {isExporting ? '이미지 저장 중' : '이미지 저장'}
            </DropdownMenuItem>
            <ConfirmDialog
              title="전체 초기화할까요?"
              description="입력한 내용이 모두 초기화됩니다. 이 작업은 되돌릴 수 없어요."
              confirmText="초기화"
              onConfirm={onReset}
              trigger={
                <DropdownMenuItem
                  disabled={!isDirty || isSaving || isExporting}
                  onSelect={(event) => event.preventDefault()}
                >
                  <RefreshCcw className="size-4" />
                  전체 초기화
                </DropdownMenuItem>
              }
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
