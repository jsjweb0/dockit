import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MoreVertical, LogOut } from 'lucide-react';

type Props = {
  onSave: () => void;
  onReset: () => void;
  onExportImage: () => void;
  onExitHome: () => void;
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
};

export function MobileEditorActions({
  onSave,
  onReset,
  onExportImage,
  onExitHome,
  isDirty,
  isSaving,
  isExporting,
}: Props) {
  return (
    <div className="flex items-center gap-2 md:hidden">
      <Button onClick={onSave} disabled={!isDirty || isSaving}>
        {isSaving ? '저장 중' : '문서저장'}
      </Button>

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
            <DropdownMenuItem onSelect={onExportImage} disabled={isExporting}>
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
                  전체 초기화
                </DropdownMenuItem>
              }
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isDirty ? (
              <ConfirmDialog
                title="저장되지 않은 변경사항이 있어요"
                description="저장하지 않은 변경사항은 메인으로 나가면 사라질 수 있어요. 그래도 나갈까요?"
                confirmText="나가기"
                onConfirm={onExitHome}
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <LogOut className="size-4" /> 나가기
                  </DropdownMenuItem>
                }
              />
            ) : (
              <DropdownMenuItem
                onSelect={onExitHome}
                aria-label="메인으로 나가기"
              >
                <LogOut className="size-4" /> 나가기
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
