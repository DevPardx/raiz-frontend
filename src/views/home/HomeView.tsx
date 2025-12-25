import { useTranslation } from "react-i18next";

export default function HomeView() {
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="text-4xl font-bold">{ t("home_title") }</h1>
            <h3 className="dark:text-neutral-400 text-neutral-600">{ t("home_subtitle") }</h3>
        </div>
    );
}
