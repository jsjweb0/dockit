import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorHeader } from '@/components/layout/EditorHeader';
import {
  CoverLetterEditorProvider,
  useCoverLetterEditor,
} from '@/features/coverLetter/context/coverLetterEditor.context';
import { useCoverLetterValidation } from '@/features/coverLetter/hooks/useCoverLetterValidation';
import { sampleCoverLetter } from '@/features/coverLetter/model/coverLetter.sample';
import { CoverLetterForm } from '@/features/coverLetter/ui/CoverLetterForm';
import { CoverLetterPreview } from '@/features/coverLetter/ui/CoverLetterPreview';
import { useDocumentPreviewControls } from '@/features/documents/hooks/useDocumentPreviewControls';
import { useUnsavedChangesWarning } from '@/features/documents/hooks/useUnsavedChangesWarning';
import { DocumentBuilderLayout } from '@/features/documents/ui/DocumentBuilderLayout';
import { DocumentValidationSummary } from '@/features/documents/ui/DocumentValidationSummary';
import { usePageTitle } from '@/hooks/usePageTitle';
import { createId } from '@/lib/utils';
import { getDocumentTemplate } from '@/layout/documentTemplates';

const coverLetterTemplate = getDocumentTemplate('cover-letter');

function CoverLetterEditorContent() {
  const navigate = useNavigate();
  const previewControls = useDocumentPreviewControls();
  const editor = useCoverLetterEditor();
  const validation = useCoverLetterValidation();
  const title = editor.coverLetter.title.trim();

  useUnsavedChangesWarning(editor.isDirty);
  usePageTitle(title || `새 ${coverLetterTemplate.title}`);

  return (
    <>
      <EditorHeader
        title={title}
        documentLabel={coverLetterTemplate.title}
        fallbackTitle={`새 ${coverLetterTemplate.title}`}
        actions={{
          onSave: () => editor.save({ silent: false }),
          onReset: editor.reset,
          onLoadSample: () => {
            editor.reset();
            editor.setCoverLetter(sampleCoverLetter());
          },
          onExportPdf: editor.printCoverLetter,
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
        form={
          <CoverLetterForm
            value={editor.coverLetter}
            onChange={editor.setCoverLetter}
            errors={validation.coverLetterErrors}
            onSectionBlur={validation.touchCoverLetterSection}
            onSectionChange={validation.revalidateCoverLetterSection}
          />
        }
        preview={<CoverLetterPreview value={editor.coverLetter} />}
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

export function CoverLetterBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const documentId = id ?? 'new';

  useEffect(() => {
    if (!id && coverLetterTemplate.href) {
      navigate(`${coverLetterTemplate.href}/${createId()}`, { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-dvh">
      <CoverLetterEditorProvider documentId={documentId}>
        <CoverLetterEditorContent />
      </CoverLetterEditorProvider>
    </div>
  );
}
