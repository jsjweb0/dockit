import { useOutletContext } from 'react-router-dom';
import {
  DocumentBuilderLayout,
  type DocumentPreviewControls,
} from '@/features/documents/ui/DocumentBuilderLayout';
import { CoverLetterForm } from '@/features/coverLetter/ui/CoverLetterForm';
import { CoverLetterPreview } from '@/features/coverLetter/ui/CoverLetterPreview';
import { useCoverLetterEditor } from '@/features/coverLetter/context/coverLetterEditor.context';

type CoverLetterBuilderOutletContext = {
  previewControls: DocumentPreviewControls;
};

export function CoverLetterBuilderPage() {
  const { previewControls } = useOutletContext<CoverLetterBuilderOutletContext>();
  const { coverLetter, setCoverLetter, previewRef } = useCoverLetterEditor();

  return (
    <DocumentBuilderLayout
      form={<CoverLetterForm value={coverLetter} onChange={setCoverLetter} />}
      preview={<CoverLetterPreview value={coverLetter} />}
      previewRef={previewRef}
      previewControls={previewControls}
    />
  );
}
