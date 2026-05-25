import type {
  Certification,
  Education,
  Experience,
  Project,
  LinkItem,
  Resume,
} from './resume.types';

export type ResumeListSection =
  | 'education'
  | 'certifications'
  | 'experience'
  | 'projects'
  | 'links';

export type SectionFieldErrors = Record<string, string>;

export type SectionItemErrors = Record<string, SectionFieldErrors>;

export type ResumeSectionErrors = Record<ResumeListSection, SectionItemErrors>;

export const emptyResumeSectionErrors = (): ResumeSectionErrors => ({
  education: {},
  certifications: {},
  experience: {},
  projects: {},
  links: {},
});

export const SECTION_VALIDATED_FIELDS: Record<ResumeListSection, string[]> = {
  education: ['institution', 'period', 'major'],
  certifications: ['name', 'acquiredAt', 'issuer'],
  experience: ['company', 'start', 'end', 'role', 'description'],
  projects: ['name', 'period', 'stack', 'link', 'description'],
  links: ['label', 'url'],
};

function hasEducationInput(item: Education): boolean {
  return Boolean(
    item.institution.trim() || item.period.trim() || item.major.trim(),
  );
}

function hasCertificationInput(item: Certification): boolean {
  return Boolean(
    item.name.trim() || item.acquiredAt.trim() || item.issuer.trim(),
  );
}

function hasExperienceInput(item: Experience): boolean {
  return Boolean(
    item.company.trim() ||
    item.role.trim() ||
    item.start.trim() ||
    item.end?.trim() ||
    item.description.trim() ||
    item.isCurrent,
  );
}

function hasProjectInput(item: Project): boolean {
  return Boolean(
    item.name.trim() ||
    item.period.trim() ||
    item.stack.trim() ||
    item.description.trim() ||
    item.link?.trim(),
  );
}

function hasLinkInput(item: LinkItem): boolean {
  return Boolean(item.label.trim() || item.url.trim());
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function validateEducationItem(item: Education): SectionFieldErrors {
  const errors: SectionFieldErrors = {};
  if (!hasEducationInput(item)) return errors;

  if (!item.institution.trim()) errors.institution = '학교를 입력해 주세요.';
  if (!item.period.trim()) errors.period = '기간을 입력해 주세요.';
  if (!item.major.trim()) errors.major = '학과(전공)를 입력해 주세요.';

  return errors;
}

export function validateCertificationItem(
  item: Certification,
): SectionFieldErrors {
  const errors: SectionFieldErrors = {};
  if (!hasCertificationInput(item)) return errors;

  if (!item.name.trim()) errors.name = '자격증명을 입력해 주세요.';
  if (!item.acquiredAt.trim()) errors.acquiredAt = '취득일을 입력해 주세요.';
  if (!item.issuer.trim()) errors.issuer = '발행처를 입력해 주세요.';

  return errors;
}

export function validateExperienceItem(item: Experience): SectionFieldErrors {
  const errors: SectionFieldErrors = {};
  if (!hasExperienceInput(item)) return errors;

  if (!item.company.trim()) errors.company = '회사명을 입력해 주세요.';
  if (!item.start.trim()) errors.start = '시작일을 입력해 주세요.';
  if (!item.isCurrent && !item.end?.trim())
    errors.end = '종료일을 입력해 주세요.';
  if (item.start && item.end && !item.isCurrent && item.end < item.start) {
    errors.end = '종료일은 시작일보다 늦어야 합니다.';
  }
  if (!item.role.trim()) errors.role = '직무/직책을 입력해 주세요.';
  if (!item.description.trim()) {
    errors.description = '업무/성과를 입력해 주세요.';
  }

  return errors;
}

export function validateProjectItem(item: Project): SectionFieldErrors {
  const errors: SectionFieldErrors = {};
  if (!hasProjectInput(item)) return errors;

  if (!item.name.trim()) errors.name = '프로젝트명을 입력해 주세요.';
  if (!item.period.trim()) errors.period = '기간을 입력해 주세요.';
  if (!item.stack.trim()) errors.stack = '기술 스택을 입력해 주세요.';
  if (item.link?.trim() && !isValidUrl(item.link)) {
    errors.link = '올바른 URL 형식이 아닙니다.';
  }
  if (!item.description.trim()) errors.description = '설명을 입력해 주세요.';

  return errors;
}

export function validateLinkItem(item: LinkItem): SectionFieldErrors {
  const errors: SectionFieldErrors = {};

  if (!hasLinkInput(item)) return errors;

  if (!item.label.trim()) {
    errors.label = '링크 이름을 입력해 주세요.';
  }

  if (!item.url.trim()) {
    errors.url = 'URL을 입력해 주세요.';
  } else if (!isValidUrl(item.url)) {
    errors.url = '올바른 URL 형식이 아닙니다.';
  }

  return errors;
}

export function validateSectionItem(
  section: ResumeListSection,
  resume: Resume,
  id: string,
): SectionFieldErrors {
  switch (section) {
    case 'education': {
      const item = resume.education.find((entry) => entry.id === id);
      return item ? validateEducationItem(item) : {};
    }
    case 'certifications': {
      const item = resume.certifications.find((entry) => entry.id === id);
      return item ? validateCertificationItem(item) : {};
    }
    case 'experience': {
      const item = resume.experience.find((entry) => entry.id === id);
      return item ? validateExperienceItem(item) : {};
    }
    case 'projects': {
      const item = resume.projects.find((entry) => entry.id === id);
      return item ? validateProjectItem(item) : {};
    }
    case 'links': {
      const item = resume.links.find((entry) => entry.id === id);
      return item ? validateLinkItem(item) : {};
    }
  }
}

export function validateOptionalSections(resume: Resume): {
  isValid: boolean;
  errors: ResumeSectionErrors;
} {
  const errors = emptyResumeSectionErrors();

  for (const item of resume.education) {
    const itemErrors = validateEducationItem(item);
    if (Object.keys(itemErrors).length > 0)
      errors.education[item.id] = itemErrors;
  }

  for (const item of resume.certifications) {
    const itemErrors = validateCertificationItem(item);
    if (Object.keys(itemErrors).length > 0) {
      errors.certifications[item.id] = itemErrors;
    }
  }

  for (const item of resume.experience) {
    const itemErrors = validateExperienceItem(item);
    if (Object.keys(itemErrors).length > 0)
      errors.experience[item.id] = itemErrors;
  }

  for (const item of resume.projects) {
    const itemErrors = validateProjectItem(item);
    if (Object.keys(itemErrors).length > 0)
      errors.projects[item.id] = itemErrors;
  }

  for (const item of resume.links) {
    const itemErrors = validateLinkItem(item);
    if (Object.keys(itemErrors).length > 0)
      errors.links[item.id] = itemErrors;
  }

  return {
    isValid: Object.values(errors).every(
      (sectionErrors) => Object.keys(sectionErrors).length === 0,
    ),
    errors,
  };
}
