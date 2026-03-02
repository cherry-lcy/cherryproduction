import SearchBar from '../Search';
import "./index.css";

const NavBar = () => {
    return (<div class="w-100 navbar">
        <div class="row align-items-center justify-content-center w-100 m-0">
            <div class="col-5 pt-3 pb-3 px-5 p-3">
                <div class="h5 mb-0 pointer">CHERRY PRODUCTION</div>
            </div>
            <div class="col-7 pt-3 pb-3">
                <div class="row align-items-center justify-content-center">
                    <div class="col-4">
                        <div class="nav">Piano Arrangements</div>
                    </div>
                    <div class="col-4">
                        <div class="nav">Feedback</div>
                    </div>
                    <div class="col-4 px-4">
                        <SearchBar/>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default NavBar;