import { Outlet } from "react-router-dom";
import { DefaultHeader } from "@/components/layout/DefaultHeader";

export function DefaultLayout() {
    return (
        <>
            <DefaultHeader />
            <Outlet />
        </>
    );
}
