import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultCareerSummary } from '@/features/careerSummary/model/careerSummary.defaults';
import { saveCareerSummary } from '@/features/careerSummary/model/careerSummary.storage';
import { defaultCoverLetter } from '@/features/coverLetter/model/coverLetter.defaults';
import { saveCoverLetter } from '@/features/coverLetter/model/coverLetter.storage';
import { defaultResume } from '@/features/resume/model/resume.defaults';
import { saveResume } from '@/features/resume/model/resume.storage';
import { listRecentDocumentDrafts } from './document.recent';

describe('listRecentDocumentDrafts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('문서 종류를 합쳐 최신순 링크와 label을 만든다', () => {
    const resume = defaultResume();
    resume.basics.name = '김도킷';
    saveResume('resume-1', resume);

    vi.setSystemTime(2_000);
    const coverLetter = defaultCoverLetter();
    coverLetter.title = '지원 자기소개서';
    saveCoverLetter('cover-letter-1', coverLetter);

    vi.setSystemTime(3_000);
    const careerSummary = defaultCareerSummary();
    careerSummary.title = '경력 정리';
    saveCareerSummary('career-summary-1', careerSummary);

    const recentDrafts = listRecentDocumentDrafts(2);

    expect(recentDrafts.map(({ href, documentLabel }) => ({
      href,
      documentLabel,
    }))).toEqual([
      {
        href: '/career-summary/career-summary-1',
        documentLabel: '경력기술서',
      },
      {
        href: '/cover-letter/cover-letter-1',
        documentLabel: '자기소개서',
      },
    ]);
  });

  it('반환된 삭제 함수가 해당 문서와 최근 목록을 제거한다', () => {
    saveResume('resume-1', defaultResume());
    const [resumeDraft] = listRecentDocumentDrafts();

    resumeDraft.deleteDraft(resumeDraft.id);

    expect(localStorage.getItem('resume:resume-1')).toBeNull();
    expect(listRecentDocumentDrafts()).toEqual([]);
  });
});
