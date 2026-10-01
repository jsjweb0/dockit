import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentPreviewPanel } from './DocumentPreviewPanel';

const mediaQuery = {
  matches: true,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

beforeEach(() => {
  mediaQuery.matches = true;
  mediaQuery.addEventListener.mockClear();
  mediaQuery.removeEventListener.mockClear();
  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  vi.unstubAllGlobals();
});

describe('DocumentPreviewPanel body scroll lock', () => {
  it('열린 Preview에서 모바일을 벗어나면 body scroll lock을 해제한다', () => {
    render(
      <DocumentPreviewPanel
        isPreviewOpen
        isPreviewClosing={false}
        shouldAnimatePreviewOpen={false}
        onTogglePreview={vi.fn()}
        onPreviewAnimationEnd={vi.fn()}
      >
        <div>미리보기</div>
      </DocumentPreviewPanel>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    mediaQuery.matches = false;
    const handleViewportChange = mediaQuery.addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'change',
    )?.[1] as (() => void) | undefined;
    handleViewportChange?.();

    expect(document.body.style.overflow).toBe('');
  });
});
