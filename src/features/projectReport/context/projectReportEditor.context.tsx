import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { ProjectReport } from '../model/projectReport.types';
import { defaultProjectReport } from '../model/projectReport.defaults';
import { loadProjectReport, saveProjectReport } from '../model/projectReport.storage';
import { useDocumentEditorCore } from '@/features/documents/hooks/useDocumentEditorCore';


type ProjectReportEditorState = {
    projectReportId: string;
    projectReport: ProjectReport;
    setProjectReport: (next: ProjectReport) => void;
    save: (opts?: { silent?: boolean }) => Promise<void>;
    reset: () => void;
    printProjectReport: () => Promise<void>;
    resetVersion: number;
    isDirty: boolean;
    isExporting: boolean;
    isSaving: boolean;
    lastSavedAt: number | null;
};

const ProjectReportEditorContext = createContext<ProjectReportEditorState | null>(null);

export function ProjectReportEditorProvider({
    documentId,
    children,
}: {
    documentId: string;
    children: React.ReactNode;
}) {
    const projectReportId = documentId;
    const getProjectReportPrintFileName = useCallback((projectReport: ProjectReport) => {
        const title = projectReport.title.trim() || 'project-report';
        return `${title}.pdf`;
    }, []);

    const {
        document: projectReport,
        setDocument: setProjectReport,
        save,
        reset,
        printDocument,
        resetVersion,
        isDirty,
        isExporting,
        isSaving,
        lastSavedAt,
    } = useDocumentEditorCore({
        documentId: projectReportId,
        loadDocument: loadProjectReport,
        saveDocument: saveProjectReport,
        createDefaultDocument: defaultProjectReport,
        getPrintFileName: getProjectReportPrintFileName,
    });

    const resetProjectReport = useCallback(() => {
        reset();
    }, [reset]);

    const saveProjectReportWithValidation = useCallback(
        async (opts?: { silent?: boolean }) => {

            await save(opts);
        },
        [save],
    );

    const printProjectReport = useCallback(
        () => printDocument(),
        [printDocument],
    );

    const value = useMemo(
        () => ({
            projectReportId,
            projectReport,
            setProjectReport,
            save: saveProjectReportWithValidation,
            reset: resetProjectReport,
            printProjectReport,
            resetVersion,
            isDirty,
            isExporting,
            isSaving,
            lastSavedAt,
        }),
        [
            projectReport,
            projectReportId,
            setProjectReport,
            saveProjectReportWithValidation,
            resetProjectReport,
            printProjectReport,
            resetVersion,
            isDirty,
            isExporting,
            isSaving,
            lastSavedAt,
        ],
    );

    return (
        <ProjectReportEditorContext.Provider value={value}>
            {children}
        </ProjectReportEditorContext.Provider>
    );
}

export function useProjectReportEditor() {
    const ctx = useContext(ProjectReportEditorContext);
    if (!ctx) {
        throw new Error(
            'useProjectReportEditor must be used within ProjectReportEditorProvider',
        );
    }
    return ctx;
}
