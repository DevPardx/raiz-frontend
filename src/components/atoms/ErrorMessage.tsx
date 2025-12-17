import type { ReactNode } from "react";

export default function ErrorMessage({ children }: { children: ReactNode }) {
    return (
        <p className="text-sm text-red-500 dark:text-red-400">
            { children }
        </p>
    );
}
