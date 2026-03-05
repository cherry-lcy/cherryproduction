import { useNavigate } from 'react-router-dom';

import SearchBar from '../SearchBox';
import "./index.css";

const NavBar = ({mode}) => {
    const navigate = useNavigate();

    return (<div className={`w-100 navbar ${mode === "light" ? "light" : "dark"}`}>
        <div class="row align-items-center justify-content-center w-100 m-0">
            <div class="col-5 pt-3 pb-3 px-5 p-3">
                <div class="h5 mb-0 pointer" onClick={()=>navigate("/")}>CHERRY PRODUCTION</div>
            </div>
            <div class="col-7 pt-3 pb-3">
                <div class="row align-items-center justify-content-center">
                    <div class="col-4">
                        <div class="nav" onClick={()=>navigate("/search")}>Piano Arrangements</div>
                    </div>
                    <div class="col-2">
                        <div class="nav" onClick={()=>window.open("https://space.bilibili.com/3546599764527382", "_blank")}>Bilibili</div>
                    </div>
                    <div class="col-2">
                        <div class="nav mx-2">简</div>
                        /
                        <div class="nav mx-2">繁</div>
                    </div>
                    <div class="col-4 px-4">
                        <SearchBar mode={mode}/>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default NavBar;