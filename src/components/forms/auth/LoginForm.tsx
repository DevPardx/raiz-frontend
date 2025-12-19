import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useRouter } from "@tanstack/react-router";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockKeyIcon, WarningCircleIcon } from "@phosphor-icons/react";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import type { LoginForm } from "@/types";
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations";
import Spinner from "@/components/atoms/Spinner";
import { toast } from "sonner";

export default function LoginForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const { register, formState: { errors }, handleSubmit, reset } = useForm<LoginForm>();
    const [showPassword, setShowPassword] = useState(false);
    const { mutate, isPending } = useLoginMutation();

    const handleLogin = async (formData: LoginForm) => {
        mutate(formData, {
            onSuccess: () => {
                toast.success(t("login_success"));
                reset();
                router.navigate({ to: "/" });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    return (
        <form
            className="bg-white dark:bg-neutral-950 py-10 px-10 rounded-2xl mt-5 max-w-md mx-auto space-y-5 border border-neutral-300 dark:border-neutral-700"
            onSubmit={handleSubmit(handleLogin)}
        >
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm">{ t("email") }</label>
                <div className="mt-2 grid grid-cols-1 relative">
                    <input
                        id="email"
                        type="email"
                        placeholder={ t("register_form_email_placeholder") }
                        autoComplete="email"
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
                <label htmlFor="password" className="text-sm">{ t("password") }</label>
                <div className="relative">
                    <LockKeyIcon
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                    />
                    <input
                        id="password"
                        type={ showPassword ? "text" : "password" }
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.password ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
                        { ...register("password", { required: t("register_form_password_required"), minLength: { value: 8, message: t("register_form_password_minlength") } }) }
                    />
                    { errors.password && <WarningCircleIcon aria-hidden="true" className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-4 text-red-500 dark:text-red-400" /> }

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors"
                    >
                        {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                </div>
                { errors.password && <ErrorMessage>{ errors.password.message }</ErrorMessage> }
            </div>

            <button
                type="submit"
                className="text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm mt-5  transition-colors ease-in-out duration-300 flex items-center justify-center gap-3 hover:cursor-pointer bg-neutral-700 dark:bg-white hover:bg-neutral-800 dark:hover:bg-white"
            >
                { isPending && <Spinner /> }
                { t("sign_in") }
            </button>

            <div className="flex items-center justify-center text-sm">
                <p className="dark:text-neutral-400 text-neutral-600">{ t("login_form_have_account") } <Link to="/register" className="dark:text-white text-black hover:underline">{ t("login_form_create_account") }</Link></p>
            </div>
        </form>
    );
}
