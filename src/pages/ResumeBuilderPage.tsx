import { ResumeForm } from '@/features/resume/ui/ResumeForm';
import { useResumeEditor } from '@/features/resume/context/resumeEditor.context.tsx';
import { useOutletContext } from 'react-router-dom';
import { ResumePreview } from '@/features/resume/ui/ResumePreview';
import {
  DocumentBuilderLayout,
  type DocumentPreviewControls,
} from '@/features/documents/ui/DocumentBuilderLayout';

type ResumeBuilderOutletContext = {
  previewControls: DocumentPreviewControls;
};

export function ResumeBuilderPage() {
  const { previewControls } = useOutletContext<ResumeBuilderOutletContext>();
  const { resume, setResume } = useResumeEditor();

  return (
    <DocumentBuilderLayout
      form={<ResumeForm value={resume} onChange={setResume} />}
      preview={<ResumePreview value={resume} />}
      previewControls={previewControls}
    />
  );
}
