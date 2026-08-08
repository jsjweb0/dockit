import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorHeader } from '@/components/layout/EditorHeader';
import { useDocumentPreviewControls } from '@/features/documents/hooks/useDocumentPreviewControls';
import { DocumentBuilderLayout } from '@/features/documents/ui/DocumentBuilderLayout';
import { ProjectReportForm } from '@/features/projectReport/ui/ProjectReportForm';
import { ProjectReportPreview } from '@/features/projectReport/ui/ProjectReportPreview';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getDocumentTemplate } from '@/layout/documentTemplates';
import { UnsavedChangesGuard } from '@/features/documents/ui/UnsavedChangesGuard';
import { ProjectReportEditorProvider, useProjectReportEditor } from '@/features/projectReport/context/projectReportEditor.context';
import { sampleProjectReport } from '@/features/projectReport/model/projectReport.sample';
import { useProjectReportValidation } from '@/features/projectReport/hook/useProjectReportValidation';
import { createId } from '@/lib/utils';
import { DocumentValidationSummary } from '@/features/documents/ui/DocumentValidationSummary';

const projectReportTemplate = getDocumentTemplate('project-report');

export function ProjectReportEditorContent() {
  const navigate = useNavigate();
  const previewControls = useDocumentPreviewControls();
  const editor = useProjectReportEditor();
  const projectReportValidation = useProjectReportValidation(
    editor.projectReport,
  );
  const title = editor.projectReport.title.trim();

  usePageTitle(title || `새 ${projectReportTemplate.title}`);

  return (
    <>
      <EditorHeader
        title={title}
        documentLabel={projectReportTemplate.title}
        fallbackTitle={`새 ${projectReportTemplate.title}`}
        actions={{
          onSave: async () => {
            const isValid = projectReportValidation.validateAll();

            if (!isValid) return;

            await editor.save({ silent: false });
          },

          onReset: () => {
            editor.reset();
            projectReportValidation.clearValidation();
          },

          onLoadSample: () => {
            editor.reset();
            editor.setProjectReport(sampleProjectReport());
            projectReportValidation.clearValidation();
          },

          onExportPdf: async () => {
            const isValid = projectReportValidation.validateAll();

            if (!isValid) return;

            await editor.printProjectReport();
          },

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

      <UnsavedChangesGuard isDirty={editor.isDirty} />

      <DocumentBuilderLayout
        form={
          <ProjectReportForm
            value={editor.projectReport}
            onChange={editor.setProjectReport}
            errors={projectReportValidation.errors}
            onFieldBlur={projectReportValidation.validateField}
            onFieldChange={projectReportValidation.revalidateField}
            focusRequestId={projectReportValidation.focusRequestId}
          />
        }
        preview={<ProjectReportPreview value={editor.projectReport} />}
        previewControls={previewControls}
        validationSummary={
          <DocumentValidationSummary
            errorCount={projectReportValidation.errorCount}
          />
        }
      />
    </>
  );
}

export function ProjectReportBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const documentId = id ?? 'new';

  useEffect(() => {
    if (!id && projectReportTemplate.href) {
      navigate(`${projectReportTemplate.href}/${createId()}`, { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-dvh">
      <ProjectReportEditorProvider documentId={documentId}>
        <ProjectReportEditorContent />
      </ProjectReportEditorProvider>
    </div>
  );
}
