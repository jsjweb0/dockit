import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatRelativeTime } from './time';

describe('formatRelativeTime', () => {
  const now = new Date('2026-06-11T12:00:00Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('10초 미만이면 방금 저장됨을 반환한다', () => {
    expect(formatRelativeTime(now - 9 * 1000)).toBe('방금 저장됨');
  });

  it('10초 이상 60초 미만이면 초 단위로 표시한다', () => {
    expect(formatRelativeTime(now - 30 * 1000)).toBe('30초 전 저장됨');
  });

  it('60초 이상 60분 미만이면 분 단위로 표시한다', () => {
    expect(formatRelativeTime(now - 12 * 60 * 1000)).toBe('12분 전 저장됨');
  });

  it('24시간 미만이면 시간 단위로 표시한다', () => {
    expect(formatRelativeTime(now - 23 * 60 * 60 * 1000)).toBe(
      '23시간 전 저장됨',
    );
  });

  it('24시간 이상이면 일 단위로 표시한다', () => {
    expect(formatRelativeTime(now - 24 * 60 * 60 * 1000)).toBe(
      '1일 전 저장됨',
    );
  });

  it('48시간 이상이면 지난 일 수를 표시한다', () => {
    expect(formatRelativeTime(now - 49 * 60 * 60 * 1000)).toBe(
      '2일 전 저장됨',
    );
  });
});
