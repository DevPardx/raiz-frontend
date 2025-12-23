import { useState } from "react";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains("dark");
    });

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="size-5 shrink-0 flex items-center justify-center transition-transform hover:scale-110"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <SunIcon className="size-5" weight="regular" />
            ) : (
                <MoonIcon className="size-5" weight="regular" />
            )}
        </button>
    );
}
