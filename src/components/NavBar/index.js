import { useNavigate } from 'react-router-dom';

import SearchBar from '../SearchBox';
import "./index.css";

const NavBar = ({mode}) => {
    const navigate = useNavigate();

    return (<div className={`w-100 navbar ${mode === "light" ? "light" : "dark"}`}>
        <div className="row navbar-row align-items-center justify-content-center w-100 m-0 gx-2">
            <div className="col-12 col-md-5 pt-3 pb-3 px-5 p-3">
                <div className="h5 mb-0 pointer" onClick={()=>navigate("/")}>CHERRY PRODUCTION</div>
            </div>
            <div className="col-12 col-md-7 pt-3 pb-3">
                <div className="row align-items-center justify-content-center gx-2">
                    <div className="col-12 col-sm-4 text-center text-sm-start">
                        <div className="nav" onClick={()=>navigate("/search")}>Piano Arrangements</div>
                    </div>
                    <div className="col-6 col-sm-2 text-center">
                        <div className="nav" onClick={()=>window.open("https://space.bilibili.com/3546599764527382", "_blank")}>Bilibili</div>
                    </div>
                    <div className="col-6 col-sm-2 text-center">
                        <div className="nav mx-2">简</div>
                        /
                        <div className="nav mx-2">繁</div>
                    </div>
                    <div className="col-12 col-sm-4 px-4">
                        <SearchBar mode={mode}/>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default NavBar;