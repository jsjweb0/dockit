import type { ReactNode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDocumentPreviewControls } from '../hooks/useDocumentPreviewControls';
import { MOBILE_PREVIEW_QUERY } from '@/constants/editor';
import { DocumentBuilderLayout } from './DocumentBuilderLayout';

vi.mock('./DocumentPreviewPanel', () => ({
  DocumentPreviewPanel: ({ children }: { children: ReactNode }) => (
    <section data-testid="preview-panel">{children}</section>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const mockViewport = (matches: boolean) => {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      media: MOBILE_PREVIEW_QUERY,
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
};

const renderLayout = (isPreviewOpen: boolean, isPreviewClosing = false) =>
  render(
    <DocumentBuilderLayout
      form={<input aria-label="문서 입력" />}
      preview={<div>미리보기 내용</div>}
      previewControls={{
        isPreviewOpen,
        isPreviewClosing,
        shouldAnimatePreviewOpen: false,
        onTogglePreview: vi.fn(),
        onPreviewAnimationEnd: vi.fn(),
      }}
    />,
  );

describe('DocumentBuilderLayout', () => {
  it('모바일 미리보기가 열리면 뒤 편집 영역을 비활성화한다', () => {
    mockViewport(true);

    const { container } = renderLayout(true);
    const editorPane = container.querySelector('.documentEditorPane');

    expect(editorPane).toHaveAttribute('inert');
    expect(editorPane).toHaveAttribute('aria-hidden', 'true');
  });

  it('닫힘 애니메이션 중에도 뒤 편집 영역을 비활성화한다', () => {
    mockViewport(true);

    const { container } = renderLayout(false, true);
    const editorPane = container.querySelector('.documentEditorPane');

    expect(editorPane).toHaveAttribute('inert');
    expect(editorPane).toHaveAttribute('aria-hidden', 'true');
  });

  it('데스크톱 미리보기에서는 편집 영역을 계속 사용할 수 있다', () => {
    mockViewport(false);

    const { container } = renderLayout(true);
    const editorPane = container.querySelector('.documentEditorPane');

    expect(editorPane).not.toHaveAttribute('inert');
    expect(editorPane).not.toHaveAttribute('aria-hidden');
  });
});

function PreviewHarness() {
  const controls = useDocumentPreviewControls();
  return (
    <>
      <button onClick={controls.onTogglePreview}>
        {controls.isPreviewOpen ? '닫기' : '열기'}
      </button>
      <DocumentBuilderLayout
        form={<input aria-label="문서 입력" />}
        preview={<div>미리보기 내용</div>}
        previewControls={controls}
      />
    </>
  );
}

describe('Preview 닫힘과 편집 영역 복구', () => {
  it.each([true, false])(
    'animationend 없이도 편집 영역을 복구한다 (reduced-motion=%s)',
    (reducedMotion) => {
      vi.useFakeTimers();
      vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
        matches: query === MOBILE_PREVIEW_QUERY || reducedMotion,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })));
      const { container } = render(<PreviewHarness />);
      const pane = container.querySelector('.documentEditorPane');

      fireEvent.click(screen.getByRole('button', { name: '열기' }));
      expect(pane).toHaveAttribute('inert');
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      if (!reducedMotion) {
        expect(pane).toHaveAttribute('inert');
        act(() => { vi.advanceTimersByTime(300); });
      }

      expect(pane).not.toHaveAttribute('inert');
      expect(pane).not.toHaveAttribute('aria-hidden');
      const input = screen.getByRole('textbox', { name: '문서 입력' });
      input.focus();
      expect(input).toHaveFocus();
      fireEvent.change(input, { target: { value: '계속 작성' } });
      expect(input).toHaveValue('계속 작성');

      // 이전 닫힘 타이머가 다시 연 패널을 닫지 않아야 합니다.
      fireEvent.click(screen.getByRole('button', { name: '열기' }));
      act(() => { vi.advanceTimersByTime(1_000); });
      expect(pane).toHaveAttribute('inert');
    },
  );
});
