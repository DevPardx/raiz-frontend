import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full flex flex-col items-center justify-center px-4">
            <img src="/svg/logo-dark.svg" alt="Raiz Logo" className="size-32 pointer-events-none dark:hidden"/>
            <img src="/svg/logo-light.svg" alt="Raiz Logo" className="size-32 pointer-events-none hidden dark:block"/>
            { children }
        </div>
    );
}
