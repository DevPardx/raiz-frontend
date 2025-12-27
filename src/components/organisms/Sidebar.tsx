import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HouseLineIcon, HeartStraightIcon, ChatCircleIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import ThemeToggle from "../atoms/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { useLogoutMutation } from "@/hooks/mutations/useAuthMutations";

const navItems = [
    { icon: HouseLineIcon, label: "Home", href: "/" },
    { icon: HeartStraightIcon, label: "Favorites", href: "/favorites" },
    { icon: ChatCircleIcon, label: "Chats", href: "/chats" },
    { icon: GearIcon, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { mutate: handleLogout } = useLogoutMutation();

    return (
        <>
            <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={cn(
                    "hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-white dark:bg-neutral-950 border-r border-neutral-400 dark:border-neutral-800 transition-all duration-300 ease-in-out flex-col",
                    isExpanded ? "w-56" : "w-16",
                )}
            >
                <div className="flex items-center h-16 px-4 border-b border-neutral-400 dark:border-neutral-800">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="size-8 shrink-0">
                            <img src="/svg/logo-dark.svg" alt="Raiz Logo" className="size-full pointer-events-none dark:hidden"/>
                            <img src="/svg/logo-light.svg" alt="Raiz Logo" className="size-full pointer-events-none hidden dark:block"/>
                        </div>
                        <span
                            className={cn(
                            "font-semibold text-lg whitespace-nowrap transition-opacity duration-300",
                            isExpanded ? "opacity-100" : "opacity-0",
                            )}
                        >
                            Raíz
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 py-4 px-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                            return (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-neutral-800 text-white"
                                                : "dark:hover:bg-white dark:hover:text-neutral-950 hover:bg-neutral-200",
                                        )}
                                    >
                                        <item.icon className="size-5 shrink-0" />
                                        <span
                                            className={cn(
                                                "whitespace-nowrap transition-opacity duration-300",
                                                isExpanded ? "opacity-100" : "opacity-0",
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-2 border-t border-neutral-400 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        <ThemeToggle />
                        <span
                            className={cn(
                                "whitespace-nowrap transition-opacity duration-300",
                                isExpanded ? "opacity-100" : "opacity-0",
                            )}
                        >
                            Theme
                        </span>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={() => handleLogout()}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            <SignOutIcon className="size-5 shrink-0" />
                            <span
                                className={cn(
                                    "whitespace-nowrap transition-opacity duration-300",
                                    isExpanded ? "opacity-100" : "opacity-0",
                                )}
                            >
                                Logout
                            </span>
                        </button>
                    )}
                </div>
            </aside>

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-950 border-t border-neutral-400 dark:border-neutral-800">
                <ul className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <li key={item.href} className="flex-1">
                                <Link
                                    to={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors",
                                        isActive
                                            ? "text-neutral-800 dark:text-white"
                                            : "text-neutral-500 dark:text-neutral-400",
                                    )}
                                >
                                    <item.icon className="size-6" weight={isActive ? "fill" : "regular"} />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}
