import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ResumeEditorProvider, useResumeEditor } from '../context/resumeEditor.context';
import { useResumeValidation } from '../hooks/useResumeValidation';
import { defaultResume } from '../model/resume.defaults';
import type { Resume } from '../model/resume.types';
import type { ResumeListSection } from '../model/resume.optionalSections.validation';
import { saveResume } from '../model/resume.storage';
import { DocumentValidationSummary } from '@/features/documents/ui/DocumentValidationSummary';
import { ResumeForm } from './ResumeForm';

function Editor() {
  const editor = useResumeEditor();
  const validation = useResumeValidation();
  return <>
    <button onClick={validation.validateResumeBeforeExport}>전체 검증</button>
    <button onClick={editor.reset}>전체 초기화</button>
    <DocumentValidationSummary errorCount={validation.totalValidationErrorCount} />
    <ResumeForm value={editor.resume} onChange={editor.setResume} />
  </>;
}

function renderEditor(resume: Resume) {
  saveResume('editing-test', resume);
  return render(<ResumeEditorProvider documentId="editing-test"><Editor /></ResumeEditorProvider>);
}

function validBasicsResume() {
  const resume = defaultResume();
  resume.basics = { ...resume.basics, name: '김도킷', phone: '010-1234-5678', email: 'test@example.com' };
  return resume;
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const sections: { section: ResumeListSection; tab: string; field: string }[] = [
  { section: 'experience', tab: '경력', field: 'company' },
  { section: 'projects', tab: '프로젝트', field: 'name' },
  { section: 'education', tab: '학력', field: 'institution' },
  { section: 'certifications', tab: '자격증', field: 'name' },
  { section: 'links', tab: '링크', field: 'label' },
];

describe.each(sections)('$tab 검증 동기화', ({ section, tab, field }) => {
  function partialResume() {
    const resume = validBasicsResume();
    Object.assign(resume[section][0], { [field]: '작성 중' });
    return resume;
  }

  it('오류 항목 삭제 후 탭 배지와 검증 요약에서 오류를 제거한다', async () => {
    const user = userEvent.setup();
    renderEditor(partialResume());
    await user.click(screen.getByRole('button', { name: '전체 검증' }));
    expect(screen.getByRole('tab', { name: new RegExp(`${tab}.*오류`) })).toBeInTheDocument();
    expect(screen.getByText(/검증 결과/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `${tab} 추가` }));
    await user.click(screen.getByRole('button', { name: `${tab} 1 삭제` }));
    expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
    expect(screen.queryByText(/검증 결과/)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('작성 중')).not.toBeInTheDocument();
  });

  it('부분 작성 항목을 완전히 비우면 다른 필드의 오류도 제거한다', async () => {
    const user = userEvent.setup();
    renderEditor(partialResume());
    await user.click(screen.getByRole('button', { name: '전체 검증' }));
    expect(screen.getByText(/검증 결과/)).toBeInTheDocument();
    await user.clear(screen.getByDisplayValue('작성 중'));
    expect(screen.queryByText(/검증 결과/)).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
  });
});

describe('경력의 연관 필드', () => {
  it('시작일 변경과 재직 중 전환을 이전/현재 항목의 오류에 반영한다', async () => {
    const user = userEvent.setup();
    const resume = validBasicsResume();
    resume.experience = [
      { id: 'a', company: '회사 A', role: '개발', start: '2025-01', end: '2024-12', description: '개발 업무', isCurrent: false },
      { id: 'b', company: '회사 B', role: '개발', start: '2026-01', end: '', description: '개발 업무', isCurrent: true },
    ];
    renderEditor(resume);
    await user.click(screen.getByRole('button', { name: '전체 검증' }));
    const starts = screen.getAllByLabelText('시작');
    const ends = screen.getAllByLabelText('종료');
    expect(ends[0]).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(starts[0], { target: { value: '2024-01' } });
    expect(ends[0]).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText(/검증 결과/)).not.toBeInTheDocument();

    const current = screen.getAllByRole('checkbox');
    await user.click(current[0]);
    expect(ends[0]).toBeDisabled();
    expect(ends[0]).toHaveAttribute('aria-invalid', 'false');
    expect(ends[1]).toBeEnabled();
    expect(ends[1]).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('tab', { name: /경력.*오류 1개/ })).toBeInTheDocument();

    await user.click(current[1]);
    expect(ends[0]).toHaveAttribute('aria-invalid', 'true');
    expect(ends[1]).toHaveAttribute('aria-invalid', 'false');
  });

  it('아직 확인하지 않은 필드는 변경만으로 오류를 표시하지 않는다', async () => {
    const user = userEvent.setup();
    renderEditor(validBasicsResume());
    await user.click(screen.getByRole('tab', { name: '경력' }));
    await user.type(screen.getByLabelText('회사명'), '회사');
    expect(screen.getByLabelText('종료')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText(/검증 결과/)).not.toBeInTheDocument();
  });
});

describe('스킬 입력 수명', () => {
  it('연속 입력과 삭제에서는 DOM과 입력 상태를 유지하고 전체 초기화에서는 비운다', async () => {
    const user = userEvent.setup();
    renderEditor(validBasicsResume());
    await user.click(screen.getByRole('tab', { name: '스킬' }));
    const input = screen.getByLabelText('핵심 스킬');
    await user.type(input, 'React{Enter}');
    expect(screen.getByLabelText('핵심 스킬')).toBe(input);
    expect(input).toHaveFocus();
    expect(screen.getByText('React 기술이 추가되었습니다.')).toBeInTheDocument();
    await user.type(input, 'TypeScript{Enter}');
    expect(input).toHaveFocus();
    expect(screen.getByLabelText('핵심 스킬')).toBe(input);
    await user.type(input, '작성 중');
    await user.click(screen.getByRole('button', { name: 'React 삭제' }));
    expect(screen.getByLabelText('핵심 스킬')).toBe(input);
    expect(input).toHaveValue('작성 중');
    expect(screen.getByRole('button', { name: 'TypeScript 삭제' })).toBeInTheDocument();
    expect(screen.getByText('React 기술이 삭제되었습니다.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '전체 초기화' }));
    expect(screen.getByLabelText('핵심 스킬')).not.toBe(input);
    expect(screen.getByLabelText('핵심 스킬')).toHaveValue('');
    expect(screen.queryByText('React 기술이 삭제되었습니다.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'TypeScript 삭제' })).not.toBeInTheDocument();
  });

  it('다른 문서를 로드하면 미등록 입력과 안내를 비우고 새 문서 스킬을 표시한다', async () => {
    const user = userEvent.setup();
    const { rerender } = renderEditor(validBasicsResume());
    await user.click(screen.getByRole('tab', { name: '스킬' }));
    await user.type(screen.getByLabelText('핵심 스킬'), 'React{Enter}작성 중');
    const nextResume = validBasicsResume();
    nextResume.skills.primary = ['Vue'];
    saveResume('other-document', nextResume);
    rerender(<ResumeEditorProvider documentId="other-document"><Editor /></ResumeEditorProvider>);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Vue 삭제' })).toBeInTheDocument());
    expect(screen.getByLabelText('핵심 스킬')).toHaveValue('');
    expect(screen.queryByText('React 기술이 추가되었습니다.')).not.toBeInTheDocument();
  });
});
