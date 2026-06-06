import { ResumeForm } from '@/features/resume/ui/ResumeForm';
import { useResumeEditor } from '@/features/resume/context/resumeEditor.context.tsx';
import { cn } from '@/lib/utils';
import { useOutletContext } from 'react-router-dom';
import { ResumePreviewPanel } from '@/features/resume/ui/ResumePreviewPanel';

type ResumeBuilderOutletContext = {
  previewControls: {
    isPreviewOpen: boolean;
    isPreviewClosing: boolean;
    shouldAnimatePreviewOpen: boolean;
    onTogglePreview: () => void;
    onPreviewAnimationEnd: () => void;
  };
};

export function ResumeBuilderPage() {
  const { previewControls } = useOutletContext<ResumeBuilderOutletContext>();
  const {
    isPreviewOpen,
    isPreviewClosing,
    shouldAnimatePreviewOpen,
    onTogglePreview,
    onPreviewAnimationEnd,
  } = previewControls;

  const { resume, setResume, previewRef } = useResumeEditor();

  return (
    <div
      className={cn(
        'lg:grid lg:relative',
        isPreviewOpen
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]'
          : 'lg:grid-cols-[minmax(0,1fr)_auto]',
      )}
    >
      <ResumeForm value={resume} onChange={setResume} />

      <ResumePreviewPanel
        value={resume}
        previewRef={previewRef}
        isPreviewOpen={isPreviewOpen}
        isPreviewClosing={isPreviewClosing}
        shouldAnimatePreviewOpen={shouldAnimatePreviewOpen}
        onTogglePreview={onTogglePreview}
        onPreviewAnimationEnd={onPreviewAnimationEnd}
      />
    </div>
  );
}
