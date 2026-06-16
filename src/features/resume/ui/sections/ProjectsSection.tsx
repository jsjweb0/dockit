import type { Project, Resume } from '../../model/resume.types';
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
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useResumeEditor } from '../../context/resumeEditor.context';
import { createId } from '@/lib/utils';

type Props = { value: Resume; onChange: (next: Resume) => void };

export function ProjectsSection({ value, onChange }: Props) {
  const { sectionErrors, touchSectionField, revalidateSectionField } =
    useResumeEditor();
  const list = value.projects;

  const update = (id: string, patch: Partial<Project>) => {
    const nextProjects = list.map((x) => (x.id === id ? { ...x, ...patch } : x));
    const nextResume = { ...value, projects: nextProjects };

    onChange(nextResume);

    return nextResume;
  };

  const revalidate = (id: string, field: string, nextResume: Resume) => {
    revalidateSectionField('projects', id, field, nextResume);
  };

  const touch = (id: string, field: string) => {
    touchSectionField('projects', id, field, value);
  };

  const add = () => {
    onChange({
      ...value,
      projects: [
        {
          id: createId(),
          name: '',
          period: '',
          stack: '',
          description: '',
          link: '',
        },
        ...list,
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
        <Button type="button" variant="outline" onClick={add} className="gap-1">
          <Plus aria-hidden="true" /> 프로젝트 추가
        </Button>
      </div>
      <FieldSeparator />

      {list.map((p, idx) => {
        const errors = sectionErrors.projects[p.id] ?? {};
        const nameErrorId = `name-${p.id}-error`;
        const periodErrorId = `period-${p.id}-error`;
        const stackErrorId = `stack-${p.id}-error`;
        const linkErrorId = `link-${p.id}-error`;
        const descriptionErrorId = `description-${p.id}-error`;
        const groupTitleId = `project-${p.id}-title`;

        return (
          <FieldGroup
            key={p.id}
            className="rounded-lg border p-4"
            aria-labelledby={groupTitleId}
          >
            <div className="mb-3 flex items-center justify-between">
              <div id={groupTitleId} className="font-medium">
                프로젝트 {list.length - idx}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(p.id)}
                disabled={list.length <= 1}
                aria-label={`프로젝트 ${list.length - idx} 삭제`}
              >
                삭제
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field data-invalid={!!errors.name}>
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
                  onChange={(e) => {
                    const nextResume = update(p.id, { name: e.target.value });
                    revalidate(p.id, 'name', nextResume);
                  }}
                  onBlur={() => touch(p.id, 'name')}
                  placeholder="예: DocKit 국문 이력서 작성 도구"
                  autoComplete="off"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? nameErrorId : undefined}
                />
                {errors.name && (
                  <FieldError id={nameErrorId}>{errors.name}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.period}>
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
                  onChange={(e) => {
                    const nextResume = update(p.id, { period: e.target.value });
                    revalidate(p.id, 'period', nextResume);
                  }}
                  onBlur={() => touch(p.id, 'period')}
                  placeholder="예: 2026.04 - 2026.05"
                  autoComplete="off"
                  inputMode="numeric"
                  aria-invalid={!!errors.period}
                  aria-describedby={errors.period ? periodErrorId : undefined}
                />
                {errors.period && (
                  <FieldError id={periodErrorId}>{errors.period}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.stack}>
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
                  onChange={(e) => {
                    const nextResume = update(p.id, { stack: e.target.value });
                    revalidate(p.id, 'stack', nextResume);
                  }}
                  onBlur={() => touch(p.id, 'stack')}
                  placeholder="예: React, TypeScript, Vite, Tailwind CSS"
                  autoComplete="off"
                  aria-invalid={!!errors.stack}
                  aria-describedby={errors.stack ? stackErrorId : undefined}
                />
                {errors.stack && (
                  <FieldError id={stackErrorId}>{errors.stack}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.link}>
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
                  onChange={(e) => {
                    const nextResume = update(p.id, { link: e.target.value });
                    revalidate(p.id, 'link', nextResume);
                  }}
                  onBlur={() => touch(p.id, 'link')}
                  placeholder="예: https://github.com/username/dockit"
                  inputMode="url"
                  autoComplete="url"
                  aria-invalid={!!errors.link}
                  aria-describedby={errors.link ? linkErrorId : undefined}
                />
                {errors.link && (
                  <FieldError id={linkErrorId}>{errors.link}</FieldError>
                )}
              </Field>
            </div>
            <Field data-invalid={!!errors.description}>
              <FieldLabel
                htmlFor={`description-${p.id}`}
                className="text-sm text-muted-foreground"
              >
                설명(역할/기여/성과)
              </FieldLabel>
              <Textarea
                id={`description-${p.id}`}
                value={p.description}
                onChange={(e) => {
                  const nextResume = update(p.id, {
                    description: e.target.value,
                  });
                  revalidate(p.id, 'description', nextResume);
                }}
                onBlur={() => touch(p.id, 'description')}
                rows={5}
                placeholder={
                  '예)\n- 사용자가 입력한 이력서 데이터를 국문 표 양식 미리보기에 실시간 반영\n- colSpan/rowSpan 기반 문서형 레이아웃을 구성하고 빈 행 보정 처리\n- 모바일 작성 화면과 데스크톱 미리보기 영역의 반응형 레이아웃 개선'
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
          </FieldGroup>
        );
      })}
    </FieldSet>
  );
}
