import { useState } from "react";
import { UserIcon, EnvelopeIcon, LockKeyIcon, HouseLineIcon, BuildingIcon, EyeIcon, EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Link, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { RegisterForm, Role } from "@/types";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Spinner from "@/components/atoms/Spinner";
import { useRegisterMutation } from "@/hooks/mutations/useAuthMutations";

export default function RegisterForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const { register, formState: { errors }, handleSubmit, reset } = useForm<RegisterForm>();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { mutate, isPending } = useRegisterMutation();

    const handleRegister = async (formData: RegisterForm) => {
        const data = {
            ...formData,
            role: selectedRole!
        };

        mutate(data, {
            onSuccess: (info) => {
                toast.success(info);
                localStorage.setItem("pendingVerificationEmail", data.email);
                reset();
                setSelectedRole(null);
                router.navigate({ to: "/verify-account" });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    return (
        <form
            className="bg-white dark:bg-neutral-950 py-10 px-10 rounded-2xl mt-5 max-w-md mx-auto space-y-5 border border-neutral-300 dark:border-neutral-700"
            onSubmit={ handleSubmit(handleRegister) }
        >
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm">{ t("register_form_name_label") }</label>
                <div className="mt-2 grid grid-cols-1 relative">
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="John Doe"
                        aria-describedby="email-error"
                        className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.name ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
                        { ...register("name", { required: t("register_form_name_required") }) }
                    />
                    <UserIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-3 self-center size-4"
                    />
                    { errors.name && <WarningCircleIcon aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-500 dark:text-red-400" /> }
                </div>
                { errors.name && <ErrorMessage>{ errors.name.message }</ErrorMessage>  }
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm">{ t("register_form_email_label") }</label>
                <div className="mt-2 grid grid-cols-1 relative">
                    <input
                        id="email"
                        type="email"
                        placeholder={ t("register_form_email_placeholder") }
                        className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.email ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
                        { ...register("email", { required: t("register_form_email_required"), pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("register_form_email_invalid") } }) }
                    />
                    <EnvelopeIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-3 self-center size-4"
                    />
                    { errors.email && <WarningCircleIcon aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-500 dark:text-red-400" /> }
                </div>
                { errors.email && <ErrorMessage>{ errors.email.message }</ErrorMessage> }
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm">{ t("register_form_password_label") }</label>
                <div className="relative">
                    <LockKeyIcon
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                    />
                    <input
                        id="password"
                        type={ showPassword ? "text" : "password" }
                        placeholder="••••••••"
                        className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.password ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
                        { ...register("password", { required: t("register_form_password_required"), minLength: { value: 8, message: t("register_form_password_minlength") } }) }
                    />
                    { errors.password && <WarningCircleIcon aria-hidden="true" className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-4 text-red-500 dark:text-red-400" /> }

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                </div>
                { errors.password && <ErrorMessage>{ errors.password.message }</ErrorMessage> }
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
                        <HouseLineIcon className="size-5" />
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
                        <BuildingIcon className="size-5" />
                        <span className="text-sm font-medium">{ t("register_form_seller_button") }</span>
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className={`text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm mt-5  transition-colors ease-in-out duration-300 flex items-center justify-center gap-3 ${selectedRole === null ? "hover:cursor-not-allowed bg-neutral-400" : "hover:cursor-pointer bg-neutral-700 dark:bg-white hover:bg-neutral-800 dark:hover:bg-white"}`}
                disabled={ selectedRole === null }
            >
                { isPending && <Spinner /> }
                { t("create_account") }
            </button>

            <div className="flex items-center justify-center text-sm">
                <p className="dark:text-neutral-400 text-neutral-600">{ t("register_form_have_account") } <Link to="/login" className="dark:text-white text-black hover:underline">{ t("sign_in") }</Link></p>
            </div>
        </form>
    );
}
