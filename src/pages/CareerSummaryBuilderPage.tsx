import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorHeader } from '@/components/layout/EditorHeader';
import {
  CareerSummaryEditorProvider,
  useCareerSummaryEditor,
} from '@/features/careerSummary/context/careerSummaryEditor.context';
import { useCareerSummaryValidation } from '@/features/careerSummary/hooks/useCareerSummaryValidation';
import { sampleCareerSummary } from '@/features/careerSummary/model/careerSummary.sample';
import { CareerSummaryForm } from '@/features/careerSummary/ui/CareerSummaryForm';
import { CareerSummaryPreview } from '@/features/careerSummary/ui/CareerSummaryPreview';
import { useDocumentPreviewControls } from '@/features/documents/hooks/useDocumentPreviewControls';
import { useUnsavedChangesWarning } from '@/features/documents/hooks/useUnsavedChangesWarning';
import { DocumentBuilderLayout } from '@/features/documents/ui/DocumentBuilderLayout';
import { DocumentValidationSummary } from '@/features/documents/ui/DocumentValidationSummary';
import { usePageTitle } from '@/hooks/usePageTitle';
import { createId } from '@/lib/utils';
import { getDocumentTemplate } from '@/layout/documentTemplates';

const careerSummaryTemplate = getDocumentTemplate('career-summary');

function CareerSummaryEditorContent() {
  const navigate = useNavigate();
  const previewControls = useDocumentPreviewControls();
  const editor = useCareerSummaryEditor();
  const validation = useCareerSummaryValidation();
  const title = editor.careerSummary.title.trim();

  useUnsavedChangesWarning(editor.isDirty);
  usePageTitle(title || `새 ${careerSummaryTemplate.title}`);

  return (
    <>
      <EditorHeader
        title={title}
        documentLabel={careerSummaryTemplate.title}
        fallbackTitle={`새 ${careerSummaryTemplate.title}`}
        actions={{
          onSave: () => editor.save({ silent: false }),
          onReset: editor.reset,
          onLoadSample: () => {
            editor.reset();
            editor.setCareerSummary(sampleCareerSummary());
          },
          onExportPdf: editor.printCareerSummary,
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
          <CareerSummaryForm
            value={editor.careerSummary}
            onChange={editor.setCareerSummary}
            errors={validation.experienceErrors}
            onSectionBlur={validation.touchCareerSummary}
            onSectionChange={validation.revalidateExperience}
          />
        }
        preview={<CareerSummaryPreview value={editor.careerSummary} />}
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

export function CareerSummaryBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const documentId = id ?? 'new';

  useEffect(() => {
    if (!id && careerSummaryTemplate.href) {
      navigate(`${careerSummaryTemplate.href}/${createId()}`, { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-dvh">
      <CareerSummaryEditorProvider documentId={documentId}>
        <CareerSummaryEditorContent />
      </CareerSummaryEditorProvider>
    </div>
  );
}
