import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "./index.css";

const Footer = () => {
    const {t, language} = useLanguage();
    const navigate = useNavigate();

    return (<div class="footer w-100 position-relative pb-3 p-4">
        <div class="filter w-100 h-100"></div>
        <h4 class="mb-4 pointer" onClick={()=>navigate("/")}>CHERRY PRODUCTION</h4>
        <div class="row mb-3">
            <div class="row">
                <div class="col-4">
                    <div class="nav text-start" onClick={()=>navigate("/")}>{t("common.home")}</div>
                </div>
                <div class="col-4">
                    <div class="nav text-start" onClick={()=>navigate("/search")}>{t("nav.pianoArrangements")}</div>
                </div>
                <div class="col-4">
                    <div class="nav text-start" onClick={()=>window.open("https://space.bilibili.com/3546599764527382", "_blank")}>{t("nav.bilibili")}</div>
                </div>
            </div>
        </div>
        <span>{t("footer.copyright")}</span>
    </div>)
}

export default Footer;