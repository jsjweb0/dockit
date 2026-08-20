import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "@/layout/DefaultLayout.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import { ErrorFallback } from "@/components/ErrorFallback";
import { CanonicalUrl } from '@/components/CanonicalUrl';
import { Spinner } from './components/ui/spinner';

const ResumeBuilderPage = lazy(() =>
    import('@/pages/ResumeBuilderPage').then((module) => ({
        default: module.ResumeBuilderPage,
    })),
);

const CoverLetterBuilderPage = lazy(() =>
    import('@/pages/CoverLetterBuilderPage').then((module) => ({
        default: module.CoverLetterBuilderPage,
    })),
);

const CareerSummaryBuilderPage = lazy(() =>
    import('@/pages/CareerSummaryBuilderPage').then((module) => ({
        default: module.CareerSummaryBuilderPage,
    })),
);

const ProjectReportBuilderPage = lazy(() =>
    import('@/pages/ProjectReportBuilderPage').then((module) => ({
        default: module.ProjectReportBuilderPage,
    })),
);


function RouteLoadingFallback() {
    return (
        <main className="mx-auto flex max-w-7xl justify-center items-center gap-2 px-4 py-8 text-sm text-muted-foreground">
            <Spinner className="size-4" aria-hidden="true" />
            문서 작성기를 불러오는 중입니다.
        </main>
    );
}

function withSuspense(element: ReactNode) {
    return <Suspense fallback={<RouteLoadingFallback />}>{element}</Suspense>;
}

function withCanonicalUrl(path: string, element: ReactNode) {
    return (
        <>
            <CanonicalUrl path={path} />
            {element}
        </>
    );
}

export const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        errorElement: <ErrorFallback />,
        children: [
            { path: "/", element: withCanonicalUrl('/', <HomePage />) },
        ],
    },
    {
        errorElement: <ErrorFallback />,
        children: [
            {
                path: "/resume",
                element: withCanonicalUrl('/resume', withSuspense(<ResumeBuilderPage />)),
            },
            {
                path: "/resume/:id",
                element: withCanonicalUrl('/resume', withSuspense(<ResumeBuilderPage />)),
            },
            {
                path: "/cover-letter",
                element: withCanonicalUrl('/cover-letter', withSuspense(<CoverLetterBuilderPage />)),
            },
            {
                path: "/cover-letter/:id",
                element: withCanonicalUrl('/cover-letter', withSuspense(<CoverLetterBuilderPage />)),
            },
            {
                path: "/career-summary",
                element: withCanonicalUrl('/career-summary', withSuspense(<CareerSummaryBuilderPage />)),
            },
            {
                path: "/career-summary/:id",
                element: withCanonicalUrl('/career-summary', withSuspense(<CareerSummaryBuilderPage />)),
            },
            {
                path: "/project-report",
                element: withCanonicalUrl('/project-report', withSuspense(<ProjectReportBuilderPage />)),
            },
            {
                path: "/project-report/:id",
                element: withCanonicalUrl('/project-report', withSuspense(<ProjectReportBuilderPage />)),
            },
        ],
    },

]);
