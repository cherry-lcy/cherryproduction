import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./index.css";

const SideBar = ({ link,  }) => {
    const navigate = useNavigate();

    const handleLike = () => {

    }

    const handleShare = () => {
        
    }

    return (
        <div id="sidebar-container">
            <div className="icon">
                <button className="icon-button" onClick={handleLike}>
                    <i className="bi bi-hand-thumbs-up"></i>
                </button>
            </div>
            <div className="icon" onClick={handleShare}>
                <button className="icon-button">
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
    );
};

export default SideBar;