import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResumeForm } from './ResumeForm';
import { defaultResume } from '../model/resume.defaults';

afterEach(() => {
    cleanup();
});

const mockValidation = {
    basicsErrors: {},
    sectionErrors: {
        education: {},
        certifications: {},
        experience: {},
        projects: {},
        links: {},
    },
    validationErrorCounts: {
        basics: 2,
        edu: 0,
        cer: 0,
        exp: 1,
        proj: 0,
        link: 0,
        skills: 0,
    },
    totalValidationErrorCount: 3,
    focusRequestId: 0,
    getFirstValidationErrorTarget: vi.fn(),
    touchBasicsField: vi.fn(),
    revalidateBasicsField: vi.fn(),
    touchSectionField: vi.fn(),
    revalidateSectionField: vi.fn(),
    validateResumeBeforeExport: vi.fn(),
};

vi.mock('../context/resumeEditor.context', () => ({
    useResumeEditor: () => ({
        resetVersion: 0,
    }),
}));

vi.mock('../hooks/useResumeValidation', () => ({
    useResumeValidation: () => mockValidation,
}));

describe('ResumeForm', () => {
    beforeEach(() => {
        mockValidation.focusRequestId = 0;
        mockValidation.getFirstValidationErrorTarget.mockReset();
    });

    it('탭에 검증 오류 개수를 표시한다', () => {
        render(<ResumeForm value={defaultResume()} onChange={vi.fn()} />);

        const basicsTab = screen.getByRole('tab', {
            name: /기본.*오류 2개/,
        });
        const experienceTab = screen.getByRole('tab', {
            name: /경력.*오류 1개/,
        });

        expect(within(basicsTab).getByText('2')).toBeInTheDocument();
        expect(within(experienceTab).getByText('1')).toBeInTheDocument();
    });

    it('오류가 없는 탭에는 오류 개수를 표시하지 않는다', () => {
        render(<ResumeForm value={defaultResume()} onChange={vi.fn()} />);

        const educationTab = screen.getByRole('tab', {
            name: '학력',
        });

        expect(within(educationTab).queryByText('0')).not.toBeInTheDocument();
        expect(educationTab).not.toHaveAccessibleName(/오류 0개/);
    });

    it('전체 검증 실패 요청이 오면 오류 탭을 열고 첫 오류에 포커스한다', async () => {
        const resume = defaultResume();
        const educationInputId = `institution-${resume.education[0].id}`;
        mockValidation.getFirstValidationErrorTarget.mockReturnValue({
            tab: 'edu',
            fieldId: educationInputId,
        });

        const { rerender } = render(
            <ResumeForm value={resume} onChange={vi.fn()} />,
        );

        mockValidation.focusRequestId = 1;
        rerender(<ResumeForm value={resume} onChange={vi.fn()} />);

        await waitFor(() => {
            expect(document.getElementById(educationInputId)).toHaveFocus();
        });
        expect(screen.getByRole('tab', { name: '학력' })).toHaveAttribute(
            'data-state',
            'active',
        );
    });
});
