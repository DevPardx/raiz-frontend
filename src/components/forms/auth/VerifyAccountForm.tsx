import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslation } from "react-i18next";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { useResendCodeMutation, useVerifyAccountMutation } from "@/hooks/mutations/useAuthMutations";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import Spinner from "@/components/atoms/Spinner";

export default function VerifyAccountForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [email, setEmail] = useState(() => {
        return localStorage.getItem("pendingVerificationEmail") || "";
    });
    const [showEmailInput, setShowEmailInput] = useState(() => {
        return !localStorage.getItem("pendingVerificationEmail");
    });
    const [hasValidCode, setHasValidCode] = useState(() => {
        return !!localStorage.getItem("pendingVerificationEmail");
    });
    const [cooldown, setCooldown] = useState(0);

    const { mutate: verifyMutate, isPending: isVerifying } = useVerifyAccountMutation();
    const { mutate: resendMutate, isPending: isResending } = useResendCodeMutation();

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => {
                setCooldown(cooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleVerifyAccount = () => {
        if (code.length !== 6 || email.trim() === "" || !hasValidCode) {
            toast.error(t("verify_account_missing_data"));
            return;
        }

        verifyMutate(
            { email, token: code },
            {
                onSuccess: (data) => {
                    toast.success(data);
                    localStorage.removeItem("pendingVerificationEmail");
                    navigate({ to: "/login" });
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            }
        );
    };

    const handleResendCode = () => {
        if (!email || !isValidEmail(email)) {
            toast.error(t("resend_code_invalid_email_format"));
            return;
        }

        resendMutate(email, {
            onSuccess: (data) => {
                toast.success(data);
                localStorage.setItem("pendingVerificationEmail", email);
                setShowEmailInput(false);
                setHasValidCode(true);
                setCooldown(30); // Iniciar cooldown de 30 segundos
            },
            onError: (error) => {
                toast.error(error.message);
                setShowEmailInput(true);
                setHasValidCode(false);
                localStorage.removeItem("pendingVerificationEmail");
            }
        });
    };

    return (
        <div className="mt-10 bg-white dark:bg-neutral-950 rounded-2xl max-w-md mx-auto border border-neutral-300 dark:border-neutral-700 pt-10 pb-10 pr-10 pl-10 space-y-5">
            <div className="space-y-3">
                <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)} pattern={ REGEXP_ONLY_DIGITS }>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>

                <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={code.length !== 6 || email.trim() === "" || !hasValidCode || isVerifying}
                    className={`text-white dark:text-neutral-950 w-full py-3 rounded-lg text-sm transition-colors ease-in-out duration-300 flex items-center justify-center gap-3 ${
                        code.length !== 6 || email.trim() === "" || !hasValidCode || isVerifying
                            ? "hover:cursor-not-allowed bg-neutral-400"
                            : "hover:cursor-pointer bg-neutral-700 dark:bg-white hover:bg-neutral-800 dark:hover:bg-white"
                    }`}
                >
                    { isVerifying && <Spinner /> }
                    { t("verify_account_button") }
                </button>
            </div>

            <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-5">
                {showEmailInput ? (
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setHasValidCode(false);
                                }}
                                placeholder={t("register_form_email_placeholder")}
                                className="w-full rounded-md bg-neutral-100 dark:bg-white/5 py-2 pr-3 pl-10 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 text-sm"
                            />
                            <EnvelopeIcon
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                        <p>
                            {t("resend_code_sent_to")}: <strong className="text-black dark:text-white">{email}</strong>
                        </p>
                        <button
                            onClick={() => {
                                setShowEmailInput(true);
                                setHasValidCode(false);
                            }}
                            className="mt-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                            {t("resend_code_change_email")}
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    <p className="dark:text-neutral-400 text-neutral-600 text-sm text-center">
                        {t("verify_account_desc")}
                    </p>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isResending || !email || cooldown > 0}
                        className={`w-full flex items-center justify-center gap-2 text-sm transition-colors ${
                            isResending || !email || cooldown > 0
                                ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                                : "text-black dark:text-white hover:underline cursor-pointer"
                        }`}
                    >
                        {isResending ? (
                            <Spinner />
                        ) : cooldown > 0 ? (
                            t("resend_code_cooldown", { seconds: cooldown })
                        ) : (
                            t("verify_account_link")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
