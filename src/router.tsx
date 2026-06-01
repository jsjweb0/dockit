import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "@/layout/DefaultLayout.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import { EditorLayout } from "@/layout/EditorLayout.tsx";
import { ResumeBuilderPage } from "@/pages/ResumeBuilderPage";
import { ErrorFallback } from "@/components/ErrorFallback";

export const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        errorElement: <ErrorFallback />,
        children: [
            { path: "/", element: <HomePage /> },
        ],
    },
    {
        element: <EditorLayout />,
        errorElement: <ErrorFallback />,
        children: [
            { path: "/resume", element: <ResumeBuilderPage /> },
            { path: "/resume/:id", element: <ResumeBuilderPage /> }
        ],
    },

]);
