import {
  createDocumentStorage,
  type DocumentDraftSummary,
} from '@/features/documents/model/document.storage';
import { defaultCareerSummary } from './careerSummary.defaults';
import type {
  Achievement,
  CareerExperience,
  CareerSummary,
} from './careerSummary.types';

export type CareerSummaryDraftSummary = DocumentDraftSummary;

const CAREER_SUMMARY_DOCUMENT_TITLE = '경력기술서';

function getDraftTitle(careersummary: CareerSummary) {
  const title = careersummary.title.trim();
  return title || CAREER_SUMMARY_DOCUMENT_TITLE;
}

function getDraftDescription(careersummary: CareerSummary) {
  const title = careersummary.title.trim();
  const company = careersummary.experiences.filter((section) =>
    section.company.trim(),
  ).length;

  if (title && company > 0) return `${title} · ${company}`;

  return title || '작성 중인 문서';
}

function normalizeCareerSummary(
  parsed: Partial<CareerSummary>,
  defaults: CareerSummary,
): CareerSummary {
  const normalizeAchievement = (
    achievement: unknown,
    fallbackDescription = '',
  ): Achievement => {
    if (typeof achievement === 'string') {
      return {
        title: achievement,
        description: fallbackDescription,
      };
    }

    if (achievement && typeof achievement === 'object') {
      const item = achievement as Partial<Achievement>;

      return {
        title: typeof item.title === 'string' ? item.title : '',
        description:
          typeof item.description === 'string' ? item.description : '',
      };
    }

    return { title: '', description: fallbackDescription };
  };

  const normalizeExperience = (
    experience: unknown,
    fallback: CareerExperience,
  ): CareerExperience => {
    if (!experience || typeof experience !== 'object') return fallback;

    const item = experience as Partial<CareerExperience> & {
      description?: unknown;
    };
    const fallbackDescription =
      typeof item.description === 'string' ? item.description : '';

    return {
      ...fallback,
      ...item,
      id: typeof item.id === 'string' ? item.id : fallback.id,
      company: typeof item.company === 'string' ? item.company : '',
      team: typeof item.team === 'string' ? item.team : '',
      role: typeof item.role === 'string' ? item.role : '',
      period: typeof item.period === 'string' ? item.period : '',
      responsibilities:
        typeof item.responsibilities === 'string'
          ? item.responsibilities
          : '',
      achievements: Array.isArray(item.achievements)
        ? item.achievements.map((achievement) =>
            normalizeAchievement(achievement),
          )
        : [normalizeAchievement(item.achievements, fallbackDescription)],
    };
  };

  return {
    ...defaults,
    ...parsed,
    meta: { ...defaults.meta, ...parsed.meta },
    title: typeof parsed.title === 'string' ? parsed.title : defaults.title,
    experiences: Array.isArray(parsed.experiences)
      ? parsed.experiences.map((experience, index) =>
          normalizeExperience(
            experience,
            defaults.experiences[index] ?? defaults.experiences[0],
          ),
        )
      : defaults.experiences,
    techStack:
      typeof parsed.techStack === 'string'
        ? parsed.techStack
        : defaults.techStack,
  };
}

const careersummaryStorage = createDocumentStorage<CareerSummary>({
  documentType: 'career-summary',
  storageKeyPrefix: 'career-summary',
  draftsKey: 'career-summary:drafts',
  createDefault: defaultCareerSummary,
  normalize: normalizeCareerSummary,
  getDraftContent: (careersummary) => ({
    title: getDraftTitle(careersummary),
    description: getDraftDescription(careersummary),
  }),
});

export const loadCareerSummary = careersummaryStorage.load;
export const saveCareerSummary = careersummaryStorage.save;
export const deleteCareerSummaryDraft = careersummaryStorage.deleteDraft;
export const listRecentCareerSummaryDrafts =
  careersummaryStorage.listRecentDrafts;
