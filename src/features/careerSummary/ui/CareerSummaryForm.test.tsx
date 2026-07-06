import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CareerSummaryForm } from './CareerSummaryForm';
import { defaultCareerSummary } from '../model/careerSummary.defaults';
import type { CareerSummary } from '../model/careerSummary.types';

afterEach(() => {
  cleanup();
});

function TestCareerSummaryForm({
  initialValue = defaultCareerSummary(),
  onChange = vi.fn(),
}: {
  initialValue?: CareerSummary;
  onChange?: (next: CareerSummary) => void;
}) {
  const [careerSummary, setCareerSummary] = useState(initialValue);

  return (
    <CareerSummaryForm
      value={careerSummary}
      onChange={(next) => {
        setCareerSummary(next);
        onChange(next);
      }}
    />
  );
}

const createExperience = (
  id: string,
  company: string,
): CareerSummary['experiences'][number] => ({
  id,
  company,
  team: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  responsibilities: '',
  achievements: [{ title: '', description: '' }],
  techStack: [],
});

describe('CareerSummaryForm', () => {
  it('경력 추가 버튼을 누르면 새 경력 항목이 생긴다', async () => {
    const user = userEvent.setup();

    render(<TestCareerSummaryForm />);

    expect(screen.getByRole('button', { name: '경력 1 삭제' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /경력 추가/ }));

    expect(screen.getByRole('button', { name: '경력 2 삭제' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '경력 1 삭제' })).toBeEnabled();
  });

  it('삭제 버튼을 누르면 경력 항목이 제거된다', async () => {
    const user = userEvent.setup();
    const initialValue = {
      ...defaultCareerSummary(),
      experiences: [
        createExperience('experience-1', '첫 번째 회사'),
        createExperience('experience-2', '두 번째 회사'),
      ],
    };

    render(<TestCareerSummaryForm initialValue={initialValue} />);

    expect(screen.getByDisplayValue('첫 번째 회사')).toBeInTheDocument();
    expect(screen.getByDisplayValue('두 번째 회사')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '경력 2 삭제' }));

    expect(screen.queryByDisplayValue('첫 번째 회사')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('두 번째 회사')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '경력 1 삭제' })).toBeDisabled();
  });

  it('경력이 1개뿐이면 삭제 버튼이 비활성화된다', () => {
    render(<TestCareerSummaryForm />);

    expect(screen.getByRole('button', { name: '경력 1 삭제' })).toBeDisabled();
  });

  it('재직 중을 체크하면 종료일 입력이 비활성화된다', async () => {
    const user = userEvent.setup();

    render(<TestCareerSummaryForm />);

    const currentCheckbox = screen.getByLabelText(/재직\s*중/i, {
      selector: 'button',
    });
    const endDateInput = screen.getByLabelText('종료일');

    expect(endDateInput).toBeEnabled();

    await user.click(currentCheckbox);

    expect(currentCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(endDateInput).toBeDisabled();
  });

  it('보유 기술을 입력하고 추가 버튼을 누르면 기술이 표시된다', async () => {
    const user = userEvent.setup();

    render(<TestCareerSummaryForm />);

    const skillInput = screen.getByLabelText('보유 기술');
    const addButton = screen.getByRole('button', { name: '추가' });

    expect(addButton).toBeDisabled();

    await user.type(skillInput, 'React');
    await user.click(addButton);

    expect(skillInput).toHaveValue('');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'React 기술이 추가되었습니다.',
    );
  });
});
