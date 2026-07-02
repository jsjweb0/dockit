import type { Resume } from './resume.types';
import {
  BASICS_VALIDATED_FIELDS,
  validateBasics,
  validateBasicsField,
  type BasicsFieldErrors,
  type BasicsValidatedField,
} from './resume.basics.validation';
import {
  emptyResumeSectionErrors,
  SECTION_VALIDATED_FIELDS,
  validateOptionalSections,
  validateSectionItem,
  type ResumeListSection,
  type ResumeSectionErrors,
} from './resume.optionalSections.validation';
import type { DocumentValidationAdapter } from '@/features/documents/model/document.validation';

export type SectionFieldKey = `${ResumeListSection}:${string}:${string}`;
export type ResumeValidationFieldKey =
  | `basics:${BasicsValidatedField}`
  | `section:${ResumeListSection}:${string}:${string}`;

export type ValidationErrorCounts = {
  basics: number;
  edu: number;
  cer: number;
  exp: number;
  proj: number;
  link: number;
  skills: number;
};

export type ResumeValidationTab =
  | 'basics'
  | 'edu'
  | 'cer'
  | 'exp'
  | 'proj'
  | 'link'
  | 'skills';

export type ValidationErrorTarget = {
  tab: ResumeValidationTab;
  fieldId: string;
};

export type ResumeValidationState = {
  basicsErrors: BasicsFieldErrors;
  sectionErrors: ResumeSectionErrors;
};

export type ResumeExportValidationResult = ResumeValidationState & {
  isValid: boolean;
  firstMessage: string;
};

export const getBasicsFieldKey = (
  field: BasicsValidatedField,
): ResumeValidationFieldKey => `basics:${field}`;

export const getSectionFieldKey = (
  section: ResumeListSection,
  id: string,
  field: string,
): ResumeValidationFieldKey => `section:${section}:${id}:${field}`;

const parseResumeFieldKey = (fieldKey: ResumeValidationFieldKey) => {
  const [type, sectionOrField, id, field] = fieldKey.split(':');

  if (type === 'basics') {
    return {
      type,
      field: sectionOrField as BasicsValidatedField,
    } as const;
  }

  return {
    type: 'section',
    section: sectionOrField as ResumeListSection,
    id,
    field,
  } as const;
};

const countSectionErrors = (errors: Record<string, Record<string, string>>) =>
  Object.values(errors).reduce(
    (total, item) => total + Object.keys(item).length,
    0,
  );

const BASICS_FIELD_IDS: Record<BasicsValidatedField, string> = {
  workerTitle: 'workerTitle',
  name: 'userName',
  phone: 'phone',
  email: 'email',
};

const SECTION_TABS: Record<ResumeListSection, ResumeValidationTab> = {
  education: 'edu',
  certifications: 'cer',
  experience: 'exp',
  projects: 'proj',
  links: 'link',
};

const TAB_SECTIONS: Partial<Record<ResumeValidationTab, ResumeListSection>> = {
  edu: 'education',
  cer: 'certifications',
  exp: 'experience',
  proj: 'projects',
  link: 'links',
};

const SECTION_ITEMS = {
  education: (resume: Resume) => resume.education,
  certifications: (resume: Resume) => resume.certifications,
  experience: (resume: Resume) => resume.experience,
  projects: (resume: Resume) => resume.projects,
  links: (resume: Resume) => resume.links,
};

const getSectionInputId = (
  section: ResumeListSection,
  id: string,
  field: string,
) => {
  if (section === 'certifications' && field === 'name') {
    return `certification-name-${id}`;
  }

  return `${field}-${id}`;
};

export function getResumeValidationErrorCounts({
  basicsErrors,
  sectionErrors,
}: ResumeValidationState): ValidationErrorCounts {
  return {
    basics: Object.keys(basicsErrors).length,
    edu: countSectionErrors(sectionErrors.education),
    cer: countSectionErrors(sectionErrors.certifications),
    exp: countSectionErrors(sectionErrors.experience),
    proj: countSectionErrors(sectionErrors.projects),
    link: countSectionErrors(sectionErrors.links),
    skills: 0,
  };
}

export function getTotalResumeValidationErrorCount(
  counts: ValidationErrorCounts,
) {
  return Object.values(counts).reduce((total, count) => total + count, 0);
}

export function getAllTouchedResumeSectionFields(resume: Resume) {
  return new Set(
    (
      Object.entries(SECTION_VALIDATED_FIELDS) as [
        ResumeListSection,
        string[],
      ][]
    ).flatMap(([section, fields]) =>
      resume[section].flatMap((item) =>
        fields.map((field) => getSectionFieldKey(section, item.id, field)),
      ),
    ),
  );
}

export function getAllTouchedResumeFields(resume: Resume) {
  return new Set<ResumeValidationFieldKey>([
    ...BASICS_VALIDATED_FIELDS.map(getBasicsFieldKey),
    ...getAllTouchedResumeSectionFields(resume),
  ]);
}

export function getFirstResumeValidationErrorTarget({
  tab,
  resume,
  basicsErrors,
  sectionErrors,
}: ResumeValidationState & {
  tab?: ResumeValidationTab;
  resume: Resume;
}): ValidationErrorTarget | null {
  if (!tab || tab === 'basics') {
    const basicsField = BASICS_VALIDATED_FIELDS.find(
      (field) => basicsErrors[field],
    );

    if (basicsField) {
      return {
        tab: 'basics',
        fieldId: BASICS_FIELD_IDS[basicsField],
      };
    }

    if (tab === 'basics') return null;
  }

  const sections = tab
    ? TAB_SECTIONS[tab]
      ? [TAB_SECTIONS[tab]]
      : []
    : (Object.keys(SECTION_TABS) as ResumeListSection[]);

  for (const section of sections) {
    const currentSectionErrors = sectionErrors[section];
    const fields = SECTION_VALIDATED_FIELDS[section];

    for (const item of SECTION_ITEMS[section](resume)) {
      const erroredField = fields.find(
        (field) => currentSectionErrors[item.id]?.[field],
      );

      if (erroredField) {
        return {
          tab: SECTION_TABS[section],
          fieldId: getSectionInputId(section, item.id, erroredField),
        };
      }
    }
  }

  return null;
}

export function validateResumeForExport(
  resume: Resume,
): ResumeExportValidationResult {
  const basicsValidation = validateBasics(resume.basics);
  const sectionValidation = validateOptionalSections(resume);
  const firstMessage =
    BASICS_VALIDATED_FIELDS.map(
      (field) => basicsValidation.errors[field],
    ).find(Boolean) ??
    Object.values(sectionValidation.errors)
      .flatMap((itemErrors) =>
        Object.values(itemErrors).flatMap((errors) => Object.values(errors)),
      )
      .find(Boolean) ??
    '입력 정보를 확인해 주세요.';

  return {
    isValid: basicsValidation.isValid && sectionValidation.isValid,
    basicsErrors: basicsValidation.errors,
    sectionErrors: sectionValidation.errors,
    firstMessage,
  };
}

export const resumeValidationAdapter: DocumentValidationAdapter<
  Resume,
  ResumeValidationState,
  ResumeValidationFieldKey
> = {
  createEmptyErrors: () => ({
    basicsErrors: {},
    sectionErrors: emptyResumeSectionErrors(),
  }),
  createEmptyTouchedFields: () => new Set<ResumeValidationFieldKey>(),
  validateField: (resume, fieldKey) => {
    const key = parseResumeFieldKey(fieldKey);

    if (key.type === 'basics') {
      return validateBasicsField(key.field, resume.basics);
    }

    return validateSectionItem(key.section, resume, key.id)[key.field];
  },
  setFieldError: (errors, fieldKey, message) => {
    const key = parseResumeFieldKey(fieldKey);

    if (key.type === 'basics') {
      const basicsErrors = { ...errors.basicsErrors };

      if (message) {
        basicsErrors[key.field] = message;
      } else {
        delete basicsErrors[key.field];
      }

      return {
        ...errors,
        basicsErrors,
      };
    }

    const sectionItemErrors = { ...errors.sectionErrors[key.section] };
    const itemErrors = { ...(sectionItemErrors[key.id] ?? {}) };

    if (message) {
      itemErrors[key.field] = message;
    } else {
      delete itemErrors[key.field];
    }

    if (Object.keys(itemErrors).length > 0) {
      sectionItemErrors[key.id] = itemErrors;
    } else {
      delete sectionItemErrors[key.id];
    }

    return {
      ...errors,
      sectionErrors: {
        ...errors.sectionErrors,
        [key.section]: sectionItemErrors,
      },
    };
  },
  validateAll: (resume) => {
    const result = validateResumeForExport(resume);

    return {
      isValid: result.isValid,
      errors: {
        basicsErrors: result.basicsErrors,
        sectionErrors: result.sectionErrors,
      },
      firstMessage: result.firstMessage,
    };
  },
  getAllTouchedFields: getAllTouchedResumeFields,
  getErrorCount: (errors) =>
    getTotalResumeValidationErrorCount(
      getResumeValidationErrorCounts(errors),
    ),
};
