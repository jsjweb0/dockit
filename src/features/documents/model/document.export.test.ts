import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportDocumentPdf } from './document.export';

describe('exportDocumentPdf', () => {
  const originalTitle = '작성 중인 문서 | DocKit';

  beforeEach(() => {
    document.title = originalTitle;
    document.body.classList.remove('printing');
    vi.stubGlobal('print', vi.fn());
  });

  afterEach(() => {
    window.dispatchEvent(new Event('afterprint'));
    vi.unstubAllGlobals();
  });

  it('인쇄용 제목과 class를 적용한 뒤 브라우저 인쇄를 호출한다', () => {
    exportDocumentPdf({ fileName: '지원서.pdf' });

    expect(document.title).toBe('지원서');
    expect(document.body).toHaveClass('printing');
    expect(window.print).toHaveBeenCalledOnce();
  });

  it('인쇄가 끝나면 원래 제목과 body class를 복원한다', () => {
    exportDocumentPdf({ fileName: '지원서.pdf' });

    window.dispatchEvent(new Event('afterprint'));

    expect(document.title).toBe(originalTitle);
    expect(document.body).not.toHaveClass('printing');
  });
});
