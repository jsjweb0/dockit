import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { createId } from '@/lib/utils';
import { useDocumentPreviewControls } from '@/features/documents/hooks/useDocumentPreviewControls';
import type { DocumentPreviewControls } from '@/features/documents/ui/DocumentBuilderLayout';
import { EditorShell } from '@/layout/EditorShell';
import {
  getEditorConfigByPathname,
  type AnyDocumentEditorConfig,
  type DocumentEditorConfig,
} from '@/layout/editor.config';

type DocumentEditorViewState = {
  title: string;
  pageTitle: string;
  actions: {
    onSave: () => void;
    onReset: () => void;
    onLoadSample: () => void;
    onPrintResume: () => void;
    onExitHome: () => void;
  };
  status: {
    isDirty: boolean;
    isSaving: boolean;
    isExporting: boolean;
    lastSavedAt: number | null;
  };
  totalValidationErrorCount: number;
};

type DocumentEditorInnerProps = {
  previewControls: DocumentPreviewControls;
  config: AnyDocumentEditorConfig;
};

function useDocumentEditorViewState<TDocument>(
  config: DocumentEditorConfig<TDocument>,
  onExitHome: () => void,
): DocumentEditorViewState {
  const editor = config.useEditor();
  const title = config.getTitle(editor.document);

  const actions = {
    onSave: () => editor.save({ silent: false }),
    onReset: editor.reset,
    onLoadSample: () => editor.setDocument(config.createSample()),
    onPrintResume: () => editor.printDocument(),
    onExitHome,
  };

  const status = {
    isDirty: editor.isDirty,
    isSaving: editor.isSaving,
    isExporting: editor.isExporting,
    lastSavedAt: editor.lastSavedAt,
  };

  return {
    title,
    pageTitle: config.getPageTitle(editor.document, config.template),
    actions,
    status,
    totalValidationErrorCount: editor.totalValidationErrorCount,
  };
}

// Provider 안에서만 문서별 editor hook을 사용합니다.
function DocumentEditorInner({
  previewControls,
  config,
}: DocumentEditorInnerProps) {
  const navigate = useNavigate();

  const handleExitHome = () => {
    navigate('/');
  };

  const { title, pageTitle, actions, status, totalValidationErrorCount } =
    useDocumentEditorViewState(config, handleExitHome);

  return (
    <EditorShell
      title={title}
      documentLabel={config.template.title}
      fallbackTitle={`새 ${config.template.title}`}
      pageTitle={pageTitle}
      actions={actions}
      status={status}
      previewControls={previewControls}
      totalValidationErrorCount={totalValidationErrorCount}
    />
  );
}

function ConfiguredDocumentEditorLayout({ config }: { config: AnyDocumentEditorConfig }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewControls = useDocumentPreviewControls();
  const documentId = id ?? 'new';

  useEffect(() => {
    if (!id && config.template.href) {
      navigate(`${config.template.href}/${createId()}`, { replace: true });
    }
  }, [config.template.href, id, navigate]);

  return (
    <div className="min-h-dvh ">
      <config.Provider documentId={documentId}>
        <DocumentEditorInner previewControls={previewControls} config={config} />
      </config.Provider>
    </div>
  );
}

export function EditorLayout() {
  const { pathname } = useLocation();
  const config = getEditorConfigByPathname(pathname);

  return <ConfiguredDocumentEditorLayout config={config} />;
}
