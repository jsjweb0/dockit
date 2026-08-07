import {
  createDocumentStorage,
  type DocumentDraftSummary,
} from '@/features/documents/model/document.storage';
import { defaultProjectReport } from './projectReport.defaults';
import type { ProjectReport } from './projectReport.types';

export type ProjectReportDraftSummary = DocumentDraftSummary;

const PROJECT_REPORT_DOCUMENT_TITLE = '프로젝트 보고서';

function getDraftTitle(projectReport: ProjectReport) {
  const title = projectReport.title.trim();
  return title || PROJECT_REPORT_DOCUMENT_TITLE;
}

function getDraftDescription(projectReport: ProjectReport) {
  const title = projectReport.title.trim();

  const completedCount = [
    projectReport.title,
    projectReport.summary,
    projectReport.role,
    projectReport.period,
    projectReport.techStack,
    projectReport.keyFeatures,
    projectReport.problem,
    projectReport.solution,
    projectReport.outcome,
    projectReport.responsiveAccessibility,
    projectReport.githubUrl,
    projectReport.demoUrl,
  ].filter((content) => content.trim()).length;

  if (title && completedCount > 0) {
    return `${title} · ${completedCount}개 항목 작성 중`;
  }

  if (title) return title;
  if (completedCount > 0) return `${completedCount}개 항목 작성 중`;

  return '작성 중인 문서';
}

function normalizeProjectReport(
  parsed: Partial<ProjectReport>,
  defaults: ProjectReport,
): ProjectReport {
  return {
    ...defaults,
    ...parsed,
    meta: { ...defaults.meta, ...parsed.meta },
    title: typeof parsed.title === 'string' ? parsed.title : defaults.title,
  };
}

const projectReportStorage = createDocumentStorage<ProjectReport>({
  documentType: 'project-report',
  storageKeyPrefix: 'project-report',
  draftsKey: 'project-report:drafts',
  createDefault: defaultProjectReport,
  normalize: normalizeProjectReport,
  getDraftContent: (coverLetter) => ({
    title: getDraftTitle(coverLetter),
    description: getDraftDescription(coverLetter),
  }),
});

export const loadProjectReport = projectReportStorage.load;
export const saveProjectReport = projectReportStorage.save;
export const deleteProjectReport = projectReportStorage.deleteDraft;
export const listRecentProjectReportDrafts =
  projectReportStorage.listRecentDrafts;
