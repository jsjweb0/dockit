import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorHeader } from '@/components/layout/EditorHeader';
import { useDocumentPreviewControls } from '@/features/documents/hooks/useDocumentPreviewControls';
import { useUnsavedChangesWarning } from '@/features/documents/hooks/useUnsavedChangesWarning';
import { DocumentBuilderLayout } from '@/features/documents/ui/DocumentBuilderLayout';
import { DocumentValidationSummary } from '@/features/documents/ui/DocumentValidationSummary';
import {
  ResumeEditorProvider,
  useResumeEditor,
} from '@/features/resume/context/resumeEditor.context';
import { useResumeValidation } from '@/features/resume/hooks/useResumeValidation';
import { sampleResume } from '@/features/resume/model/resume.sample';
import { ResumeForm } from '@/features/resume/ui/ResumeForm';
import { ResumePreview } from '@/features/resume/ui/ResumePreview';
import { usePageTitle } from '@/hooks/usePageTitle';
import { createId } from '@/lib/utils';
import { getDocumentTemplate } from '@/layout/documentTemplates';

const resumeTemplate = getDocumentTemplate('resume');

function ResumeEditorContent() {
  const navigate = useNavigate();
  const previewControls = useDocumentPreviewControls();
  const editor = useResumeEditor();
  const validation = useResumeValidation();
  const title = editor.resume.basics.name.trim();

  useUnsavedChangesWarning(editor.isDirty);
  usePageTitle(title ? `${title} 이력서` : `새 ${resumeTemplate.title}`);

  return (
    <>
      <EditorHeader
        title={title}
        documentLabel={resumeTemplate.title}
        fallbackTitle={`새 ${resumeTemplate.title}`}
        actions={{
          onSave: () => editor.save({ silent: false }),
          onReset: editor.reset,
          onLoadSample: () => {
            editor.reset();
            editor.setResume(sampleResume());
          },
          onExportPdf: editor.printResume,
          onExitHome: () => navigate('/'),
        }}
        status={{
          isDirty: editor.isDirty,
          isSaving: editor.isSaving,
          isExporting: editor.isExporting,
          lastSavedAt: editor.lastSavedAt,
        }}
        isPreviewOpen={previewControls.isPreviewOpen}
        onTogglePreview={previewControls.onTogglePreview}
      />

      <DocumentBuilderLayout
        form={<ResumeForm value={editor.resume} onChange={editor.setResume} />}
        preview={<ResumePreview value={editor.resume} />}
        previewControls={previewControls}
        validationSummary={
          <DocumentValidationSummary
            errorCount={validation.totalValidationErrorCount}
          />
        }
      />
    </>
  );
}

export function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const documentId = id ?? 'new';

  useEffect(() => {
    if (!id && resumeTemplate.href) {
      navigate(`${resumeTemplate.href}/${createId()}`, { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-dvh">
      <ResumeEditorProvider documentId={documentId}>
        <ResumeEditorContent />
      </ResumeEditorProvider>
    </div>
  );
}
