import { useEffect, useRef } from 'react';

type UseValidationErrorFocusOptions = {
  focusRequestId: number;
  focusFirstError: () => void;
};

export function useValidationErrorFocus({
  focusRequestId,
  focusFirstError,
}: UseValidationErrorFocusOptions) {
  const handledFocusRequestId = useRef(0);

  useEffect(() => {
    if (
      focusRequestId === 0 ||
      handledFocusRequestId.current === focusRequestId
    ) {
      return;
    }

    handledFocusRequestId.current = focusRequestId;
    const focusTimer = window.setTimeout(focusFirstError, 0);

    return () => window.clearTimeout(focusTimer);
  }, [focusFirstError, focusRequestId]);
}
