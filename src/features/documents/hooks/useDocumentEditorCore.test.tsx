import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDocumentEditorCore } from './useDocumentEditorCore';

type TestDocument = {
  title: string;
};

const initialDocument: TestDocument = { title: '초기 문서' };
const defaultDocument: TestDocument = { title: '' };

function createEditorOptions(saveDocument = vi.fn()) {
  return {
    documentId: 'document-1',
    loadDocument: vi.fn(() => initialDocument),
    saveDocument,
    createDefaultDocument: vi.fn(() => defaultDocument),
    getPrintFileName: vi.fn(() => 'document.pdf'),
  };
}

describe('useDocumentEditorCore', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('수동 저장 후 dirty 상태와 마지막 저장 시각을 갱신한다', async () => {
    const saveDocument = vi.fn();
    const options = createEditorOptions(saveDocument);
    const { result } = renderHook(() => useDocumentEditorCore(options));
    const editedDocument = { title: '수정한 문서' };

    act(() => {
      result.current.setDocument(editedDocument);
    });

    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      await result.current.save({ silent: true });
    });

    expect(saveDocument).toHaveBeenCalledWith('document-1', editedDocument);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSavedAt).not.toBeNull();
  });

  it('마지막 변경 60초 후 현재 문서를 자동 저장한다', async () => {
    vi.useFakeTimers();
    const saveDocument = vi.fn();
    const options = createEditorOptions(saveDocument);
    const { result } = renderHook(() => useDocumentEditorCore(options));
    const editedDocument = { title: '자동 저장할 문서' };

    act(() => {
      result.current.setDocument(editedDocument);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(59_999);
    });
    expect(saveDocument).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(saveDocument).toHaveBeenCalledOnce();
    expect(saveDocument).toHaveBeenCalledWith('document-1', editedDocument);
    expect(result.current.isDirty).toBe(false);
  });

  it('추가 변경이 생기면 자동 저장 대기 시간을 다시 계산한다', async () => {
    vi.useFakeTimers();
    const saveDocument = vi.fn();
    const options = createEditorOptions(saveDocument);
    const { result } = renderHook(() => useDocumentEditorCore(options));

    act(() => {
      result.current.setDocument({ title: '첫 번째 수정' });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });

    act(() => {
      result.current.setDocument({ title: '두 번째 수정' });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(saveDocument).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(saveDocument).toHaveBeenCalledOnce();
    expect(saveDocument).toHaveBeenCalledWith('document-1', {
      title: '두 번째 수정',
    });
  });

  it('수동 저장이 완료되면 예약된 자동 저장을 취소한다', async () => {
    vi.useFakeTimers();
    const saveDocument = vi.fn();
    const options = createEditorOptions(saveDocument);
    const { result } = renderHook(() => useDocumentEditorCore(options));

    act(() => {
      result.current.setDocument({ title: '수동 저장할 문서' });
    });

    await act(async () => {
      await result.current.save({ silent: true });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });

    expect(saveDocument).toHaveBeenCalledOnce();
  });

  it('저장에 실패하면 dirty 상태를 유지한다', async () => {
    const saveDocument = vi.fn(() => {
      throw new Error('save failed');
    });
    const options = createEditorOptions(saveDocument);
    const { result } = renderHook(() => useDocumentEditorCore(options));

    act(() => {
      result.current.setDocument({ title: '저장 실패 문서' });
    });
    await act(async () => {
      await result.current.save({ silent: true });
    });

    expect(result.current.isDirty).toBe(true);
    expect(result.current.lastSavedAt).toBeNull();
  });
});
