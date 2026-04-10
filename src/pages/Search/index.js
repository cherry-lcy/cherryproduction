import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBox";
import Loading from "../../components/Loading";
import Api from "../../utils/api";
import { tagBgColors } from "../../utils/constant";
import "./index.css";

const Search = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState([]);
    const [artists, setArtists] = useState([]);
    const [titles, setTitles] = useState([]);
    const [filter, setFilter] = useState({
        sort_by: searchParams.get("sort_by") ? searchParams.get("sort_by") : "release_date", 
        artist: searchParams.get("artist") ? searchParams.get("artist") : "", 
        title: searchParams.get("title") ? searchParams.get("title") : "",
        type: searchParams.get("type") ? searchParams.get("type") : "",
        order: searchParams.get("order") ? searchParams.get("order") : "desc"
    });
    const [types, setTypes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 9;  // 固定每页9条

    async function getTitles(artistName = null){
        const response = await Api.get(`/api/titles${artistName ? `/${encodeURIComponent(artistName)}` : ''}`);
        setTitles(response.titles);
    }

    async function searchSongs() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.artist && filter.artist !== "-1") params.append('artist', filter.artist);
            if (filter.title && filter.title !== "-1") params.append('title', filter.title);
            if (filter.type && filter.type !== "-1") params.append('type', filter.type);
            if (filter.sort_by) params.append('sort_by', filter.sort_by);
            if (filter.order) params.append('order', filter.order);
            params.append('page', currentPage);
            params.append('per_page', ITEMS_PER_PAGE);
            
            const response = await Api.get(`/api/songs/search?${params.toString()}`);
            setInfo(response.data.songs);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        async function getArtists(){
            const response = await Api.get("/api/artists");
            setArtists(response.artists);
        }

        async function getTypes(){
            const response = await Api.get("/api/types");
            setTypes(response.types);
        }

        Promise.all([getArtists(), getTypes(), getTitles()]).then(() => {
            searchSongs();
        });
    }, []);

    useEffect(() => {
        if (artists.length > 0 || types.length > 0) {
            searchSongs();
        }
    }, [filter, currentPage]);

    const handleFilter = (e) => {
        if(e.target.value === "1" || e.target.value === "2"){
            setFilter({
                ...filter,
                sort_by: "release_date",
                order: e.target.value === "1" ? "desc" : "asc"
            });
        }
        else if(e.target.value === "3" || e.target.value === "4"){
            setFilter({
                ...filter,
                sort_by: "title",
                order: e.target.value === "3" ? "asc" : "desc"
            });
        }
        else{
            setFilter({
                ...filter,
                sort_by: "artist",
                order: e.target.value === "5" ? "asc" : "desc"
            });
        }
        setCurrentPage(1);
    }

    const handlefieldFilter = (e, field) => {
        const value = e.target.value;
        setFilter({...filter, [field]: value === "-1" ? "" : value});
        setCurrentPage(1);
        
        if (field === 'artist') {
            if (value === "-1") {
                getTitles();
            } else {
                getTitles(value);
            }
        }
    }

    const handleReset = () => {
        setFilter({
            sort_by: "release_date",
            artist: "",
            title: "",
            type: "",
            order: "desc"
        });
        setCurrentPage(1);
        getTitles();
    }

    const handleSearch = () => {
        setCurrentPage(1);
        searchSongs();
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }

    return (<>
    <section className="header-section w-100">
        <NavBar mode="dark"/>
        <section className="section-text">
            <div className="h2 pt-5 mb-3">Piano Arrangements/ Transcriptions</div>
        </section>
    </section>
    <section className="p-4 px-5 pb-5 search-page">
        <h1 className="mb-4">Search</h1>
        <div className="row align-items-center search-top-row">
            <div className="col-12 col-md-8 mb-md-0"><SearchBar mode="light" width="100%"/></div>
            <div className="col-12 px-3 col-md-4 d-flex align-items-center justify-content-md-end" style={{gap: "10px"}}>
                <label htmlFor="order" style={{whiteSpace: "nowrap"}}>Order: </label>
                <select 
                    className="form-select rounded-pill" 
                    name="order" 
                    onChange={handleFilter}
                    value={
                        filter.sort_by === "release_date" && filter.order === "desc" ? "1" :
                        filter.sort_by === "release_date" && filter.order === "asc" ? "2" :
                        filter.sort_by === "title" && filter.order === "asc" ? "3" :
                        filter.sort_by === "title" && filter.order === "desc" ? "4" :
                        filter.sort_by === "artist" && filter.order === "asc" ? "5" : "6"
                    }
                >
                    <option value="1">Time: From new to old</option>
                    <option value="2">Time: From old to new</option>
                    <option value="3">Song Title: Alphabatical Order</option>
                    <option value="4">Song Title:Reverse Alphabatical Order</option>
                    <option value="5">Artist: Alphabatical Order</option>
                    <option value="6">Artist: Reverse Alphabatical Order</option>
                </select>
            </div>
        </div>
        <div className="row pt-3 pb-4 search-filter-row">
            <div className="col-12 col-md-3 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="type" style={{whiteSpace: "nowrap"}}>Type: </label>
                <select 
                    className="form-select rounded-pill" 
                    name="type" 
                    id="type"
                    value={filter.type || "-1"}
                    onChange={e=>handlefieldFilter(e, 'type')}
                >
                    <option value="-1">All types</option>
                    {types.map((type, index)=><option key={index} value={type}>{type}</option>)}
                </select>
            </div>
            <div className="col-12 col-md-3 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="artist-name" style={{whiteSpace: "nowrap"}}>Artist Name: </label>
                <select 
                    className="form-select rounded-pill" 
                    name="artist-name" 
                    id="artist-name"
                    value={filter.artist || "-1"}
                    onChange={e => handlefieldFilter(e, 'artist')}
                >
                    <option value="-1">All Artists</option>
                    {artists.map((artist, index)=><option key={index} value={artist}>{artist}</option>)}
                </select>
            </div>
            <div className="col-12 col-md-3 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="song-name" style={{whiteSpace: "nowrap"}}>Song Name: </label>
                <select 
                    className="form-select rounded-pill" 
                    name="song-name" 
                    id="song-name"
                    value={filter.title || "-1"}
                    onChange={e => handlefieldFilter(e, 'title')}
                >
                    <option value="-1">All Songs</option>
                    {titles.map((title, index)=><option key={index} value={title}>{title}</option>)}
                </select>
            </div>
            <div className="col-12 col-md-3 px-3 d-flex align-items-center justify-content-md-end" style={{gap: "2em"}}>
                <button type="button" className="btn btn-light px-4" onClick={handleReset}>Reset</button>
                <button type="button" className="btn btn-dark px-4" onClick={handleSearch}>Search</button>
            </div>
        </div>
        <div className="row row-cols-1 row-cols-lg-3 g-3">
            {!loading && info.map((song, index) => 
                <div className="col my-3" key={index}>
                    <div className="card song-card pointer" onClick={()=>navigate(`/detail?id=${song.id}`)}>
                        <img src={song.cover?.url} className="card-img-top" alt="card" style={{height: "12em"}}/>
                        <div className="card-body">
                            <h4 className="card-title">{song.title}</h4>
                            <h6 className="card-subtitle text-muted mb-3">{song.artist}</h6>
                            {song.tags && song.tags.length > 0 && (
                                <div className="mb-2">
                                    {song.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className={`badge ${tagBgColors[idx % tagBgColors.length]} bg-gradient me-1`}>{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="card-text align-items-center view-tag">
                                <span>View More </span>
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        {!loading && totalPages > 1 && (
            <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    </li>
                    {[...Array(totalPages)].map((_, idx) => (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(idx + 1)}>{idx + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        )}
    </section>
    <Footer/>
    {loading && <Loading/>}
    </>)
}

export default Search;