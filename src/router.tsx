import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "@/layout/DefaultLayout.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import { ErrorFallback } from "@/components/ErrorFallback";
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

export const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        errorElement: <ErrorFallback />,
        children: [{ path: "/", element: <HomePage /> },
        ],
    },
    {
        errorElement: <ErrorFallback />,
        children: [
            { path: "/resume", element: withSuspense(<ResumeBuilderPage />) },
            { path: "/resume/:id", element: withSuspense(<ResumeBuilderPage />) },
            { path: "/cover-letter", element: withSuspense(<CoverLetterBuilderPage />) },
            { path: "/cover-letter/:id", element: withSuspense(<CoverLetterBuilderPage />) },
            { path: "/career-summary", element: withSuspense(<CareerSummaryBuilderPage />) },
            { path: "/career-summary/:id", element: withSuspense(<CareerSummaryBuilderPage />) },
            { path: "/project-report", element: withSuspense(<ProjectReportBuilderPage />) },
            { path: "/project-report/:id", element: withSuspense(<ProjectReportBuilderPage />) },
        ],
    },

]);
