import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditorHeader, type EditorStatus } from './EditorHeader';

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

function renderHeader(status?: EditorStatus) {
  return render(
    <EditorHeader
      title=""
      documentLabel="회의록"
      fallbackTitle="새 회의록"
      actions={{ onExitHome: vi.fn() }}
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
});
