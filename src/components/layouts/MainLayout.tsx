import type { ReactNode } from "react";
import { Sidebar } from "../organisms/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Sidebar />
            <main className="pb-16 lg:pb-0 lg:pl-16">
                { children }
            </main>
        </>
    );
}
