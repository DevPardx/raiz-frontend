import { useTranslation } from "react-i18next";
import LoginForm from "@/components/forms/auth/LoginForm";

export default function LoginView() {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="space-y-3 text-center">
                <h1 className="text-4xl font-semibold">{ t("login_title") }</h1>
                <p className="text-md text-neutral-500 black:text-neutral-400">{ t("login_subtitle") }</p>
            </div>

            <LoginForm />
        </div>
    );
}
