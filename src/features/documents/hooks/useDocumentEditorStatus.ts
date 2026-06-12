import { useState } from 'react';

export function useDocumentEditorStatus() {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  return {
    isDirty,
    setIsDirty,
    isSaving,
    setIsSaving,
    isExporting,
    setIsExporting,
    lastSavedAt,
    setLastSavedAt,
  };
}
