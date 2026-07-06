import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExperienceSection } from './ExperienceSection';
import { defaultResume } from '../../model/resume.defaults';
import type { Resume } from '../../model/resume.types';
import type { ResumeValidationState } from '../../hooks/useResumeValidation';

const createMockValidation = (
    overrides: Partial<ResumeValidationState> = {},
) =>
    ({
        basicsErrors: {},
        sectionErrors: {
            education: {},
            certifications: {},
            experience: {},
            projects: {},
            links: {},
        },
        validationErrorCounts: {
            basics: 0,
            edu: 0,
            cer: 0,
            exp: 0,
            proj: 0,
            link: 0,
            skills: 0,
        },
        totalValidationErrorCount: 0,
        getFirstValidationErrorTarget: vi.fn(),
        touchBasicsField: vi.fn(),
        revalidateBasicsField: vi.fn(),
        touchSectionField: vi.fn(),
        revalidateSectionField: vi.fn(),
        validateResumeBeforeExport: vi.fn(),
        ...overrides,
    }) as ResumeValidationState;

afterEach(() => {
    cleanup();
});

function TestExperienceSection({
    initialValue = defaultResume(),
    onChange = vi.fn(),
    validation = createMockValidation(),
}: {
    initialValue?: Resume;
    onChange?: (next: Resume) => void;
    validation?: ResumeValidationState;
}) {
    const [resume, setResume] = useState(initialValue);

    return (
        <ExperienceSection
            value={resume}
            onChange={(next) => {
                setResume(next);
                onChange(next);
            }}
            validation={validation}
        />
    );
}

describe('ExperienceSection', () => {
    it('재직 중을 체크하면 종료 입력을 비활성화하고 값을 비운다', async () => {
        const user = userEvent.setup();

        const initialValue = {
            ...defaultResume(),
            experience: [
                {
                    ...defaultResume().experience[0],
                    id: 'experience-1',
                    end: '2024-12',
                    isCurrent: false,
                },
            ],
        };

        render(<TestExperienceSection initialValue={initialValue} />);

        const currentCheckbox = screen.getByLabelText(/재직\s*중/i, {
            selector: 'button',
        });
        const endInput = screen.getByLabelText('종료');

        await user.click(currentCheckbox);

        expect(currentCheckbox).toHaveAttribute('aria-checked', 'true');
        expect(endInput).toBeDisabled();
        expect(endInput).toHaveValue('');

        await user.click(currentCheckbox);

        expect(currentCheckbox).toHaveAttribute('aria-checked', 'false');
        expect(endInput).toBeEnabled();
    });

    it('재직 중 체크를 해제하면 종료를 다시 입력할 수 있다', async () => {
        const user = userEvent.setup();

        render(<TestExperienceSection />);

        const currentCheckbox = screen.getByLabelText(/재직\s*중/i, {
            selector: 'button',
        });
        const endInput = screen.getByLabelText('종료');

        await user.click(currentCheckbox);

        expect(currentCheckbox).toHaveAttribute('aria-checked', 'true');
        expect(endInput).toBeDisabled();

        await user.click(currentCheckbox);

        expect(currentCheckbox).toHaveAttribute('aria-checked', 'false');
        expect(endInput).toBeEnabled();

        await user.type(endInput, '2024-12');

        expect(endInput).toHaveValue('2024-12');
    });

    it('다른 경력을 재직 중으로 체크하면 기존 재직 중 경력은 해제된다', async () => {
        const user = userEvent.setup();

        const baseResume = defaultResume();
        const initialValue = {
            ...baseResume,
            experience: [
                {
                    ...baseResume.experience[0],
                    id: 'experience-1',
                    company: '이전 회사',
                    isCurrent: true,
                    end: '',
                },
                {
                    ...baseResume.experience[0],
                    id: 'experience-2',
                    company: '다음 회사',
                    isCurrent: false,
                    end: '2024-12',
                },
            ],
        };

        render(<TestExperienceSection initialValue={initialValue} />);

        const currentCheckboxes = screen.getAllByLabelText(/재직\s*중/i, {
            selector: 'button',
        });
        const endInputs = screen.getAllByLabelText('종료');

        expect(currentCheckboxes[0]).toHaveAttribute('aria-checked', 'true');
        expect(currentCheckboxes[1]).toHaveAttribute('aria-checked', 'false');

        await user.click(currentCheckboxes[1]);

        expect(currentCheckboxes[0]).toHaveAttribute('aria-checked', 'false');
        expect(currentCheckboxes[1]).toHaveAttribute('aria-checked', 'true');
        expect(endInputs[0]).toBeEnabled();
        expect(endInputs[1]).toBeDisabled();
        expect(endInputs[1]).toHaveValue('');
    });
});
