import type { Resume, Certification } from '../../model/resume.types';
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

export function CertificationSection({ value, onChange }: Props) {
  const { sectionErrors, touchSectionField, revalidateSectionField } =
    useResumeEditor();
  const list = value.certifications;

  const update = (id: string, patch: Partial<Certification>) => {
    const nextCertifications = list.map((x) =>
      x.id === id ? { ...x, ...patch } : x,
    );
    const nextResume = { ...value, certifications: nextCertifications };

    onChange(nextResume);

    return nextResume;
  };

  const revalidate = (id: string, field: string, nextResume: Resume) => {
    revalidateSectionField('certifications', id, field, nextResume);
  };

  const touch = (id: string, field: string) => {
    touchSectionField('certifications', id, field, value);
  };

  const add = () => {
    onChange({
      ...value,
      certifications: [
        { id: uid(), acquiredAt: '', name: '', issuer: '' },
        ...list,
      ],
    });
  };

  const remove = (id: string) => {
    onChange({ ...value, certifications: list.filter((x) => x.id !== id) });
  };

  return (
    <FieldSet>
      <FieldLegend>자격증 정보</FieldLegend>
      <div className="flex items-center justify-between gap-3">
        <FieldDescription>
          지원 직무와 관련 있는 자격증 위주로 입력해 주세요.
        </FieldDescription>
        <Button type="button" variant="outline" className="gap-1" onClick={add}>
          <Plus aria-hidden="true" /> 자격증 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((c, idx) => {
        const errors = sectionErrors.certifications[c.id] ?? {};
        const nameErrorId = `certification-name-${c.id}-error`;
        const acquiredAtErrorId = `acquiredAt-${c.id}-error`;
        const issuerErrorId = `issuer-${c.id}-error`;
        const groupTitleId = `certification-${c.id}-title`;

        return (
          <FieldGroup
            key={c.id}
            className="rounded-lg border p-4"
            aria-labelledby={groupTitleId}
          >
            <div className="mb-3 flex items-center justify-between">
              <div id={groupTitleId} className="font-medium">
                자격증 {list.length - idx}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(c.id)}
                disabled={list.length <= 1}
                aria-label={`자격증 ${list.length - idx} 삭제`}
              >
                삭제
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FieldLabel
                  htmlFor={`certification-name-${c.id}`}
                  className="text-sm text-muted-foreground"
                >
                  자격증
                </FieldLabel>
                <Input
                  id={`certification-name-${c.id}`}
                  type="text"
                  value={c.name}
                  onChange={(ev) => {
                    const nextResume = update(c.id, { name: ev.target.value });
                    revalidate(c.id, 'name', nextResume);
                  }}
                  onBlur={() => touch(c.id, 'name')}
                  placeholder="예: 웹디자인기능사"
                  autoComplete="off"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? nameErrorId : undefined}
                />
                {errors.name && (
                  <FieldError id={nameErrorId}>{errors.name}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.acquiredAt}>
                <FieldLabel
                  htmlFor={`acquiredAt-${c.id}`}
                  className="text-sm text-muted-foreground"
                >
                  취득일
                </FieldLabel>
                <Input
                  type="date"
                  id={`acquiredAt-${c.id}`}
                  value={c.acquiredAt}
                  onChange={(ev) => {
                    const nextResume = update(c.id, {
                      acquiredAt: ev.target.value,
                    });
                    revalidate(c.id, 'acquiredAt', nextResume);
                  }}
                  onBlur={() => touch(c.id, 'acquiredAt')}
                  placeholder="예: 2024.06"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={!!errors.acquiredAt}
                  aria-describedby={
                    errors.acquiredAt ? acquiredAtErrorId : undefined
                  }
                />
                {errors.acquiredAt && (
                  <FieldError id={acquiredAtErrorId}>
                    {errors.acquiredAt}
                  </FieldError>
                )}
              </Field>
            </div>
            <Field data-invalid={!!errors.issuer}>
              <FieldLabel
                htmlFor={`issuer-${c.id}`}
                className="text-sm text-muted-foreground"
              >
                발행처
              </FieldLabel>
              <Input
                id={`issuer-${c.id}`}
                type="text"
                value={c.issuer}
                onChange={(ev) => {
                  const nextResume = update(c.id, { issuer: ev.target.value });
                  revalidate(c.id, 'issuer', nextResume);
                }}
                onBlur={() => touch(c.id, 'issuer')}
                placeholder="예: 한국산업인력공단"
                autoComplete="organization"
                aria-invalid={!!errors.issuer}
                aria-describedby={errors.issuer ? issuerErrorId : undefined}
              />
              {errors.issuer && (
                <FieldError id={issuerErrorId}>{errors.issuer}</FieldError>
              )}
            </Field>
          </FieldGroup>
        );
      })}
    </FieldSet>
  );
}
