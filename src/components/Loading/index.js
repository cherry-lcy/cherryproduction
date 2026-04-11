import { useLanguage } from "../../contexts/LanguageContext";
import "./index.css";

const Loading = () => {
    const {t, language} = useLanguage();

    return (
        <div className="loading-overlay">
            <div className="text-center icon-container">
                <div className="loading-spinner">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">{t("loading.message")}</span>
                    </div>
                </div>
                <div className="loading-text">{t("loading.message")}</div>
            </div>
        </div>
    );
};

export default Loading;