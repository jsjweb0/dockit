import type { ReactNode } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DocumentBuilderLayout } from './DocumentBuilderLayout';

vi.mock('./DocumentPreviewPanel', () => ({
  DocumentPreviewPanel: ({ children }: { children: ReactNode }) => (
    <section data-testid="preview-panel">{children}</section>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const mockViewport = (matches: boolean) => {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      media: '(max-width: 1024px)',
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
