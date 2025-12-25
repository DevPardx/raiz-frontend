import { useTranslation } from "react-i18next";

export default function FavoritesView() {
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="text-4xl font-bold">{ t("favorites_title") }</h1>
            <h3 className="dark:text-neutral-400 text-neutral-600">{ t("favorites_subtitle") }</h3>
        </div>
    );
}
