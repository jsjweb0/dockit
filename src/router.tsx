import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "@/layout/DefaultLayout.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Spinner } from './components/ui/spinner';

const EditorLayout = lazy(() =>
    import('@/layout/EditorLayout').then((module) => ({
        default: module.EditorLayout,
    })),
);

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
        element: withSuspense(<EditorLayout />),
        errorElement: <ErrorFallback />,
        children: [
            { path: "/resume", element: withSuspense(<ResumeBuilderPage />) },
            { path: "/resume/:id", element: withSuspense(<ResumeBuilderPage />) },
        ],
    },
    {
        element: withSuspense(<EditorLayout />),
        errorElement: <ErrorFallback />,
        children: [
            { path: "/cover-letter", element: withSuspense(<CoverLetterBuilderPage />) },
            { path: "/cover-letter/:id", element: withSuspense(<CoverLetterBuilderPage />) }
        ],
    },
    {
        element: withSuspense(<EditorLayout />),
        errorElement: <ErrorFallback />,
        children: [
            { path: "/career-summary", element: withSuspense(<CareerSummaryBuilderPage />) },
            { path: "/career-summary/:id", element: withSuspense(<CareerSummaryBuilderPage />) }
        ],
    },

]);
