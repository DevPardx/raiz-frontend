import RegisterForm from "@/components/forms/auth/RegisterForm";
import { useTranslation } from "react-i18next";

export default function RegisterView() {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="space-y-3 text-center">
                <h1 className="text-4xl font-semibold">{ t("register_title") }</h1>
                <p className="text-md text-neutral-500 black:text-neutral-400">{ t("register_subtitle") }</p>
            </div>
            <RegisterForm />
        </div>
    );
}
