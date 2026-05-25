import type { Experience, Resume } from '../../model/resume.types';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useResumeEditor } from '../../context/resumeEditor.context';

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ExperienceSection({ value, onChange }: Props) {
  const { sectionErrors, touchSectionField, revalidateSectionField } =
    useResumeEditor();
  const list = value.experience;

  const update = (id: string, patch: Partial<Experience>) => {
    const nextExperience = list.map((x) =>
      x.id === id ? { ...x, ...patch } : x,
    );
    const nextResume = { ...value, experience: nextExperience };

    onChange(nextResume);

    return nextResume;
  };

  const revalidate = (id: string, field: string, nextResume: Resume) => {
    revalidateSectionField('experience', id, field, nextResume);
  };

  const touch = (id: string, field: string) => {
    touchSectionField('experience', id, field, value);
  };

  const add = () => {
    onChange({
      ...value,
      experience: [
        {
          id: uid(),
          company: '',
          role: '',
          start: '',
          isCurrent: false,
          end: '',
          description: '',
        },
        ...list,
      ],
    });
  };

  const remove = (id: string) => {
    onChange({ ...value, experience: list.filter((x) => x.id !== id) });
  };

  return (
    <FieldSet>
      <FieldLegend>경력정보</FieldLegend>
      <div className="flex items-center justify-between gap-3">
        <FieldDescription>
          아르바이트, 인턴, 실무 경험은 맡은 일과 결과가 보이게 작성해 주세요.
        </FieldDescription>
        <Button type="button" variant="outline" className="gap-1" onClick={add}>
          <Plus aria-hidden="true" /> 경력 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((e, idx) => {
        const errors = sectionErrors.experience[e.id] ?? {};
        const companyErrorId = `company-${e.id}-error`;
        const startErrorId = `start-${e.id}-error`;
        const endErrorId = `end-${e.id}-error`;
        const roleErrorId = `role-${e.id}-error`;
        const descriptionErrorId = `description-${e.id}-error`;

        return (
          <FieldGroup key={e.id} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-medium">경력 {list.length - idx}</div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(e.id)}
                disabled={list.length <= 1}
              >
                삭제
              </Button>
            </div>
            <div className="grid gap-3 grid-cols-[auto_70px]">
              <Field data-invalid={!!errors.company}>
                <FieldLabel
                  htmlFor={`company-${e.id}`}
                  className="text-sm text-muted-foreground"
                >
                  회사명
                </FieldLabel>
                <Input
                  id={`company-${e.id}`}
                  type="text"
                  value={e.company}
                  onChange={(ev) => {
                    const nextResume = update(e.id, {
                      company: ev.target.value,
                    });
                    revalidate(e.id, 'company', nextResume);
                  }}
                  onBlur={() => touch(e.id, 'company')}
                  placeholder="예: 닷킷 스튜디오"
                  autoComplete="organization"
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? companyErrorId : undefined}
                />
                {errors.company && (
                  <FieldError id={companyErrorId}>{errors.company}</FieldError>
                )}
              </Field>
              <Field orientation="horizontal" className="mt-8">
                <Checkbox
                  id={`isCurrent-${e.id}`}
                  checked={e.isCurrent}
                  onCheckedChange={(checked) => {
                    const isCurrent = checked === true;
                    const nextResume = update(e.id, {
                      isCurrent,
                      end: isCurrent ? '' : e.end,
                    });
                    revalidate(e.id, 'end', nextResume);
                  }}
                  className="peer"
                />
                <FieldLabel
                  htmlFor={`isCurrent-${e.id}`}
                  className="text-sm text-muted-foreground peer-data-[state=checked]:text-black"
                >
                  재직 중
                </FieldLabel>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={!!errors.start}>
                <FieldLabel
                  htmlFor={`start-${e.id}`}
                  className="text-sm text-muted-foreground"
                >
                  시작
                </FieldLabel>
                <Input
                  id={`start-${e.id}`}
                  type="month"
                  value={e.start}
                  onChange={(ev) => {
                    const nextResume = update(e.id, { start: ev.target.value });
                    revalidate(e.id, 'start', nextResume);
                    revalidate(e.id, 'end', nextResume);
                  }}
                  onBlur={() => touch(e.id, 'start')}
                  autoComplete="off"
                  aria-invalid={!!errors.start}
                  aria-describedby={errors.start ? startErrorId : undefined}
                />
                {errors.start && (
                  <FieldError id={startErrorId}>{errors.start}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.end}>
                <FieldLabel
                  htmlFor={`end-${e.id}`}
                  className="text-sm text-muted-foreground"
                >
                  종료
                </FieldLabel>
                <Input
                  id={`end-${e.id}`}
                  type="month"
                  value={e.end ?? ''}
                  onChange={(ev) => {
                    const nextResume = update(e.id, { end: ev.target.value });
                    revalidate(e.id, 'end', nextResume);
                  }}
                  onBlur={() => touch(e.id, 'end')}
                  disabled={e.isCurrent}
                  autoComplete="off"
                  aria-invalid={!!errors.end}
                  aria-describedby={errors.end ? endErrorId : undefined}
                />
                {errors.end && (
                  <FieldError id={endErrorId}>{errors.end}</FieldError>
                )}
              </Field>
            </div>
            <Field data-invalid={!!errors.role}>
              <FieldLabel
                htmlFor={`role-${e.id}`}
                className="text-sm text-muted-foreground"
              >
                직무/직책
              </FieldLabel>
              <Input
                id={`role-${e.id}`}
                type="text"
                value={e.role}
                onChange={(ev) => {
                  const nextResume = update(e.id, { role: ev.target.value });
                  revalidate(e.id, 'role', nextResume);
                }}
                onBlur={() => touch(e.id, 'role')}
                placeholder="예: 웹 퍼블리셔 인턴"
                autoComplete="organization-title"
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? roleErrorId : undefined}
              />
              {errors.role && (
                <FieldError id={roleErrorId}>{errors.role}</FieldError>
              )}
            </Field>
            <div className="mt-3">
              <Field data-invalid={!!errors.description}>
                <FieldLabel
                  htmlFor={`description-${e.id}`}
                  className="text-sm text-muted-foreground"
                >
                  업무/성과(줄바꿈 가능)
                </FieldLabel>
                <Textarea
                  id={`description-${e.id}`}
                  value={e.description}
                  onChange={(ev) => {
                    const nextResume = update(e.id, {
                      description: ev.target.value,
                    });
                    revalidate(e.id, 'description', nextResume);
                  }}
                  onBlur={() => touch(e.id, 'description')}
                  rows={5}
                  placeholder={
                    '예)\n- 이벤트 페이지 HTML/CSS 마크업 및 반응형 레이아웃 구현\n- 반복되는 카드 UI를 React 컴포넌트로 분리해 유지보수성 개선\n- Lighthouse 접근성 경고를 확인하고 label/alt 누락 항목 수정'
                  }
                  autoComplete="off"
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? descriptionErrorId : undefined
                  }
                />
                {errors.description && (
                  <FieldError id={descriptionErrorId}>
                    {errors.description}
                  </FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>
        );
      })}
    </FieldSet>
  );
}
