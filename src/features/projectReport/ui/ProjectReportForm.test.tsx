import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useProjectReportValidation } from '../hook/useProjectReportValidation';
import { defaultProjectReport } from '../model/projectReport.defaults';
import { ProjectReportForm } from './ProjectReportForm';

function ProjectReportFormHarness() {
  const [projectReport, setProjectReport] = useState(defaultProjectReport);
  const validation = useProjectReportValidation(projectReport);

  return (
    <ProjectReportForm
      value={projectReport}
      onChange={setProjectReport}
      errors={validation.errors}
      onFieldBlur={validation.validateField}
    />
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

  it('값을 입력하고 다시 blur하면 오류를 제거한다', () => {
    render(<ProjectReportFormHarness />);

    const titleInput = screen.getByLabelText('프로젝트명');
    fireEvent.blur(titleInput);
    fireEvent.change(titleInput, { target: { value: 'DocKit' } });
    fireEvent.blur(titleInput);

    expect(titleInput).toHaveAttribute('aria-invalid', 'false');
    expect(titleInput).not.toHaveAttribute('aria-describedby');
    expect(
      screen.queryByText('필수 항목을 입력해 주세요.'),
    ).not.toBeInTheDocument();
  });
});
