import type { Resume, LinkItem } from '../../model/resume.types';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useResumeEditor } from '../../context/resumeEditor.context';

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function LinkItemSection({ value, onChange }: Props) {
  const { sectionErrors, touchSectionField, revalidateSectionField } =
    useResumeEditor();
  const list = value.links;

  const update = (id: string, patch: Partial<LinkItem>) => {
    const nextLinks = list.map((x) => (x.id === id ? { ...x, ...patch } : x));

    const nextResume = { ...value, links: nextLinks };

    onChange(nextResume);

    return nextResume;
  };

  const revalidate = (id: string, field: string, nextResume: Resume) => {
    revalidateSectionField('links', id, field, nextResume);
  };

  const touch = (id: string, field: string) => {
    touchSectionField('links', id, field, value);
  };

  const add = () => {
    onChange({
      ...value,
      links: [{ id: uid(), label: '', url: '' }, ...list],
    });
  };

  const remove = (id: string) => {
    onChange({ ...value, links: list.filter((x) => x.id !== id) });
  };

  return (
    <FieldSet>
      <FieldLegend>링크정보</FieldLegend>
      <div className="flex items-center justify-between gap-3">
        <FieldDescription>
          GitHub, 배포 주소, 포트폴리오처럼 채용자가 바로 확인할 링크를 넣어
          주세요.
        </FieldDescription>
        <Button type="button" variant="outline" className="gap-1" onClick={add}>
          <Plus aria-hidden="true" /> 링크 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((l, idx) => {
        const errors = sectionErrors.links[l.id] ?? {};
        const labelErrorId = `label-${l.id}-error`;
        const urlErrorId = `url-${l.id}-error`;
        const groupTitleId = `link-${l.id}-title`;

        return (
          <FieldGroup
            key={l.id}
            className="rounded-lg border p-4"
            aria-labelledby={groupTitleId}
          >
            <div className="mb-3 flex items-center justify-between">
              <div id={groupTitleId} className="font-medium">
                링크 {list.length - idx}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(l.id)}
                disabled={list.length <= 1}
                aria-label={`링크 ${list.length - idx} 삭제`}
              >
                삭제
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field data-invalid={!!errors.label}>
                <FieldLabel
                  htmlFor={`label-${l.id}`}
                  className="text-sm text-muted-foreground"
                >
                  링크 이름
                </FieldLabel>
                <Input
                  id={`label-${l.id}`}
                  type="text"
                  value={l.label}
                  onChange={(ev) => {
                    const nextResume = update(l.id, { label: ev.target.value });
                    revalidate(l.id, 'label', nextResume);
                  }}
                  onBlur={() => touch(l.id, 'label')}
                  placeholder="예: GitHub"
                  autoComplete="off"
                  aria-invalid={!!errors.label}
                  aria-describedby={errors.label ? labelErrorId : undefined}
                />
                {errors.label && (
                  <FieldError id={labelErrorId}>{errors.label}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.url}>
                <FieldLabel
                  htmlFor={`url-${l.id}`}
                  className="text-sm text-muted-foreground"
                >
                  URL
                </FieldLabel>
                <Input
                  id={`url-${l.id}`}
                  type="url"
                  value={l.url}
                  onChange={(ev) => {
                    const nextResume = update(l.id, { url: ev.target.value });
                    revalidate(l.id, 'url', nextResume);
                  }}
                  onBlur={() => touch(l.id, 'url')}
                  placeholder="예: https://github.com/username"
                  inputMode="url"
                  autoComplete="url"
                  aria-invalid={!!errors.url}
                  aria-describedby={errors.url ? urlErrorId : undefined}
                />
                {errors.url && (
                  <FieldError id={urlErrorId}>{errors.url}</FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>
        );
      })}
    </FieldSet>
  );
}
