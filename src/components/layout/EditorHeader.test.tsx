import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  EditorHeader,
  type EditorActions,
  type EditorStatus,
} from './EditorHeader';

const toastMocks = vi.hoisted(() => ({
  dismiss: vi.fn(),
  loading: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: toastMocks,
}));

const savedStatus: EditorStatus = {
  isDirty: false,
  isSaving: false,
  isExporting: false,
  lastSavedAt: null,
};

const dirtyStatus: EditorStatus = {
  ...savedStatus,
  isDirty: true,
};

function renderHeader(
  status?: EditorStatus,
  actions: EditorActions = { onExitHome: vi.fn() },
) {
  return render(
    <EditorHeader
      title=""
      documentLabel="회의록"
      fallbackTitle="새 회의록"
      actions={actions}
      status={status}
      isPreviewOpen
      onTogglePreview={vi.fn()}
    />,
  );
}

describe('EditorHeader', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('저장 기능 없이 문서명과 미리보기 action만 렌더링할 수 있다', () => {
    renderHeader();

    expect(screen.getByText('회의록')).toBeInTheDocument();
    expect(screen.getByText('새 회의록')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '문서저장' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '미리보기 닫기' }),
    ).toBeInTheDocument();
  });

  it('편집기를 벗어날 때 dirty toast를 정리한다', () => {
    const { rerender, unmount } = renderHeader(savedStatus);

    rerender(
      <EditorHeader
        title=""
        documentLabel="회의록"
        fallbackTitle="새 회의록"
        actions={{ onExitHome: vi.fn() }}
        status={dirtyStatus}
        isPreviewOpen
        onTogglePreview={vi.fn()}
      />,
    );
    expect(toastMocks.warning).toHaveBeenCalled();

    unmount();

    expect(toastMocks.dismiss).toHaveBeenCalledWith('dirty-status');
  });

  it('편집기를 벗어날 때 saving toast를 정리한다', () => {
    const { unmount } = renderHeader({ ...savedStatus, isSaving: true });

    expect(toastMocks.loading).toHaveBeenCalledWith('자동 저장중...', {
      id: 'save-status',
    });
    unmount();

    expect(toastMocks.dismiss).toHaveBeenCalledWith('save-status');
  });

  it('저장 후 다시 수정하면 이전 저장 시각 대신 미저장 상태를 표시한다', () => {
    renderHeader({
      ...dirtyStatus,
      lastSavedAt: Date.now(),
    });

    expect(screen.getByRole('status')).toHaveTextContent(
      '저장되지 않은 변경사항',
    );
    expect(screen.queryByText('방금 저장됨')).not.toBeInTheDocument();
  });

  it('저장 중에는 저장 상태를 가장 먼저 표시한다', () => {
    renderHeader({
      ...dirtyStatus,
      isSaving: true,
      lastSavedAt: Date.now(),
    });

    expect(screen.getByRole('status')).toHaveTextContent('저장 중...');
  });

  it('PDF action의 이름을 실제 인쇄 저장 흐름과 일치시킨다', () => {
    renderHeader(savedStatus, {
      onExitHome: vi.fn(),
      onExportPdf: vi.fn(),
    });

    expect(
      screen.getAllByRole('button', { name: 'PDF로 저장' }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: 'PDF 다운로드' }),
    ).not.toBeInTheDocument();
  });
});
