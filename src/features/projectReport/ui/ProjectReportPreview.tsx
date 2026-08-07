import { Badge } from '@/components/ui/badge';
import type { ProjectReport } from '../model/projectReport.types';

type Props = { value: ProjectReport };

const splitTechStack = (value: string) =>
  value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const splitKeyFeatures = (value: string) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const reportSections = [
  {
    key: 'problem',
    title: '해결한 문제',
    placeholder: '프로젝트에서 해결한 문제를 작성해 주세요.',
  },
  {
    key: 'solution',
    title: '해결 과정',
    placeholder: '선택한 해결 방법과 이유를 작성해 주세요.',
  },
  {
    key: 'outcome',
    title: '개선 결과',
    placeholder: '변경 전후의 구체적인 결과를 작성해 주세요.',
  },
  {
    key: 'responsiveAccessibility',
    title: '반응형 · 접근성',
    placeholder: '반응형과 접근성을 위해 적용한 내용을 작성해 주세요.',
  },
] as const;

export function ProjectReportPreview({ value }: Props) {
  const techStack = splitTechStack(value.techStack);
  const keyFeatures = splitKeyFeatures(value.keyFeatures);

  return (
    <article className="px-5 py-4">
      <div className="pb-5">
        <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-muted-foreground">
          PROJECT REPORT
        </p>
        <h2 className="text-3xl font-bold tracking-tight">
          {value.title || '프로젝트명'}
        </h2>
        <p className="mt-3 whitespace-pre-line text-base leading-7 text-muted-foreground">
          {value.summary || '프로젝트의 목적과 대상 사용자를 작성해 주세요.'}
        </p>
      </div>

      <dl className="grid grid-cols-[90px_1fr] gap-x-5 gap-y-3 border-t-2 border-black bg-muted/40 px-5 py-4 text-sm">
        <dt className="font-semibold">담당 역할</dt>
        <dd>{value.role || '담당 역할'}</dd>
        <dt className="font-semibold">진행 기간</dt>
        <dd>{value.period || '진행 기간'}</dd>
        <dt className="font-semibold">기술 스택</dt>
        <dd className="flex flex-wrap gap-1.5">
          {techStack.length > 0 ? (
            techStack.map((tech, index) => (
              <Badge key={`${tech}-${index}`} variant="secondary">
                {tech}
              </Badge>
            ))
          ) : (
            <span>사용한 기술</span>
          )}
        </dd>
      </dl>

      <section aria-labelledby="project-report-features-heading" className="mt-6 mb-8">
        <h3
          id="project-report-features-heading"
          className="mb-3 text-lg font-bold"
        >
          주요 기능
        </h3>
        {keyFeatures.length > 0 ? (
          <ul className="grid gap-2 pl-5">
            {keyFeatures.map((feature, index) => (
              <li key={`${feature}-${index}`} className="list-disc">
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            주요 기능을 한 줄씩 작성해 주세요.
          </p>
        )}
      </section>

      {reportSections.map((section) => (
        <section
          key={section.key}
          aria-labelledby={`project-report-${section.key}-heading`}
          className="mb-8 break-inside-avoid"
        >
          <h3
            id={`project-report-${section.key}-heading`}
            className="mb-3 border-l-4 border-black pl-3 text-lg font-bold"
          >
            {section.title}
          </h3>
          <p className="whitespace-pre-line break-keep text-muted-foreground">
            {value[section.key] || section.placeholder}
          </p>
        </section>
      ))}

      <section aria-labelledby="project-report-links-heading" className="break-inside-avoid">
        <h3
          id="project-report-links-heading"
          className="mb-3 text-lg font-bold"
        >
          프로젝트 링크
        </h3>
        <dl className="grid grid-cols-[70px_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-semibold">GitHub</dt>
          <dd className="break-all">{value.githubUrl || 'GitHub 링크'}</dd>
          <dt className="font-semibold">Demo</dt>
          <dd className="break-all">{value.demoUrl || '배포 링크'}</dd>
        </dl>
      </section>
    </article>
  );
}
