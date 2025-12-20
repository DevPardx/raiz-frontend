import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "@tanstack/react-router";
import { EyeIcon, EyeSlashIcon, LockKeyIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { ResetPasswordForm } from "@/types";
import Spinner from "@/components/atoms/Spinner";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { useResetPasswordMutation } from "@/hooks/mutations/useAuthMutations";

export default function ResetPasswordForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams({ strict: false });

    const { register, formState: { errors }, getValues, handleSubmit, reset } = useForm<ResetPasswordForm>();
    const [showPassword, setShowPassword] = useState(false);
    const { mutate, isPending } = useResetPasswordMutation();

    const handleResetPassword = (formData: ResetPasswordForm) => {
        const data = {
            ...formData,
            token: params.token!
        };

        mutate(data, {
            onSuccess: (message) => {
                toast.success(message);
                reset();
                router.navigate({ to: "/login" });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    return (
        <form
            className="bg-white dark:bg-neutral-950 py-10 px-10 rounded-2xl mt-5 max-w-md mx-auto space-y-5 border border-neutral-300 dark:border-neutral-700"
            onSubmit={ handleSubmit(handleResetPassword) }
        >
            <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm">{ t("reset_password_form_new_password_label") }</label>
                <div className="relative">
                    <LockKeyIcon
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                    />
                    <input
                        id="newPassword"
                        type={ showPassword ? "text" : "password" }
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base dark:text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.newPassword ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
                        { ...register("newPassword", { required: t("register_form_password_required"), minLength: { value: 8, message: t("register_form_password_minlength") } }) }
                    />
                    { errors.newPassword && <WarningCircleIcon aria-hidden="true" className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-4 text-red-500 dark:text-red-400" /> }

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors"
                    >
                        {showPassword ? <EyeSlashIcon className="size-4 text-neutral-700 dark:text-neutral-300" /> : <EyeIcon className="size-4 text-neutral-700 dark:text-neutral-300" />}
                    </button>
                </div>
                { errors.newPassword && <ErrorMessage>{ errors.newPassword.message }</ErrorMessage> }
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm">{ t("reset_passwod_form_confirm_password_label") }</label>
                <div className="relative">
                    <LockKeyIcon
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                    />
                    <input
                        id="confirmPassword"
                        type={ showPassword ? "text" : "password" }
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base dark:text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.confirmPassword ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
                        { ...register("confirmPassword", { required: t("register_form_password_required"), validate: (value) => value === getValues("newPassword") || t("reset_password_not_match") }) }
                    />
                    { errors.confirmPassword && <WarningCircleIcon aria-hidden="true" className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-4 text-red-500 dark:text-red-400" /> }

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors"
                    >
                        {showPassword ? <EyeSlashIcon className="size-4 text-neutral-700 dark:text-neutral-300" /> : <EyeIcon className="size-4 text-neutral-700 dark:text-neutral-300" />}
                    </button>
                </div>
                { errors.confirmPassword && <ErrorMessage>{ errors.confirmPassword.message }</ErrorMessage> }
            </div>

            <button
                type="submit"
                className={`text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm mt-5  transition-colors ease-in-out duration-300 flex items-center justify-center gap-3 ${Object.keys(errors).includes("confirmPassword") || Object.keys(errors).includes("newPassword") ? "hover:cursor-not-allowed bg-neutral-400" : "hover:cursor-pointer bg-neutral-950 dark:bg-white hover:bg-neutral-700 dark:hover:bg-white"}`}
                disabled={ Object.keys(errors).includes("confirmPassword") || Object.keys(errors).includes("newPassword") }
            >
                { isPending && <Spinner /> }
                { t("reset_password_form_button") }
            </button>
        </form>
    );
}
