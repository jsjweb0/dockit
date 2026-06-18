import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Resume } from '../model/resume.types';
import { defaultResume } from '../model/resume.defaults';
import { loadResume, saveResume } from '../model/resume.storage';
import { toast } from 'sonner';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';
import {
  BASICS_VALIDATED_FIELDS,
  validateBasics,
  validateBasicsField,
  type BasicsFieldErrors,
  type BasicsValidatedField,
} from '../model/resume.basics.validation';
import {
  emptyResumeSectionErrors,
  SECTION_VALIDATED_FIELDS,
  validateOptionalSections,
  validateSectionItem,
  type ResumeListSection,
  type ResumeSectionErrors,
} from '../model/resume.optionalSections.validation';

type SectionFieldKey = `${ResumeListSection}:${string}:${string}`;

type ValidationErrorCounts = {
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

type ResumeEditorState = {
  resumeId: string;
  document: Resume;
  resume: Resume;
  setDocument: (next: Resume) => void;
  setResume: (next: Resume) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printDocument: () => Promise<void>;
  printResume: () => Promise<void>;
  previewRef: React.RefObject<HTMLElement | null>;
  basicsErrors: BasicsFieldErrors;
  sectionErrors: ResumeSectionErrors;
  resetVersion: number;
  validationErrorCounts: ValidationErrorCounts;
  totalValidationErrorCount: number;
  getFirstValidationErrorTarget: (
    tab?: ResumeValidationTab,
  ) => ValidationErrorTarget | null;
  touchBasicsField: (
    field: BasicsValidatedField,
    basics?: Resume['basics'],
  ) => void;
  revalidateBasicsField: (
    field: BasicsValidatedField,
    basics?: Resume['basics'],
  ) => void;
  touchSectionField: (
    section: ResumeListSection,
    id: string,
    field: string,
    nextResume?: Resume,
  ) => void;
  revalidateSectionField: (
    section: ResumeListSection,
    id: string,
    field: string,
    nextResume?: Resume,
  ) => void;
  isDirty: boolean;
  isExporting: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
};

const ResumeEditorContext = createContext<ResumeEditorState | null>(null);

const emptyTouchedBasicsFields = () => new Set<BasicsValidatedField>();
const emptyTouchedSectionFields = () => new Set<SectionFieldKey>();

const getSectionFieldKey = (
  section: ResumeListSection,
  id: string,
  field: string,
): SectionFieldKey => `${section}:${id}:${field}`;

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

export function ResumeEditorProvider({
  documentId,
  children,
}: {
  documentId: string;
  children: React.ReactNode;
}) {
  const resumeId = documentId;
  const [basicsErrors, setBasicsErrors] = useState<BasicsFieldErrors>({});
  const [sectionErrors, setSectionErrors] = useState<ResumeSectionErrors>(
    emptyResumeSectionErrors,
  );
  const [touchedBasicsFields, setTouchedBasicsFields] = useState(
    emptyTouchedBasicsFields,
  );
  const [touchedSectionFields, setTouchedSectionFields] = useState(
    emptyTouchedSectionFields,
  );

  const clearBasicsValidation = useCallback(() => {
    setBasicsErrors({});
    setTouchedBasicsFields(emptyTouchedBasicsFields());
  }, []);

  const clearSectionValidation = useCallback(() => {
    setSectionErrors(emptyResumeSectionErrors());
    setTouchedSectionFields(emptyTouchedSectionFields());
  }, []);

  const handleEditorReset = useCallback(() => {
    clearBasicsValidation();
    clearSectionValidation();
  }, [clearBasicsValidation, clearSectionValidation]);

  const getResumePrintFileName = useCallback((resume: Resume) => {
    const name = resume.basics.name.trim() || 'resume';
    return `${name}-${resume.basics.title}.pdf`;
  }, []);

  const {
    document: resume,
    setDocument: setResumeSafe,
    save: persist,
    reset,
    printDocument: printDocumentCore,
    previewRef,
    resetVersion,
    isDirty,
    isExporting,
    isSaving,
    lastSavedAt,
  } = useDocumentEditorCore({
    documentId: resumeId,
    loadDocument: loadResume,
    saveDocument: saveResume,
    createDefaultDocument: defaultResume,
    getPrintFileName: getResumePrintFileName,
    onDocumentLoaded: handleEditorReset,
    onReset: handleEditorReset,
  });

  const touchBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      setTouchedBasicsFields((prev) => new Set(prev).add(field));
      const message = validateBasicsField(field, basics);
      setBasicsErrors((prev) => {
        if (!message) {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        }
        return { ...prev, [field]: message };
      });
    },
    [resume.basics],
  );

  const revalidateBasicsField = useCallback(
    (field: BasicsValidatedField, basics = resume.basics) => {
      if (!touchedBasicsFields.has(field)) return;

      const message = validateBasicsField(field, basics);
      setBasicsErrors((prev) => {
        if (!message) {
          const nextErrors = { ...prev };
          delete nextErrors[field];
          return nextErrors;
        }
        return { ...prev, [field]: message };
      });
    },
    [resume.basics, touchedBasicsFields],
  );

  const validateAllBasics = useCallback(() => {
    const result = validateBasics(resume.basics);
    setBasicsErrors(result.errors);
    setTouchedBasicsFields(new Set(BASICS_VALIDATED_FIELDS));
    return result;
  }, [resume.basics]);

  const setSectionFieldError = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      message?: string,
    ) => {
      setSectionErrors((prev) => {
        const sectionItemErrors = { ...prev[section] };
        const itemErrors = { ...(sectionItemErrors[id] ?? {}) };

        if (message) {
          itemErrors[field] = message;
        } else {
          delete itemErrors[field];
        }

        if (Object.keys(itemErrors).length > 0) {
          sectionItemErrors[id] = itemErrors;
        } else {
          delete sectionItemErrors[id];
        }

        return { ...prev, [section]: sectionItemErrors };
      });
    },
    [],
  );

  const touchSectionField = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      nextResume = resume,
    ) => {
      setTouchedSectionFields((prev) =>
        new Set(prev).add(getSectionFieldKey(section, id, field)),
      );

      const message = validateSectionItem(section, nextResume, id)[field];
      setSectionFieldError(section, id, field, message);
    },
    [resume, setSectionFieldError],
  );

  const revalidateSectionField = useCallback(
    (
      section: ResumeListSection,
      id: string,
      field: string,
      nextResume = resume,
    ) => {
      if (!touchedSectionFields.has(getSectionFieldKey(section, id, field))) {
        return;
      }

      const message = validateSectionItem(section, nextResume, id)[field];
      setSectionFieldError(section, id, field, message);
    },
    [resume, setSectionFieldError, touchedSectionFields],
  );

  const validateAllOptionalSections = useCallback(() => {
    const result = validateOptionalSections(resume);
    setSectionErrors(result.errors);
    setTouchedSectionFields(
      new Set(
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
      ),
    );
    return result;
  }, [resume]);

  const validateResumeBeforeExport = useCallback(() => {
    const basicsValidation = validateAllBasics();
    const sectionValidation = validateAllOptionalSections();

    if (basicsValidation.isValid && sectionValidation.isValid) {
      return true;
    }

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

    toast.error(firstMessage);
    return false;
  }, [validateAllBasics, validateAllOptionalSections]);

  const printResume = useCallback(
    () => printDocumentCore(validateResumeBeforeExport),
    [printDocumentCore, validateResumeBeforeExport],
  );

  const validationErrorCounts = useMemo(
    () => ({
      basics: Object.keys(basicsErrors).length,
      edu: countSectionErrors(sectionErrors.education),
      cer: countSectionErrors(sectionErrors.certifications),
      exp: countSectionErrors(sectionErrors.experience),
      proj: countSectionErrors(sectionErrors.projects),
      link: countSectionErrors(sectionErrors.links),
      skills: 0,
    }),
    [basicsErrors, sectionErrors],
  );

  const totalValidationErrorCount = useMemo(
    () =>
      Object.values(validationErrorCounts).reduce(
        (total, count) => total + count,
        0,
      ),
    [validationErrorCounts],
  );

  const getFirstValidationErrorTarget = useCallback(
    (tab?: ResumeValidationTab): ValidationErrorTarget | null => {
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
    },
    [basicsErrors, resume, sectionErrors],
  );

  const value = useMemo(
    () => ({
      resumeId,
      document: resume,
      resume,
      setDocument: setResumeSafe,
      setResume: setResumeSafe,
      save: persist,
      reset,
      printDocument: printResume,
      printResume,
      previewRef,
      basicsErrors,
      sectionErrors,
      resetVersion,
      validationErrorCounts,
      totalValidationErrorCount,
      getFirstValidationErrorTarget,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionField,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    }),
    [
      resume,
      resumeId,
      setResumeSafe,
      persist,
      reset,
      printResume,
      previewRef,
      basicsErrors,
      sectionErrors,
      resetVersion,
      validationErrorCounts,
      totalValidationErrorCount,
      getFirstValidationErrorTarget,
      touchBasicsField,
      revalidateBasicsField,
      touchSectionField,
      revalidateSectionField,
      isDirty,
      isExporting,
      isSaving,
      lastSavedAt,
    ],
  );

  return (
    <ResumeEditorContext.Provider value={value}>
      {children}
    </ResumeEditorContext.Provider>
  );
}

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx)
    throw new Error('useResumeEditor must be used within ResumeEditorProvider');
  return ctx;
}
