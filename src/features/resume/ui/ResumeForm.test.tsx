import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
});