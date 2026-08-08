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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectReport } from '../model/projectReport.types';
import { useCallback } from 'react';
import { useValidationErrorFocus } from '@/features/documents/hooks/useValidationErrorFocus';
import {
  PROJECT_REPORT_VALIDATED_FIELDS,
  type ProjectReportFieldErrors,
  type ProjectReportValidatedField,
} from '../model/projectReport.validation';

type Props = {
  value: ProjectReport;
  onChange: (next: ProjectReport) => void;
  errors?: ProjectReportFieldErrors;
  onFieldBlur?: (field: ProjectReportValidatedField) => void;
  onFieldChange?: (
    field: ProjectReportValidatedField,
    nextProjectReport: ProjectReport,
  ) => void;
  focusRequestId?: number;
};

const PROJECT_REPORT_FIELD_IDS: Record<
  ProjectReportValidatedField,
  string
> = {
  title: 'project-report-title',
  summary: 'project-report-summary',
  role: 'project-report-role',
  period: 'project-report-period',
  techStack: 'project-report-tech-stack',
  keyFeatures: 'project-report-key-features',
};

export function ProjectReportForm({
  value,
  onChange,
  errors = {},
  onFieldBlur,
  onFieldChange,
  focusRequestId = 0,
}: Props) {
  const focusFirstError = useCallback(() => {
    const firstErrorField = PROJECT_REPORT_VALIDATED_FIELDS.find(
      (field) => errors[field],
    );

    if (!firstErrorField) return;

    document
      .getElementById(PROJECT_REPORT_FIELD_IDS[firstErrorField])
      ?.focus();
  }, [errors]);

  useValidationErrorFocus({
    focusRequestId,
    focusFirstError,
  });

  const updateValidatedField = (
    field: ProjectReportValidatedField,
    nextValue: string,
  ) => {
    const nextProjectReport: ProjectReport = {
      ...value,
      [field]: nextValue,
    };

    onChange(nextProjectReport);
    onFieldChange?.(field, nextProjectReport);
  };

  const updateField = <Key extends keyof ProjectReport>(
    key: Key,
    nextValue: ProjectReport[Key],
  ) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <FieldSet>
      <FieldLegend>{value.title || '프로젝트 보고서'}</FieldLegend>
      <FieldDescription>
        프로젝트의 목적과 기여 내용을 채용 담당자가 빠르게 이해할 수 있도록
        구체적으로 작성해 주세요.
      </FieldDescription>
      <FieldSeparator />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="project-report-title" className="font-bold">
            프로젝트명
          </FieldLabel>
          <Input
            id="project-report-title"
            value={value.title}
            onChange={(event) => updateValidatedField('title', event.target.value)}
            onBlur={() => onFieldBlur?.('title')}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={
              errors.title ? 'project-report-title-error' : undefined
            }
          />
          <FieldError id="project-report-title-error">
            {errors.title}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="project-report-summary" className="font-bold">
            프로젝트 목적
          </FieldLabel>
          <Textarea
            id="project-report-summary"
            value={value.summary}
            onChange={(event) => updateValidatedField('summary', event.target.value)}
            onBlur={() => onFieldBlur?.('summary')}
            aria-invalid={Boolean(errors.summary)}
            aria-describedby={
              errors.summary ? 'project-report-summary-error' : undefined
            }
            placeholder="어떤 사용자의 문제를 해결하기 위해 만든 프로젝트인지 작성해 주세요."
            className="min-h-28 resize-y"
          />
          <FieldError id="project-report-summary-error">
            {errors.summary}
          </FieldError>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="project-report-role" className="font-bold">
              담당 역할
            </FieldLabel>
            <Input
              id="project-report-role"
              value={value.role}
              onChange={(event) => updateValidatedField('role', event.target.value)}
              onBlur={() => onFieldBlur?.('role')}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={
                errors.role ? 'project-report-role-error' : undefined
              }
              placeholder="예: 프론트엔드 개발 · UI 퍼블리싱"
            />
            <FieldError id="project-report-role-error">
              {errors.role}
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="project-report-period" className="font-bold">
              진행 기간
            </FieldLabel>
            <Input
              id="project-report-period"
              value={value.period}
              onChange={(event) => updateValidatedField('period', event.target.value)}
              onBlur={() => onFieldBlur?.('period')}
              aria-invalid={Boolean(errors.period)}
              aria-describedby={
                errors.period ? 'project-report-period-error' : undefined
              }
              placeholder="예: 2026.01 - 2026.03"
            />
            <FieldError id="project-report-period-error">
              {errors.period}
            </FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="project-report-tech-stack" className="font-bold">
            기술 스택
          </FieldLabel>
          <Input
            id="project-report-tech-stack"
            value={value.techStack}
            onChange={(event) => updateValidatedField('techStack', event.target.value)}
            onBlur={() => onFieldBlur?.('techStack')}
            aria-invalid={Boolean(errors.techStack)}
            aria-describedby={
              errors.techStack ? 'project-report-tech-stack-error' : undefined
            }
            placeholder="예: React, TypeScript, Vite, Tailwind CSS"
          />
          <FieldError id="project-report-tech-stack-error">
            {errors.techStack}
          </FieldError>
        </Field>

        <FieldSeparator />

        <Field>
          <FieldLabel htmlFor="project-report-key-features" className="font-bold">
            주요 기능
          </FieldLabel>
          <Textarea
            id="project-report-key-features"
            value={value.keyFeatures}
            onChange={(event) => updateValidatedField('keyFeatures', event.target.value)}
            onBlur={() => onFieldBlur?.('keyFeatures')}
            aria-invalid={Boolean(errors.keyFeatures)}
            aria-describedby={
              errors.keyFeatures
                ? 'project-report-key-features-error'
                : undefined
            }
            placeholder={'기능을 한 줄에 하나씩 작성해 주세요.\n예: 입력 내용 실시간 미리보기'}
            className="min-h-32 resize-y"
          />
          <FieldError id="project-report-key-features-error">
            {errors.keyFeatures}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="project-report-problem" className="font-bold">
            해결한 문제
          </FieldLabel>
          <Textarea
            id="project-report-problem"
            value={value.problem}
            onChange={(event) => updateField('problem', event.target.value)}
            placeholder="구현 과정에서 발견한 구체적인 문제와 사용자에게 미친 영향을 작성해 주세요."
            className="min-h-32 resize-y"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="project-report-solution" className="font-bold">
            해결 과정
          </FieldLabel>
          <Textarea
            id="project-report-solution"
            value={value.solution}
            onChange={(event) => updateField('solution', event.target.value)}
            placeholder="선택한 해결 방법과 그 이유를 작성해 주세요."
            className="min-h-32 resize-y"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="project-report-outcome" className="font-bold">
            개선 결과
          </FieldLabel>
          <Textarea
            id="project-report-outcome"
            value={value.outcome}
            onChange={(event) => updateField('outcome', event.target.value)}
            placeholder="변경 전후 차이와 확인 가능한 결과를 작성해 주세요."
            className="min-h-32 resize-y"
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="project-report-responsive-accessibility"
            className="font-bold"
          >
            반응형 · 접근성 작업
          </FieldLabel>
          <Textarea
            id="project-report-responsive-accessibility"
            value={value.responsiveAccessibility}
            onChange={(event) =>
              updateField('responsiveAccessibility', event.target.value)
            }
            placeholder="모바일 대응, 시맨틱 마크업, 키보드 탐색 등 실제 적용 내용을 작성해 주세요."
            className="min-h-28 resize-y"
          />
        </Field>

        <FieldSeparator />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="project-report-github-url" className="font-bold">
              GitHub 링크
            </FieldLabel>
            <Input
              id="project-report-github-url"
              type="url"
              value={value.githubUrl}
              onChange={(event) => updateField('githubUrl', event.target.value)}
              placeholder="https://github.com/..."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="project-report-demo-url" className="font-bold">
              배포 링크
            </FieldLabel>
            <Input
              id="project-report-demo-url"
              type="url"
              value={value.demoUrl}
              onChange={(event) => updateField('demoUrl', event.target.value)}
              placeholder="https://..."
            />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
