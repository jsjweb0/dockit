import type { ComponentType, ReactNode } from 'react';
import {
  ResumeEditorProvider,
  useResumeEditor,
} from '@/features/resume/context/resumeEditor.context';
import { useResumeValidation } from '@/features/resume/hooks/useResumeValidation';
import type { Resume } from '@/features/resume/model/resume.types';
import {
  deleteResumeDraft,
  listRecentResumeDrafts,
} from '@/features/resume/model/resume.storage';
import {
  CoverLetterEditorProvider,
  useCoverLetterEditor,
} from '@/features/coverLetter/context/coverLetterEditor.context';
import { useCoverLetterValidation } from '@/features/coverLetter/hooks/useCoverLetterValidation';
import type { CoverLetter } from '@/features/coverLetter/model/coverLetter.types';
import {
  deleteCoverLetterDraft,
  listRecentCoverLetterDrafts,
} from '@/features/coverLetter/model/coverLetter.storage';
import { sampleResume } from '@/features/resume/model/resume.sample';
import { sampleCoverLetter } from '@/features/coverLetter/model/coverLetter.sample';
import type { DocumentDraftSummary } from '@/features/documents/model/document.storage';
import {
  CareerSummaryEditorProvider,
  useCareerSummaryEditor,
} from '@/features/careerSummary/context/careerSummaryEditor.context';
import { useCareerSummaryValidation } from '@/features/careerSummary/hooks/useCareerSummaryValidation';
import { sampleCareerSummary } from '@/features/careerSummary/model/careerSummary.sample';
import {
  deleteCareerSummaryDraft,
  listRecentCareerSummaryDrafts,
} from '@/features/careerSummary/model/careerSummary.storage';
import type { CareerSummary } from '@/features/careerSummary/model/careerSummary.types';
import {
  getDocumentTemplate,
  type DocumentTemplate,
} from '@/layout/documentTemplates';

export type DocumentEditorProviderProps = {
  documentId: string;
  children: ReactNode;
};

export type CommonDocumentEditorState<TDocument> = {
  document: TDocument;
  setDocument: (next: TDocument) => void;
  save: (opts?: { silent?: boolean }) => Promise<void>;
  reset: () => void;
  printDocument: () => Promise<void>;
  isDirty: boolean;
  isSaving: boolean;
  isExporting: boolean;
  lastSavedAt: number | null;
  totalValidationErrorCount: number;
};

export type DocumentEditorConfig<TDocument> = {
  template: DocumentTemplate;
  Provider: ComponentType<DocumentEditorProviderProps>;
  useEditor: () => CommonDocumentEditorState<TDocument>;
  getTitle: (document: TDocument) => string;
  getPageTitle: (document: TDocument, template: DocumentTemplate) => string;
  createSample: () => TDocument;
  recent?: {
    listDrafts: (limit?: number) => DocumentDraftSummary[];
    deleteDraft: (id: string) => void;
  };
};

export type AnyDocumentEditorConfig = {
  template: DocumentTemplate;
  Provider: ComponentType<DocumentEditorProviderProps>;
  useEditor: () => CommonDocumentEditorState<unknown>;
  getTitle: (document: unknown) => string;
  getPageTitle: (document: unknown, template: DocumentTemplate) => string;
  createSample: () => unknown;
  recent?: {
    listDrafts: (limit?: number) => DocumentDraftSummary[];
    deleteDraft: (id: string) => void;
  };
};

const createDocumentEditorConfig = <TDocument>(
  config: DocumentEditorConfig<TDocument>,
): AnyDocumentEditorConfig => ({
  template: config.template,
  Provider: config.Provider,
  useEditor: () => {
    const editor = config.useEditor();

    return {
      document: editor.document,
      setDocument: (next) => editor.setDocument(next as TDocument),
      save: editor.save,
      reset: editor.reset,
      printDocument: editor.printDocument,
      isDirty: editor.isDirty,
      isSaving: editor.isSaving,
      isExporting: editor.isExporting,
      lastSavedAt: editor.lastSavedAt,
      totalValidationErrorCount: editor.totalValidationErrorCount,
    };
  },
  getTitle: (document) => config.getTitle(document as TDocument),
  getPageTitle: (document, template) =>
    config.getPageTitle(document as TDocument, template),
  createSample: config.createSample,
  recent: config.recent,
});

const resumeTemplate = getDocumentTemplate('resume');
const coverLetterTemplate = getDocumentTemplate('cover-letter');
const careerSummaryTemplate = getDocumentTemplate('career-summary');

function useResumeEditorAsDocument(): CommonDocumentEditorState<Resume> {
  const editor = useResumeEditor();
  const validation = useResumeValidation();

  return {
    document: editor.resume,
    setDocument: editor.setResume,
    save: editor.save,
    reset: editor.reset,
    printDocument: editor.printResume,
    isDirty: editor.isDirty,
    isSaving: editor.isSaving,
    isExporting: editor.isExporting,
    lastSavedAt: editor.lastSavedAt,
    totalValidationErrorCount: validation.totalValidationErrorCount,
  };
}

function useCoverLetterEditorAsDocument(): CommonDocumentEditorState<CoverLetter> {
  const editor = useCoverLetterEditor();
  const validation = useCoverLetterValidation();

  return {
    document: editor.coverLetter,
    setDocument: editor.setCoverLetter,
    save: editor.save,
    reset: editor.reset,
    printDocument: editor.printCoverLetter,
    isDirty: editor.isDirty,
    isSaving: editor.isSaving,
    isExporting: editor.isExporting,
    lastSavedAt: editor.lastSavedAt,
    totalValidationErrorCount: validation.totalValidationErrorCount,
  };
}

function useCareerSummaryEditorAsDocument(): CommonDocumentEditorState<CareerSummary> {
  const editor = useCareerSummaryEditor();
  const validation = useCareerSummaryValidation();

  return {
    document: editor.careerSummary,
    setDocument: editor.setCareerSummary,
    save: editor.save,
    reset: editor.reset,
    printDocument: editor.printCareerSummary,
    isDirty: editor.isDirty,
    isSaving: editor.isSaving,
    isExporting: editor.isExporting,
    lastSavedAt: editor.lastSavedAt,
    totalValidationErrorCount: validation.totalValidationErrorCount,
  };
}

const resumeEditorConfig = createDocumentEditorConfig<Resume>({
  template: resumeTemplate,
  Provider: ResumeEditorProvider,
  useEditor: useResumeEditorAsDocument,
  getTitle: (resume) => resume.basics?.name?.trim() ?? '',
  getPageTitle: (resume, template) => {
    const name = resume.basics?.name?.trim();
    return name ? `${name} 이력서` : `새 ${template.title}`;
  },
  createSample: sampleResume,
  recent: {
    listDrafts: listRecentResumeDrafts,
    deleteDraft: deleteResumeDraft,
  },
});

const coverLetterEditorConfig = createDocumentEditorConfig<CoverLetter>({
  template: coverLetterTemplate,
  Provider: CoverLetterEditorProvider,
  useEditor: useCoverLetterEditorAsDocument,
  getTitle: (coverLetter) => coverLetter.title.trim(),
  getPageTitle: (coverLetter, template) => {
    const title = coverLetter.title.trim();
    return title || `새 ${template.title}`;
  },
  createSample: sampleCoverLetter,
  recent: {
    listDrafts: listRecentCoverLetterDrafts,
    deleteDraft: deleteCoverLetterDraft,
  },
});

const careerSummaryEditorConfig = createDocumentEditorConfig<CareerSummary>({
  template: careerSummaryTemplate,
  Provider: CareerSummaryEditorProvider,
  useEditor: useCareerSummaryEditorAsDocument,
  getTitle: (careerSummary) => careerSummary.title.trim(),
  getPageTitle: (careerSummary, template) => {
    const title = careerSummary.title.trim();
    return title || `새 ${template.title}`;
  },
  createSample: sampleCareerSummary,
  recent: {
    listDrafts: listRecentCareerSummaryDrafts,
    deleteDraft: deleteCareerSummaryDraft,
  },
});

export const editorConfigs = [
  resumeEditorConfig,
  coverLetterEditorConfig,
  careerSummaryEditorConfig,
];

export const getEditorConfigByPathname = (pathname: string) => {
  const config = editorConfigs.find(({ template }) => {
    if (!template.href) return false;
    return (
      pathname === template.href || pathname.startsWith(`${template.href}/`)
    );
  });

  if (!config) throw new Error(`Unknown editor route: ${pathname}`);
  return config;
};
