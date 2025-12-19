import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "@/components/forms/auth/ForgotPasswordForm";

export default function ForgotPasswordView() {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="space-y-3 text-center">
                <h1 className="text-4xl font-semibold">{ t("forgot_password_title") }</h1>
                <p className="text-md text-neutral-500 black:text-neutral-400">{ t("forgot_password_subtitle") }</p>
            </div>

            <ForgotPasswordForm />
        </div>
    );
}
