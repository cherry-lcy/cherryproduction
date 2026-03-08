import {useNavigate} from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBox";
import CardJPG from "../../assets/card.jpg";
import "./index.css";

const Search = () => {
    const navigate = useNavigate();

    return (<>
    <section className="header-section w-100">
        <NavBar mode="dark"/>
        <section className="section-text">
            <div className="h2 pt-5 mb-3">Piano Arrangements/ Transcriptions</div>
        </section>
    </section>
    <section className="p-4 px-5 pb-5">
        <h1 class="mb-4">Search</h1>
        <div className="row">
            <div style={{width: "70%"}}><SearchBar mode="light" width="100%"/></div>
            <div className="d-flex align-items-center" style={{width: "30%", gap: "10px"}}>
                <label htmlFor="order" style={{whiteSpace: "nowrap"}}>Order: </label>
                <select className="form-select rounded-pill" name="order">
                    <option value="1">Time: From old to new</option>
                    <option value="2">Time: From new to old</option>
                    <option value="3">Alphabatical Order</option>
                    <option value="4">Reverse Alphabatical Order</option>
                    <option value="5">artist Order</option>
                    <option value="6">artist Reverse Order</option>
                </select>
            </div>
        </div>
        <div className="row pt-3 pb-4">
            <div className="col-4 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="type" style={{whiteSpace: "nowrap"}}>Type: </label>
                <select className="form-select rounded-pill" name="type" id="type">
                    <option value="1">Time: From old to new</option>
                </select>
            </div>
            <div className="col-5 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="artist-name" style={{whiteSpace: "nowrap"}}>Artist Name: </label>
                <select className="form-select rounded-pill" name="artist-name" id="artist-name">
                    <option value="1">Time: From old to new</option>
                </select>
            </div>
            <div className="col-3 px-3 d-flex align-items-center justify-content-end" style={{gap: "2em"}}>
                <button type="button" class="btn btn-light px-4">Reset</button>
                <button type="button" class="btn btn-dark px-4">Search</button>
            </div>
        </div>
        <div className="row">
            <div className="col-4">
                <div class="card song-card pointer" onClick={()=>navigate("/detail")}>
                    <img src={CardJPG} class="card-img-top" alt="card" style={{height: "14em"}}/>
                    <div class="card-body">
                        <h4 class="card-title">Icarus</h4>
                        <h6 class="card-subtitle text-muted mb-3">ARTMS</h6>
                        <div class="card-text align-items-center view-tag">
                            <span>View More </span>
                            <i class="bi bi-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Footer/>
    </>)
}

export default Search;