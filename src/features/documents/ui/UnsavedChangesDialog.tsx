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
import type { UnsavedChangesWarningControl } from '@/features/documents/hooks/useUnsavedChangesWarning';

export function UnsavedChangesDialog({
  isBlocked,
  stayOnPage,
  leavePage,
}: UnsavedChangesWarningControl) {
  return (
    <AlertDialog open={isBlocked}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>저장되지 않은 변경사항이 있어요</AlertDialogTitle>
          <AlertDialogDescription>
            페이지를 나가면 저장하지 않은 변경사항이 사라질 수 있어요. 그래도
            나갈까요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={stayOnPage}>계속 편집</AlertDialogCancel>
          <AlertDialogAction onClick={leavePage}>나가기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
