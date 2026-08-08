import { useState } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useProjectReportValidation } from '../hook/useProjectReportValidation';
import { defaultProjectReport } from '../model/projectReport.defaults';
import { ProjectReportForm } from './ProjectReportForm';

afterEach(() => {
  cleanup();
});

function ProjectReportFormHarness() {
  const [projectReport, setProjectReport] = useState(defaultProjectReport);
  const validation = useProjectReportValidation(projectReport);

  return (
    <>
      <button type="button" onClick={validation.validateAll}>
        전체 검증
      </button>
      <ProjectReportForm
        value={projectReport}
        onChange={setProjectReport}
        errors={validation.errors}
        onFieldBlur={validation.validateField}
        onFieldChange={validation.revalidateField}
        focusRequestId={validation.focusRequestId}
      />
    </>
  );
}

describe('ProjectReportForm', () => {
  it('필수 필드를 빈 상태로 blur하면 오류를 표시한다', () => {
    render(<ProjectReportFormHarness />);

    const titleInput = screen.getByLabelText('프로젝트명');
    fireEvent.blur(titleInput);

    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    expect(titleInput).toHaveAttribute(
      'aria-describedby',
      'project-report-title-error',
    );
    expect(screen.getByText('필수 항목을 입력해 주세요.')).toBeInTheDocument();
  });

  it('오류가 표시된 필드는 입력하는 동안 다시 검증한다', () => {
    render(<ProjectReportFormHarness />);

    const titleInput = screen.getByLabelText('프로젝트명');
    fireEvent.blur(titleInput);
    fireEvent.change(titleInput, { target: { value: 'DocKit' } });

    expect(titleInput).toHaveAttribute('aria-invalid', 'false');
    expect(titleInput).not.toHaveAttribute('aria-describedby');
    expect(
      screen.queryByText('필수 항목을 입력해 주세요.'),
    ).not.toBeInTheDocument();
  });

  it('전체 검증에 실패하면 첫 오류 필드로 포커스를 이동한다', async () => {
    render(<ProjectReportFormHarness />);

    fireEvent.click(screen.getByRole('button', { name: '전체 검증' }));

    await waitFor(() => {
      expect(screen.getByLabelText('프로젝트명')).toHaveFocus();
    });
  });
});
