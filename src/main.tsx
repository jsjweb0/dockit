import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "@/router";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from '@/components/ui/sonner';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <RouterProvider router={router} />
            <Toaster />
        </ErrorBoundary>
    </React.StrictMode>
);
