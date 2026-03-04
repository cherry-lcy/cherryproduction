import { useNavigate } from "react-router-dom";

import "./index.css";

const Footer = () => {
    const navigate = useNavigate();

    return (<div class="footer w-100 position-relative pb-3 p-4">
        <div class="filter w-100 h-100"></div>
        <h4 class="mb-4 pointer" onClick={()=>navigate("/")}>CHERRY PRODUCTION</h4>
        <div class="row mb-3">
            <div class="row">
                <div class="col-4">
                    <div class="nav" onClick={()=>navigate("/")}>Home</div>
                </div>
                <div class="col-4">
                    <div class="nav" onClick={()=>navigate("/search")}>Piano Arrangements</div>
                </div>
                <div class="col-4">
                    <div class="nav" onClick={()=>navigate("/search")}>Feedback</div>
                </div>
            </div>
        </div>
        <span>© 2026 CherryProduction</span>
    </div>)
}

export default Footer;