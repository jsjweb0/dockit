import type { Resume, Education } from '../../model/resume.types';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useResumeEditor } from '../../context/resumeEditor.context';

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function EducationSection({ value, onChange }: Props) {
  const { sectionErrors, touchSectionField, revalidateSectionField } =
    useResumeEditor();
  const list = value.education;

  const update = (id: string, patch: Partial<Education>) => {
    const nextEducation = list.map((x) => (x.id === id ? { ...x, ...patch } : x));
    const nextResume = { ...value, education: nextEducation };

    onChange(nextResume);

    return nextResume;
  };

  const revalidate = (id: string, field: string, nextResume: Resume) => {
    revalidateSectionField('education', id, field, nextResume);
  };

  const touch = (id: string, field: string) => {
    touchSectionField('education', id, field, value);
  };

  const remove = (id: string) => {
    onChange({
      ...value,
      education: list.filter((x) => x.id !== id),
    });
  };

  const add = () => {
    onChange({
      ...value,
      education: [
        { id: uid(), period: '', institution: '', major: '' },
        ...list,
      ],
    });
  };

  return (
    <FieldSet className="w-full">
      <FieldLegend className="flex flex-col">학력정보</FieldLegend>
      <div className="flex items-center justify-between gap-3">
        <FieldDescription>
          학력을 추가하면 새 항목이 위에 배치됩니다.
        </FieldDescription>
        <Button type="button" variant="outline" className="gap-1" onClick={add}>
          <Plus aria-hidden="true" /> 학력 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((e, idx) => {
        const errors = sectionErrors.education[e.id] ?? {};
        const institutionErrorId = `institution-${e.id}-error`;
        const periodErrorId = `period-${e.id}-error`;
        const majorErrorId = `major-${e.id}-error`;

        return (
          <FieldGroup key={e.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-bold">학력 {list.length - idx}</div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(e.id)}
                disabled={list.length <= 1}
                aria-label={`학력 ${list.length - idx} 삭제`}
              >
                삭제
              </Button>
            </div>
            <Field data-invalid={!!errors.institution}>
              <FieldLabel
                htmlFor={`institution-${e.id}`}
                className="text-sm text-muted-foreground"
              >
                학교
              </FieldLabel>
              <Input
                id={`institution-${e.id}`}
                type="text"
                value={e.institution}
                onChange={(ev) => {
                  const nextResume = update(e.id, {
                    institution: ev.target.value,
                  });
                  revalidate(e.id, 'institution', nextResume);
                }}
                onBlur={() => touch(e.id, 'institution')}
                placeholder="예: 한국대학교"
                autoComplete="organization"
                aria-invalid={!!errors.institution}
                aria-describedby={
                  errors.institution ? institutionErrorId : undefined
                }
              />
              {errors.institution && (
                <FieldError id={institutionErrorId}>
                  {errors.institution}
                </FieldError>
              )}
            </Field>
            <Field data-invalid={!!errors.period}>
              <FieldLabel
                htmlFor={`period-${e.id}`}
                className="text-sm text-muted-foreground"
              >
                기간
              </FieldLabel>
              <Input
                id={`period-${e.id}`}
                type="text"
                value={e.period}
                onChange={(ev) => {
                  const nextResume = update(e.id, { period: ev.target.value });
                  revalidate(e.id, 'period', nextResume);
                }}
                onBlur={() => touch(e.id, 'period')}
                placeholder="예: 2021.03 - 2025.02"
                autoComplete="off"
                inputMode="numeric"
                aria-invalid={!!errors.period}
                aria-describedby={errors.period ? periodErrorId : undefined}
              />
              {errors.period && (
                <FieldError id={periodErrorId}>{errors.period}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!errors.major}>
              <FieldLabel
                htmlFor={`major-${e.id}`}
                className="text-sm text-muted-foreground"
              >
                학과(전공)
              </FieldLabel>
              <Input
                id={`major-${e.id}`}
                type="text"
                value={e.major}
                onChange={(ev) => {
                  const nextResume = update(e.id, { major: ev.target.value });
                  revalidate(e.id, 'major', nextResume);
                }}
                onBlur={() => touch(e.id, 'major')}
                placeholder="예: 컴퓨터공학과"
                autoComplete="off"
                aria-invalid={!!errors.major}
                aria-describedby={errors.major ? majorErrorId : undefined}
              />
              {errors.major && (
                <FieldError id={majorErrorId}>{errors.major}</FieldError>
              )}
            </Field>
          </FieldGroup>
        );
      })}
    </FieldSet>
  );
}
