import type { ProjectReport } from './projectReport.types';

export function defaultProjectReport(): ProjectReport {
  return {
    meta: { version: 1 },
    title: '',
    summary: '',
    role: '',
    period: '',
    techStack: '',
    keyFeatures: '',
    problem: '',
    solution: '',
    outcome: '',
    responsiveAccessibility: '',
    githubUrl: '',
    demoUrl: '',
  };
}
