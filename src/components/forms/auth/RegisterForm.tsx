import { useState } from "react";
import { User, Envelope, LockKey, HouseLine, Building, Eye, EyeSlash } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { Role } from "@/types";
import { useTranslation } from "react-i18next";

export default function RegisterForm() {
    const { t } = useTranslation();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="bg-white dark:bg-neutral-900 py-10 px-10 rounded-2xl mt-5 max-w-md mx-auto space-y-5 border border-neutral-300 dark:border-neutral-700">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm">{ t("register_form_name_label") }</label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6"
                    />
                    <User
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-3 self-center size-4"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm">{ t("register_form_email_label") }</label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={ t("register_form_email_placeholder") }
                        className="col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6"
                    />
                    <Envelope
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-3 self-center size-4"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm">{ t("register_form_password_label") }</label>
                <div className="relative">
                    <LockKey
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                    />
                    <input
                        id="password"
                        name="password"
                        type={ showPassword ? "text" : "password" }
                        placeholder={ t("register_form_password_placeholder") }
                        className="col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6"
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="text-sm">{ t("register_form_role_label") }</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => setSelectedRole("buyer")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:cursor-pointer ${selectedRole === "buyer"
                                ? "bg-neutral-700 dark:bg-white text-white dark:text-neutral-900 border-white"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 dark:border-neutral-700 border-neutral-300 hover:border-neutral-600"
                            }`}
                    >
                        <HouseLine className="size-5" />
                        <span className="text-sm font-medium">{ t("register_form_buyer_button") }</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedRole("seller")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:cursor-pointer ${selectedRole === "seller"
                                ? "bg-neutral-700 dark:bg-white text-white dark:text-neutral-900 border-white"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 dark:border-neutral-700 border-neutral-300 hover:border-neutral-600"
                            }`}
                    >
                        <Building className="size-5" />
                        <span className="text-sm font-medium">{ t("register_form_seller_button") }</span>
                    </button>
                </div>
            </div>

            <input
                type="submit"
                value={ t("create_account") }
                className="bg-neutral-700 dark:bg-white text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm mt-5 hover:cursor-pointer hover:bg-neutral-800 dark:hover:bg-white transition-colors ease-in-out duration-300"
            />

            <div className="flex items-center justify-center text-sm">
                <p className="text-neutral-400">{ t("register_form_have_account") } <Link to="/login" className="text-white">{ t("sign_in") }</Link></p>
            </div>
        </form>
    );
}
