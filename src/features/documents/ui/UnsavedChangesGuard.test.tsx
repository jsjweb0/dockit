import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMemoryRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { UnsavedChangesGuard } from './UnsavedChangesGuard';

afterEach(() => {
  cleanup();
});

function TestEditor() {
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <output aria-label="현재 경로">{location.pathname}</output>
      <button type="button" onClick={() => setIsDirty(true)}>
        문서 수정
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        뒤로가기
      </button>
      <UnsavedChangesGuard isDirty={isDirty} />
    </>
  );
}

const renderEditor = () => {
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>홈 화면</div> },
      { path: '/editor', element: <TestEditor /> },
    ],
    {
      initialEntries: ['/', '/editor'],
      initialIndex: 1,
    },
  );

  render(<RouterProvider router={router} />);
  return router;
};

describe('UnsavedChangesGuard', () => {
  it('미저장 상태의 뒤로가기를 차단하고 계속 편집할 수 있다', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole('button', { name: '문서 수정' }));
    await user.click(screen.getByRole('button', { name: '뒤로가기' }));

    expect(
      screen.getByRole('alertdialog', {
        name: '저장되지 않은 변경사항이 있어요',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('현재 경로')).toHaveTextContent('/editor');

    await user.click(screen.getByRole('button', { name: '계속 편집' }));

    expect(screen.getByLabelText('현재 경로')).toHaveTextContent('/editor');
  });

  it('경고에서 나가기를 선택하면 차단된 뒤로가기를 진행한다', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole('button', { name: '문서 수정' }));
    await user.click(screen.getByRole('button', { name: '뒤로가기' }));
    await user.click(screen.getByRole('button', { name: '나가기' }));

    await waitFor(() => {
      expect(screen.getByText('홈 화면')).toBeInTheDocument();
    });
  });

  it('미저장 상태에서는 beforeunload를 취소한다', async () => {
    const user = userEvent.setup();
    renderEditor();
    await user.click(screen.getByRole('button', { name: '문서 수정' }));

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
