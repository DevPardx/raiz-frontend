import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next"

export default function StartView() {
    const { t } = useTranslation();

    return (
        <>
            <div className="space-y-7">
                <h1 className="text-4xl font-semibold text-center">{ t("start_title") }</h1>
                <p className="text-md text-neutral-500 black:text-neutral-400">{ t("start_subtitle") }</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-7">
                <Link
                    to="/login"
                    className="px-8 py-3 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
                >
                    { t("sign_in") }
                </Link>
                <Link
                    to="/register"
                    className="px-8 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg font-medium hover:bg-neutral-700 transition-colors"
                >
                    { t("create_account") }
                </Link>
            </div>
        </>
    )
}
