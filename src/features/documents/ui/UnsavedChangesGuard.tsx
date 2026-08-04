import { useUnsavedChangesWarning } from '@/features/documents/hooks/useUnsavedChangesWarning';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

type UnsavedChangesGuardProps = {
  isDirty: boolean;
};

export function UnsavedChangesGuard({ isDirty }: UnsavedChangesGuardProps) {
  const warning = useUnsavedChangesWarning(isDirty);

  return <UnsavedChangesDialog {...warning} />;
}
