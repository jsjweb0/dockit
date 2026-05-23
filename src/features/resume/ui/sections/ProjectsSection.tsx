import type { Project, Resume } from '../../model/resume.types';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from "lucide-react";

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ProjectsSection({ value, onChange }: Props) {
  const list = value.projects;

  const update = (id: string, patch: Partial<Project>) => {
    onChange({
      ...value,
      projects: list.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    });
  };

  const add = () => {
    onChange({
      ...value,
      projects: [
        ...list,
        {
          id: uid(),
          name: '',
          period: '',
          stack: '',
          description: '',
          link: '',
        },
      ],
    });
  };

  const remove = (id: string) => {
    onChange({ ...value, projects: list.filter((x) => x.id !== id) });
  };

  return (
    <FieldSet>
      <FieldLegend>프로젝트 정보</FieldLegend>
      <div className="flex items-center justify-between gap-3">
        <FieldDescription>
          포트폴리오 프로젝트는 목적, 역할, 개선 포인트가 드러나게 적어 주세요.
        </FieldDescription>
        <Button
          type="button"
          variant="outline"
          onClick={add}
          className='gap-1'
        >
          <Plus aria-hidden="true" /> 프로젝트 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((p, idx) => (
        <FieldGroup key={p.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">프로젝트 {idx + 1}</div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(p.id)}
              disabled={list.length <= 1}
            >
              삭제
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel
                htmlFor={`name-${p.id}`}
                className="text-sm text-muted-foreground"
              >
                프로젝트명
              </FieldLabel>
              <Input
                id={`name-${p.id}`}
                type="text"
                value={p.name}
                onChange={(e) => update(p.id, { name: e.target.value })}
                placeholder="예: DocKit 국문 이력서 작성 도구"
                autoComplete="off"
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor={`period-${p.id}`}
                className="text-sm text-muted-foreground"
              >
                기간(자유)
              </FieldLabel>
              <Input
                id={`period-${p.id}`}
                type="text"
                value={p.period}
                onChange={(e) => update(p.id, { period: e.target.value })}
                placeholder="예: 2026.04 - 2026.05"
                autoComplete="off"
                inputMode="numeric"
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor={`stack-${p.id}`}
                className="text-sm text-muted-foreground"
              >
                기술 스택(요약)
              </FieldLabel>
              <Input
                id={`stack-${p.id}`}
                type="text"
                value={p.stack}
                onChange={(e) => update(p.id, { stack: e.target.value })}
                placeholder="예: React, TypeScript, Vite, Tailwind CSS"
                autoComplete="off"
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor={`link-${p.id}`}
                className="text-sm text-muted-foreground"
              >
                링크(선택)
              </FieldLabel>
              <Input
                id={`link-${p.id}`}
                type="url"
                value={p.link ?? ''}
                onChange={(e) => update(p.id, { link: e.target.value })}
                placeholder="예: https://github.com/username/dockit"
                inputMode="url"
                autoComplete="url"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel
              htmlFor={`description-${p.id}`}
              className="text-sm text-muted-foreground"
            >
              설명(역할/기여/성과)
            </FieldLabel>
            <Textarea
              id={`description-${p.id}`}
              value={p.description}
              onChange={(e) => update(p.id, { description: e.target.value })}
              rows={5}
              placeholder={
                '예)\n- 사용자가 입력한 이력서 데이터를 국문 표 양식 미리보기에 실시간 반영\n- colSpan/rowSpan 기반 문서형 레이아웃을 구성하고 빈 행 보정 처리\n- 모바일 작성 화면과 데스크톱 미리보기 영역의 반응형 레이아웃 개선'
              }
              autoComplete="off"
              required
            />
          </Field>
        </FieldGroup>
      ))}
    </FieldSet>
  );
}
