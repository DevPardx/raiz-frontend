import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full flex flex-col items-center justify-center px-4">
            <picture>
                <source srcSet="/svg/logo-light.svg" media="(prefers-color-scheme: dark)" className="size-32 pointer-events-none"/>
                <img src="/svg/logo-dark.svg" alt="Raiz Logo" className="size-32 pointer-events-none"/>
            </picture>
            { children }
        </div>
    )
}
