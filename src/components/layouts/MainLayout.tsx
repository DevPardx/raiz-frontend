import type { ReactNode } from "react";
import { Sidebar } from "../organisms/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Sidebar />
            <main>
                { children }
            </main>
        </>
    );
}
