import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DesktopEditorActions } from './DesktopEditorActions';
import { MobileEditorActions } from './MobileEditorActions';
import type { EditorStatus } from './EditorHeader';

const savedStatus: EditorStatus = {
  isDirty: false,
  isSaving: false,
  isExporting: false,
  lastSavedAt: 1,
};

const resetMessage = '현재 문서의 입력 내용이 초기화됩니다. 초기화한 내용은 이후 자동 저장될 수 있으며, 기존 저장 내용을 대체합니다.';

afterEach(cleanup);

describe.each(['desktop', 'mobile'] as const)('%s 초기화', (viewport) => {
  function renderActions(status: EditorStatus) {
    const onReset = vi.fn();
    const Component = viewport === 'desktop' ? DesktopEditorActions : MobileEditorActions;
    render(<Component actions={{ onReset, onExitHome: vi.fn() }} status={status} />);
    if (viewport === 'mobile') {
      fireEvent.keyDown(screen.getByRole('button', { name: '문서 작업 메뉴' }), { key: 'ArrowDown' });
    }
    return {
      onReset,
      trigger: screen.getByRole(viewport === 'desktop' ? 'button' : 'menuitem', { name: '전체 초기화' }),
    };
  }

  it('저장 직후에도 초기화할 수 있고 저장본 대체 가능성을 안내한다', () => {
    const { trigger, onReset } = renderActions(savedStatus);
    expect(trigger).not.toHaveAttribute('disabled');
    expect(trigger).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(trigger);
    expect(screen.getByText(resetMessage)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it.each(['isSaving', 'isExporting'] as const)('%s 중에는 초기화를 막는다', (flag) => {
    const { trigger, onReset } = renderActions({ ...savedStatus, isDirty: true, [flag]: true });
    if (viewport === 'desktop') {
      expect(trigger).toBeDisabled();
    } else {
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    }
    fireEvent.click(trigger);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onReset).not.toHaveBeenCalled();
  });
});
