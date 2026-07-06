import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { defaultResume } from '../model/resume.defaults';
import type { Resume } from '../model/resume.types';
import {
  ResumeEditorProvider,
  type ResumeValidationTab,
  useResumeEditor,
} from './resumeEditor.context';
import { useResumeValidation } from '../hooks/useResumeValidation';

const testResume: Resume = {
  ...defaultResume(),
  basics: {
    ...defaultResume().basics,
    name: '',
  },
  education: [
    {
      id: 'education-1',
      institution: '한국대학교',
      period: '',
      major: '',
    },
  ],
};

vi.mock('../model/resume.storage', () => ({
  loadResume: vi.fn(() => testResume),
  saveResume: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

function ValidationTargetConsumer({ tab }: { tab?: ResumeValidationTab }) {
  const { resume } = useResumeEditor();
  const {
    touchBasicsField,
    touchSectionField,
    getFirstValidationErrorTarget,
  } = useResumeValidation();
  const [targetText, setTargetText] = useState('');

  return (
    <>
      <button type="button" onClick={() => touchBasicsField('name')}>
        touch basics
      </button>
      <button
        type="button"
        onClick={() =>
          touchSectionField(
            'education',
            resume.education[0].id,
            'period',
            resume,
          )
        }
      >
        touch education
      </button>
      <button
        type="button"
        onClick={() =>
          setTargetText(JSON.stringify(getFirstValidationErrorTarget(tab)))
        }
      >
        check target
      </button>
      <output aria-label="validation target">{targetText}</output>
    </>
  );
}

function renderResumeEditorConsumer(tab?: ResumeValidationTab) {
  return render(
    <ResumeEditorProvider documentId="resume-test">
      <ValidationTargetConsumer tab={tab} />
    </ResumeEditorProvider>,
  );
}

describe('ResumeEditorProvider validation target', () => {
  it('선택한 탭의 첫 번째 섹션 검증 오류 target을 반환한다', async () => {
    const user = userEvent.setup();

    renderResumeEditorConsumer('edu');

    await user.click(screen.getByRole('button', { name: 'touch education' }));
    await user.click(screen.getByRole('button', { name: 'check target' }));

    await waitFor(() => {
      expect(screen.getByLabelText('validation target')).toHaveTextContent(
        JSON.stringify({
          tab: 'edu',
          fieldId: 'period-education-1',
        }),
      );
    });
  });

  it('탭을 지정하지 않으면 basics 검증 오류를 먼저 반환한다', async () => {
    const user = userEvent.setup();

    renderResumeEditorConsumer();

    await user.click(screen.getByRole('button', { name: 'touch basics' }));
    await user.click(screen.getByRole('button', { name: 'check target' }));

    await waitFor(() => {
      expect(screen.getByLabelText('validation target')).toHaveTextContent(
        JSON.stringify({
          tab: 'basics',
          fieldId: 'userName',
        }),
      );
    });
  });
});
