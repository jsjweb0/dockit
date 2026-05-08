import { createBrowserRouter } from "react-router-dom";
import {DefaultLayout} from "@/layout/DefaultLayout.tsx";
import {HomePage} from "@/pages/HomePage.tsx";
import { EditorLayout } from "@/layout/EditorLayout.tsx";
import { ResumeBuilderPage } from "@/pages/ResumeBuilderPage";

export const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            { path: "/", element: <HomePage /> },
        ],
    },
    {
        element: <EditorLayout />,
        children: [
            // 새 문서
            { path: "/resume", element: <ResumeBuilderPage /> },
            
            // 기존 문서
            { path: "/resume/:id", element: <ResumeBuilderPage /> }
        ],
    },

]);
