import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BasicsSection } from './BasicsSection';
import { defaultResume } from '../../model/resume.defaults';
import type { Resume } from '../../model/resume.types';
import { validateBasicsField } from '../../model/resume.basics.validation';
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

function TestBasicsSection({
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
        <BasicsSection
            value={resume}
            onChange={(next) => {
                setResume(next);
                onChange(next);
            }}
            validation={validation}
        />
    );
}

describe('BasicsSection', () => {

    it('연락처에 숫자를 입력하면 하이픈 형식으로 표시한다', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(<TestBasicsSection onChange={handleChange} />);

        const phoneInput = screen.getByLabelText('연락처');

        await user.type(phoneInput, '01012345678');

        expect(phoneInput).toHaveValue('010-1234-5678');
        expect(handleChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                basics: expect.objectContaining({
                    phone: '010-1234-5678',
                }),
            }),
        );
    });

    it('간단 소개 입력 글자 수를 표시한다', async () => {
        const user = userEvent.setup();

        render(<TestBasicsSection />);

        const summaryInput = screen.getByRole('textbox', {
            name: /간단 소개/,
        });

        await user.type(summaryInput, '웹 표준을 고려한 UI를 구현합니다.');

        expect(document.getElementById('summary-count')).toHaveTextContent('20 / 100');
    });

    it('이름 필드는 처음 렌더링 시 검증 오류를 표시하지 않는다', () => {
        render(<TestBasicsSection />);

        const nameInput = screen.getByLabelText('이름(한글)');

        expect(nameInput).toHaveAttribute('aria-invalid', 'false');
        expect(screen.queryByText('이름을 입력해 주세요.')).not.toBeInTheDocument();
    });

    it('이메일 입력 시 이메일 필드 재검증 함수를 호출한다', async () => {
        const user = userEvent.setup();
        const revalidateBasicsField = vi.fn();

        const validation = createMockValidation({ revalidateBasicsField });

        render(<TestBasicsSection validation={validation} />);

        const emailInput = screen.getByLabelText('이메일');

        await user.type(emailInput, 'wrong-email');

        expect(emailInput).toHaveValue('wrong-email');
        expect(revalidateBasicsField).toHaveBeenLastCalledWith(
            'email',
            expect.objectContaining({
                email: 'wrong-email',
            }),
        );
    });

    it('잘못된 이메일 형식이면 오류 메시지를 반환한다', () => {
        expect(validateBasicsField('email', {
            ...defaultResume().basics,
            email: 'wrong-email',
        })).toBe('올바른 이메일 형식이 아닙니다.');
    });

});
