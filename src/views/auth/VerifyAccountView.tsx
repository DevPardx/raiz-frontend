import VerifyAccountForm from "@/components/forms/auth/VerifyAccountForm";
import { useTranslation } from "react-i18next";

export default function VerifyAccountView() {
    const { t } = useTranslation();

    return (
        <>
            <div className="space-y-3 text-center">
                <h1 className="text-4xl font-semibold">{ t("verify_account_title") }</h1>
                <p className="text-md text-neutral-500 black:text-neutral-400">{ t("verify_account_subtitle") }</p>
            </div>

            <VerifyAccountForm />
        </>
    );
}
