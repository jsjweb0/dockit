import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDocumentValidation } from './useDocumentValidation';
import { defaultResume } from '@/features/resume/model/resume.defaults';
import { getSectionFieldKey, resumeValidationAdapter } from '@/features/resume/model/resume.validationAdapter';
import { SECTION_VALIDATED_FIELDS } from '@/features/resume/model/resume.optionalSections.validation';

describe('useDocumentValidation 항목 정리', () => {
  it('지정 항목의 errors와 touched를 제거하고 다른 항목은 유지한다', () => {
    const resume = defaultResume();
    resume.experience[0].company = '회사';
    resume.projects[0].name = '프로젝트';
    const { result } = renderHook(() => useDocumentValidation({ document: resume, adapter: resumeValidationAdapter }));
    act(() => { result.current.validateBeforeSubmit(); });
    const fields = SECTION_VALIDATED_FIELDS.experience.map(field => getSectionFieldKey('experience', resume.experience[0].id, field));
    expect(fields.every(field => result.current.touchedFields.has(field))).toBe(true);
    act(() => { result.current.clearFields(fields); });
    expect(result.current.errors.sectionErrors.experience).toEqual({});
    expect(fields.some(field => result.current.touchedFields.has(field))).toBe(false);
    expect(result.current.errors.sectionErrors.projects[resume.projects[0].id]).toBeDefined();
    expect(result.current.touchedFields.has(getSectionFieldKey('projects', resume.projects[0].id, 'period'))).toBe(true);
    act(() => { result.current.revalidateField(fields[1]); });
    expect(result.current.errors.sectionErrors.experience).toEqual({});
  });
});
