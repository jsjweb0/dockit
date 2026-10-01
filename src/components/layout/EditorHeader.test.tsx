import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
  let mobileQuery: { matches: boolean; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mobileQuery = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    vi.stubGlobal('matchMedia', vi.fn(() => mobileQuery));
    vi.stubGlobal('scrollY', 0);
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
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
  it('데스크톱에서 아래로 스크롤해도 저장 버튼을 비활성화하지 않는다', () => {
    const onSave = vi.fn();
    renderHeader(dirtyStatus, { onSave, onExitHome: vi.fn() });
    vi.stubGlobal('scrollY', 200);
    fireEvent.scroll(window);
    const button = screen.getByRole('button', { name: '문서저장' });
    expect(button.closest('[inert]')).toBeNull();
    expect(button.closest('[aria-hidden="true"]')).toBeNull();
    fireEvent.click(button);
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('모바일에서 숨긴 도구 모음도 데스크톱으로 전환하면 다시 활성화한다', () => {
    mobileQuery.matches = true;
    renderHeader(dirtyStatus, { onSave: vi.fn(), onExitHome: vi.fn() });
    const button = screen.getByRole('button', { name: '문서저장' });
    vi.stubGlobal('scrollY', 200);
    fireEvent.scroll(window);
    expect(button.closest('[inert]')).not.toBeNull();

    act(() => {
      mobileQuery.matches = false;
      mobileQuery.addEventListener.mock.calls[0][1]();
    });
    expect(button.closest('[inert]')).toBeNull();
    expect(button.closest('[aria-hidden="true"]')).toBeNull();
    expect(screen.getByRole('button', { name: '문서저장' })).toBeEnabled();
  });

});
