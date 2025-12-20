import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { EnvelopeIcon, WarningCircleIcon, ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { ForgotPasswordForm } from "@/types";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { useForgotPasswordMutation } from "@/hooks/mutations/useAuthMutations";
import Spinner from "@/components/atoms/Spinner";

export default function ForgotPasswordForm() {
    const { t } = useTranslation();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm<ForgotPasswordForm>();
    const { mutate, isPending } = useForgotPasswordMutation();

    const handleForgotPassword = async (formData: ForgotPasswordForm) => {
        mutate(formData, {
            onSuccess: () => {
                reset();
                setSuccess(true);
                setUserEmail(formData.email);
            },
            onError: (error) => {
                setSuccess(false);
                setUserEmail(null);
                toast.error(error.message);
            }
        });
    };

    return (
        <form
            className={"bg-white dark:bg-neutral-950 py-10 px-10 rounded-2xl mt-5 max-w-md mx-auto space-y-5 border border-neutral-300 dark:border-neutral-700"}
            onSubmit={ handleSubmit(handleForgotPassword) }
        >
            { !success ?
                <>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm">{ t("email") }</label>
                        <div className="mt-2 grid grid-cols-1 relative">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder={ t("register_form_email_placeholder") }
                                className={`col-start-1 row-start-1 block w-full rounded-md bg-neutral-100 placeholder:text-neutral-500 dark:bg-white/5 py-1.5 pr-3 pl-10 text-base dark:text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 sm:pl-9 sm:text-sm/6 ${ errors && errors.email ? "border border-red-500 outline-1 -outline-offset-1 outline-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500" : "" }`}
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

                    <button
                        type="submit"
                        className="text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm mt-5  transition-colors ease-in-out duration-300 flex items-center justify-center gap-3 hover:cursor-pointer bg-neutral-950 dark:bg-white hover:bg-neutral-700 dark:hover:bg-white"
                    >
                        { isPending && <Spinner /> }
                        { t("forgot_password_button") }
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm dark:text-neutral-400 dark:hover:text-white hover:text-neutral-600 transition-colors ease-in-out duration-300">
                        <ArrowLeftIcon size={15} />
                        <Link to="/login">{ t("forgot_password_back_to_sign_in") }</Link>
                    </div>
                </>
            :
                <>
                    <div className="size-20 flex flex-col items-center justify-center w-full aspect-square">
                        <CheckCircleIcon className="size-16 p-3 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                    
                    <p className="text-sm text-center">{ t("forgot_password_success_message_1") } <span className="font-semibold">{ userEmail }</span> { t("forgot_password_success_message_2") }</p>

                    <Link to="/login" className="text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm mt-5  transition-colors ease-in-out duration-300 flex items-center justify-center gap-3 hover:cursor-pointer bg-neutral-950 dark:bg-white hover:bg-neutral-700 dark:hover:bg-white">{ t("forgot_password_back_to_sign_in") }</Link>

                    <div className="flex items-center justify-center gap-2 text-sm dark:text-neutral-400">
                        <p className="dark:text-neutral-400 text-neutral-600">{ t("forgot_password_resend_email") }</p>
                        <button type="button" className="hover:underline dark:hover:text-white hover:text-neutral-950" onClick={ () => setSuccess(false) }>{ t("forgot_password_try_again") }</button>
                    </div>
                </>
            }
        </form>
    );
}
