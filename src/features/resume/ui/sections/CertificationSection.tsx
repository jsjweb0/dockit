import type { Resume, Certification } from '../../model/resume.types';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function CertificationSection({ value, onChange }: Props) {
  const list = value.certifications;

  const update = (id: string, patch: Partial<Certification>) => {
    onChange({
      ...value,
      certifications: list.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    });
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
          <Plus /> 자격증 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((c, idx) => (
        <FieldGroup key={c.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">자격증 {list.length - idx}</div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(c.id)}
              disabled={list.length <= 1}
            >
              삭제
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
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
                onChange={(ev) => update(c.id, { name: ev.target.value })}
                placeholder="예: 웹디자인기능사"
                autoComplete="off"
              />
            </Field>
            <Field>
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
                onChange={(ev) => update(c.id, { acquiredAt: ev.target.value })}
                placeholder="예: 2024.06"
                inputMode="numeric"
                autoComplete="off"
              />
            </Field>
          </div>
          <Field>
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
              onChange={(ev) => update(c.id, { issuer: ev.target.value })}
              placeholder="예: 한국산업인력공단"
              autoComplete="organization"
            />
          </Field>
        </FieldGroup>
      ))}
    </FieldSet>
  );
}
