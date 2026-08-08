import type { ReactNode } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectReportBuilderPage } from './ProjectReportBuilderPage';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

vi.mock('@/components/layout/EditorHeader', () => ({
  EditorHeader: ({
    title,
    documentLabel,
    actions,
  }: {
    title: string;
    documentLabel: string;
    actions: {
      onSave?: () => void;
      onReset?: () => void;
      onLoadSample?: () => void;
      onExportPdf?: () => void;
    };
  }) => (
    <header>
      <span>{documentLabel}</span>
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
      <section aria-label="작성 폼">{form}</section>
      <section aria-label="문서 미리보기">{preview}</section>
    </main>
  ),
}));

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderProjectReportPage(documentId?: string) {
  const initialPath = documentId
    ? `/project-report/${documentId}`
    : '/project-report';

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LocationProbe />
      <Routes>
        <Route path="/project-report" element={<ProjectReportBuilderPage />} />
        <Route
          path="/project-report/:id"
          element={<ProjectReportBuilderPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProjectReportBuilderPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ID가 없는 경로를 새 프로젝트 보고서 경로로 교체한다', async () => {
    renderProjectReportPage();

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toMatch(
        /^\/project-report\/[a-z0-9]{8}$/,
      );
    });
  });

  it('예시 상태를 같은 Form과 Preview에 전달한다', () => {
    renderProjectReportPage('document-1');

    expect(screen.getAllByText('프로젝트 보고서')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: '예시' }));

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'DocKit 국문 제출 문서 작성 도구',
    );
    expect(
      screen.getByRole('heading', {
        name: 'DocKit 국문 제출 문서 작성 도구',
      }),
    ).toBeInTheDocument();
  });

  it('Header 저장 action을 프로젝트 보고서 저장소에 연결한다', async () => {
    renderProjectReportPage('document-1');
    fireEvent.click(screen.getByRole('button', { name: '예시' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(localStorage.getItem('project-report:document-1')).not.toBeNull();
    });
  });

  it('빈 문서의 저장과 PDF 출력을 차단하고 첫 오류로 포커스를 이동한다', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderProjectReportPage('document-1');

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(localStorage.getItem('project-report:document-1')).toBeNull();
    expect(screen.getByText(/검증 결과/)).toHaveTextContent(
      '검증 결과 6개의 오류가 있습니다.',
    );
    await waitFor(() => {
      expect(screen.getByLabelText('프로젝트명')).toHaveFocus();
    });

    fireEvent.click(screen.getByRole('button', { name: 'PDF' }));
    expect(printSpy).not.toHaveBeenCalled();
  });

  it('예시 불러오기와 초기화 시 기존 검증 오류를 제거한다', () => {
    renderProjectReportPage('document-1');

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(screen.getByText(/검증 결과/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '예시' }));
    expect(screen.queryByText(/검증 결과/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(screen.getByText(/검증 결과/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    expect(screen.queryByText(/검증 결과/)).not.toBeInTheDocument();
  });

  it('주요 기능은 쉼표를 유지하고 줄바꿈만 항목 구분자로 사용한다', () => {
    renderProjectReportPage('document-1');

    fireEvent.change(screen.getByLabelText('주요 기능', { selector: 'textarea' }), {
      target: {
        value: '로그인, 회원가입 화면 구현\n반응형 내비게이션 구현',
      },
    });

    const featureItems = screen.getAllByRole('listitem');

    expect(featureItems).toHaveLength(2);
    expect(featureItems[0]).toHaveTextContent('로그인, 회원가입 화면 구현');
    expect(featureItems[1]).toHaveTextContent('반응형 내비게이션 구현');
  });
});
