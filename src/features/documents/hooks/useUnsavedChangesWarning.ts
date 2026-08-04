import { useCallback } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

export type UnsavedChangesWarningControl = {
  isBlocked: boolean;
  stayOnPage: () => void;
  leavePage: () => void;
};

export function useUnsavedChangesWarning(
  isDirty: boolean,
): UnsavedChangesWarningControl {
  const blocker = useBlocker(isDirty);

  useBeforeUnload(
    useCallback((event: BeforeUnloadEvent) => {
      if (!isDirty) return;

      event.preventDefault();
      event.returnValue = '';
    }, [isDirty]),
  );

  return {
    isBlocked: blocker.state === 'blocked',
    stayOnPage: () => {
      if (blocker.state === 'blocked') blocker.reset();
    },
    leavePage: () => {
      if (blocker.state === 'blocked') blocker.proceed();
    },
  };
}
