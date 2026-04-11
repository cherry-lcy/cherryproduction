import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./index.css";

const SideBar = ({ link, songId }) => {
    const {t, language} = useLanguage();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const currentUrl = window.location.href;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setToastMessage(t("detail.linkCopied"));
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 100000);
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = currentUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setToastMessage(t("detail.linkCopied"));
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 10000);
        }
        setShowShareDialog(true);
    };

    return (
        <>
            <div id="sidebar-container">
                <div className="icon">
                    <button className="icon-button" onClick={handleShare}>
                        <i className="bi bi-share"></i>
                    </button>
                </div>
                <div className="icon">
                    <button 
                        className="icon-button bilibili-icon" 
                        onClick={() => window.open(link, "_blank")}
                        aria-label="bilibili link"
                    />
                </div>
            </div>
            {showToast && (
                <div className="custom-toast">
                    {toastMessage}
                </div>
            )}
        </>
    );
};

export default SideBar;