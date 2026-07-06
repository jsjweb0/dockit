import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CoverLetterForm } from './CoverLetterForm';
import { defaultCoverLetter } from '../model/coverLetter.defaults';
import type { CoverLetter } from '../model/coverLetter.types';

afterEach(() => {
  cleanup();
});

function TestCoverLetterForm({
  initialValue = defaultCoverLetter(),
  onChange = vi.fn(),
}: {
  initialValue?: CoverLetter;
  onChange?: (next: CoverLetter) => void;
}) {
  const [coverLetter, setCoverLetter] = useState(initialValue);

  return (
    <CoverLetterForm
      value={coverLetter}
      onChange={(next) => {
        setCoverLetter(next);
        onChange(next);
      }}
    />
  );
}

describe('CoverLetterForm', () => {
  it('문항 내용을 입력하면 글자 수를 표시한다', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const initialValue = {
      ...defaultCoverLetter(),
      sections: [
        {
          id: 'growth',
          title: '성장 과정',
          prompt: '지원 직무와 연결되는 경험이나 가치관을 작성해 주세요.',
          content: '',
        },
      ],
    };

    render(
      <TestCoverLetterForm
        initialValue={initialValue}
        onChange={handleChange}
      />,
    );

    const contentInput = screen.getByLabelText('성장 과정');

    await user.type(contentInput, '테스트입력');

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('/ 700')).toBeInTheDocument();
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sections: [
          expect.objectContaining({
            id: 'growth',
            content: '테스트입력',
          }),
        ],
      }),
    );
  });
});
