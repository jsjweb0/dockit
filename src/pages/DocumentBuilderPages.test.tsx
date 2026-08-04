import type { ComponentType, ReactNode } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CareerSummary } from '@/features/careerSummary/model/careerSummary.types';
import type { CoverLetter } from '@/features/coverLetter/model/coverLetter.types';
import type { Resume } from '@/features/resume/model/resume.types';
import { CareerSummaryBuilderPage } from './CareerSummaryBuilderPage';
import { CoverLetterBuilderPage } from './CoverLetterBuilderPage';
import { ResumeBuilderPage } from './ResumeBuilderPage';

afterEach(() => {
  cleanup();
});

type HeaderActions = {
  onSave?: () => void;
  onReset?: () => void;
  onLoadSample?: () => void;
  onExportPdf?: () => void;
  onExitHome: () => void;
};

vi.mock('@/components/layout/EditorHeader', () => ({
  EditorHeader: ({
    title,
    documentLabel,
    actions,
  }: {
    title: string;
    documentLabel: string;
    actions: HeaderActions;
  }) => (
    <header>
      <span data-testid="document-label">{documentLabel}</span>
      <span data-testid="header-title">{title}</span>
      {actions.onSave && <button onClick={actions.onSave}>저장</button>}
      {actions.onReset && <button onClick={actions.onReset}>초기화</button>}
      {actions.onLoadSample && (
        <button onClick={actions.onLoadSample}>예시</button>
      )}
      {actions.onExportPdf && (
        <button onClick={actions.onExportPdf}>PDF</button>
      )}
    </header>
  ),
}));

vi.mock('@/features/documents/hooks/useDocumentPreviewControls', () => ({
  useDocumentPreviewControls: () => ({
    isPreviewOpen: true,
    isPreviewClosing: false,
    shouldAnimatePreviewOpen: false,
    onTogglePreview: vi.fn(),
    onPreviewAnimationEnd: vi.fn(),
  }),
}));

vi.mock('@/features/documents/ui/UnsavedChangesGuard', () => ({
  UnsavedChangesGuard: () => null,
}));

vi.mock('@/features/documents/ui/DocumentBuilderLayout', () => ({
  DocumentBuilderLayout: ({
    form,
    preview,
    validationSummary,
  }: {
    form: ReactNode;
    preview: ReactNode;
    validationSummary?: ReactNode;
  }) => (
    <main>
      {validationSummary}
      {form}
      {preview}
    </main>
  ),
}));

vi.mock('@/features/documents/ui/DocumentValidationSummary', () => ({
  DocumentValidationSummary: ({ errorCount }: { errorCount: number }) => (
    <output data-testid="validation-count">{errorCount}</output>
  ),
}));

vi.mock('@/features/resume/ui/ResumeForm', () => ({
  ResumeForm: ({ value }: { value: Resume }) => (
    <span data-testid="form-value">{value.basics.name}</span>
  ),
}));

vi.mock('@/features/resume/ui/ResumePreview', () => ({
  ResumePreview: ({ value }: { value: Resume }) => (
    <span data-testid="preview-value">{value.basics.name}</span>
  ),
}));

vi.mock('@/features/coverLetter/ui/CoverLetterForm', () => ({
  CoverLetterForm: ({ value }: { value: CoverLetter }) => (
    <span data-testid="form-value">{value.title}</span>
  ),
}));

vi.mock('@/features/coverLetter/ui/CoverLetterPreview', () => ({
  CoverLetterPreview: ({ value }: { value: CoverLetter }) => (
    <span data-testid="preview-value">{value.title}</span>
  ),
}));

vi.mock('@/features/careerSummary/ui/CareerSummaryForm', () => ({
  CareerSummaryForm: ({ value }: { value: CareerSummary }) => (
    <span data-testid="form-value">{value.title}</span>
  ),
}));

vi.mock('@/features/careerSummary/ui/CareerSummaryPreview', () => ({
  CareerSummaryPreview: ({ value }: { value: CareerSummary }) => (
    <span data-testid="preview-value">{value.title}</span>
  ),
}));

type DocumentPageCase = {
  path: string;
  documentLabel: string;
  sampleTitle: string;
  storagePrefix: string;
  Page: ComponentType;
};

const documentPages: DocumentPageCase[] = [
  {
    path: '/resume',
    documentLabel: '국문 이력서',
    sampleTitle: '김도킷',
    storagePrefix: 'resume',
    Page: ResumeBuilderPage,
  },
  {
    path: '/cover-letter',
    documentLabel: '자기소개서',
    sampleTitle: '프론트엔드 개발자 자기소개서',
    storagePrefix: 'cover-letter',
    Page: CoverLetterBuilderPage,
  },
  {
    path: '/career-summary',
    documentLabel: '경력기술서',
    sampleTitle: '프론트엔드 개발자 경력기술서',
    storagePrefix: 'career-summary',
    Page: CareerSummaryBuilderPage,
  },
];

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderDocumentPage({
  path,
  Page,
  documentId,
}: Pick<DocumentPageCase, 'path' | 'Page'> & { documentId?: string }) {
  const initialPath = documentId ? `${path}/${documentId}` : path;

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LocationProbe />
      <Routes>
        <Route path={path} element={<Page />} />
        <Route path={`${path}/:id`} element={<Page />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe.each(documentPages)('$documentLabel BuilderPage', (documentPage) => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ID가 없는 경로를 새 문서 경로로 교체한다', async () => {
    renderDocumentPage(documentPage);

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toMatch(
        new RegExp(`^${documentPage.path}/[a-z0-9]{8}$`),
      );
    });
  });

  it('예시 상태를 같은 Form과 Preview에 전달한다', async () => {
    renderDocumentPage({ ...documentPage, documentId: 'document-1' });

    expect(screen.getByTestId('document-label')).toHaveTextContent(
      documentPage.documentLabel,
    );
    fireEvent.click(screen.getByRole('button', { name: '예시' }));

    expect(screen.getByTestId('form-value')).toHaveTextContent(
      documentPage.sampleTitle,
    );
    expect(screen.getByTestId('preview-value')).toHaveTextContent(
      documentPage.sampleTitle,
    );
  });

  it('Header 저장 action을 문서별 저장소에 연결한다', async () => {
    renderDocumentPage({ ...documentPage, documentId: 'document-1' });
    fireEvent.click(screen.getByRole('button', { name: '예시' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(
        localStorage.getItem(`${documentPage.storagePrefix}:document-1`),
      ).not.toBeNull();
    });
  });
});

describe('문서별 검증 연결', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it.each(documentPages.slice(1))(
    '$documentLabel는 유효하지 않은 기본 문서 저장 시 오류 요약을 갱신한다',
    async (documentPage) => {
      renderDocumentPage({ ...documentPage, documentId: 'document-1' });

      expect(screen.getByTestId('validation-count')).toHaveTextContent('0');
      fireEvent.click(screen.getByRole('button', { name: '저장' }));

      await waitFor(() => {
        expect(Number(screen.getByTestId('validation-count').textContent)).toBeGreaterThan(0);
      });
      expect(
        localStorage.getItem(`${documentPage.storagePrefix}:document-1`),
      ).toBeNull();
    },
  );

  it.each(documentPages)(
    '$documentLabel는 PDF 검증 오류 후 예시를 불러오면 오류 요약을 초기화한다',
    async (documentPage) => {
      renderDocumentPage({ ...documentPage, documentId: 'document-1' });

      fireEvent.click(screen.getByRole('button', { name: 'PDF' }));
      await waitFor(() => {
        expect(
          Number(screen.getByTestId('validation-count').textContent),
        ).toBeGreaterThan(0);
      });

      fireEvent.click(screen.getByRole('button', { name: '예시' }));

      await waitFor(() => {
        expect(screen.getByTestId('validation-count')).toHaveTextContent('0');
      });
      expect(screen.getByTestId('form-value')).toHaveTextContent(
        documentPage.sampleTitle,
      );
      expect(screen.getByTestId('preview-value')).toHaveTextContent(
        documentPage.sampleTitle,
      );
    },
  );
});
