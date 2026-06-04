import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBox";
import Loading from "../../components/Loading";
import Api from "../../utils/api";
import { tagBgColors } from "../../utils/constant";
import { useLanguage } from "../../contexts/LanguageContext";
import "./index.css";

const Search = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState([]);
    const [artists, setArtists] = useState([]);
    const [titles, setTitles] = useState([]);
    const [filter, setFilter] = useState({
        sort_by: searchParams.get("sort_by") ? searchParams.get("sort_by") : "release_date", 
        artist: searchParams.get("artist") ? searchParams.get("artist") : "", 
        title: searchParams.get("title") ? searchParams.get("title") : "",
        type: searchParams.get("type") ? searchParams.get("type") : "",
        order: searchParams.get("order") ? searchParams.get("order") : "desc",
        query: searchParams.get("q") ? searchParams.get("q") : ""
    });
    const [types, setTypes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Add cache to avoid repeated searches
    const searchCache = useRef(new Map());
    // Add debounce timer reference
    const debounceTimer = useRef(null);
    // Track if initial load is done
    const isInitialMount = useRef(true);

    const ITEMS_PER_PAGE = 9;

    // Helper function to generate pagination range with ellipsis
    // Shows: first page, last page, pages around current page, and ellipsis where needed
    const getPaginationRange = (current, total, maxVisible = 5) => {
        if (total <= 1) return [1];
        
        const range = [];
        const halfVisible = Math.floor(maxVisible / 2);
        let start = Math.max(1, current - halfVisible);
        let end = Math.min(total, start + maxVisible - 1);
        
        // Adjust if we're near the end
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        // Always show first page
        if (start > 1) {
            range.push(1);
            if (start > 2) range.push('...');
        }
        
        // Add pages in the middle range
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        
        // Always show last page
        if (end < total) {
            if (end < total - 1) range.push('...');
            range.push(total);
        }
        
        return range;
    };

    // Helper function to sync filter state with URL parameters
    const syncURLWithFilter = (newFilter, page = currentPage) => {
        const params = new URLSearchParams();
        if (newFilter.query) params.set('q', newFilter.query);
        if (newFilter.artist) params.set('artist', newFilter.artist);
        if (newFilter.title) params.set('title', newFilter.title);
        if (newFilter.type) params.set('type', newFilter.type);
        if (newFilter.sort_by) params.set('sort_by', newFilter.sort_by);
        if (newFilter.order) params.set('order', newFilter.order);
        if (page > 1) params.set('page', page);
        setSearchParams(params, { replace: true });
    };

    async function getTitles(artistName = null){
        const response = await Api.get(`/api/titles${artistName ? `/${encodeURIComponent(artistName)}` : ''}`);
        setTitles(response.titles);
    }

    // Memoize search function to prevent recreation
    const searchSongs = useCallback(async (skipCache = false) => {
        // Clear any pending debounce timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Generate cache key based on current state
        const cacheKey = JSON.stringify({
            filter,
            currentPage,
            language
        });
        
        // Check cache first (skipCache for manual search)
        if (!skipCache && searchCache.current.has(cacheKey)) {
            const cached = searchCache.current.get(cacheKey);
            setInfo(cached.songs);
            setTotalPages(cached.totalPages);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.artist && filter.artist !== "-1") params.append('artist', filter.artist);
            if (filter.title && filter.title !== "-1") params.append('title', filter.title);
            if (filter.type && filter.type !== "-1") params.append('type', filter.type);
            if (filter.sort_by) params.append('sort_by', filter.sort_by);
            if (filter.order) params.append('order', filter.order);
            if (filter.query) params.append('q', filter.query);
            params.append('page', currentPage);
            params.append('per_page', ITEMS_PER_PAGE);
            params.append('language', language);
            
            const response = await Api.get(`/api/songs/search?${params.toString()}`);
            setInfo(response.data.songs);
            setTotalPages(response.data.total_pages);
            
            // Cache the results (expire after 5 minutes)
            searchCache.current.set(cacheKey, {
                songs: response.data.songs,
                totalPages: response.data.total_pages,
                timestamp: Date.now()
            });
            
            // Clean up old cache entries after 5 minutes
            setTimeout(() => {
                if (searchCache.current.get(cacheKey)?.timestamp === Date.now()) {
                    searchCache.current.delete(cacheKey);
                }
            }, 5 * 60 * 1000);
            
            // Sync URL with current filter and page after search
            syncURLWithFilter(filter, currentPage);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    }, [filter, currentPage, language]);

    // Initial load - fetch artists, types, and titles
    useEffect(() => {
        async function getArtists(){
            const response = await Api.get("/api/artists");
            setArtists(response.artists);
        }

        Promise.all([getArtists(), getTitles()]).then(() => {
            searchSongs();
        });
    }, []); // Empty dependency array - runs once

    // Debounced search for filter changes (prevents excessive API calls)
    useEffect(() => {
        // Skip on initial mount to avoid duplicate search
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        // Set new timer - 500ms delay before searching
        debounceTimer.current = setTimeout(() => {
            searchSongs();
        }, 500);
        
        // Cleanup timer on component unmount or when dependencies change
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [filter, currentPage, language, searchSongs]);

    const handleFilter = (e) => {
        let newFilter;
        if(e.target.value === "1" || e.target.value === "2"){
            newFilter = {
                ...filter,
                sort_by: "release_date",
                order: e.target.value === "1" ? "desc" : "asc"
            };
        }
        else if(e.target.value === "3" || e.target.value === "4"){
            newFilter = {
                ...filter,
                sort_by: "title",
                order: e.target.value === "3" ? "asc" : "desc"
            };
        }
        else{
            newFilter = {
                ...filter,
                sort_by: "artist",
                order: e.target.value === "5" ? "asc" : "desc"
            };
        }
        setFilter(newFilter);
        setCurrentPage(1);
        syncURLWithFilter(newFilter, 1);
    }

    const handlefieldFilter = (e, field) => {
        const value = e.target.value;
        const newFilter = {...filter, [field]: value === "-1" ? "" : value};
        setFilter(newFilter);
        setCurrentPage(1);
        syncURLWithFilter(newFilter, 1);
        
        if (field === 'artist') {
            if (value === "-1") {
                getTitles();
            } else {
                getTitles(value);
            }
        }
    }

    const handleReset = () => {
        const newFilter = {
            sort_by: "release_date",
            artist: "",
            title: "",
            type: "",
            order: "desc",
            query: ""
        };
        setFilter(newFilter);
        setCurrentPage(1);
        getTitles();
        setSearchParams({}, { replace: true });
        // Clear cache on reset
        searchCache.current.clear();
        // Trigger search immediately
        setTimeout(() => searchSongs(), 0);
    }

    const handleSearch = () => {
        // Clear debounce timer to trigger search immediately
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        setCurrentPage(1);
        // Skip cache for manual search
        searchSongs(true);
    }

    const handlePageChange = (page) => {
        if (page === '...') return; // Do nothing for ellipsis
        setCurrentPage(page);
        syncURLWithFilter(filter, page);
        window.scrollTo(0, 0);
    }

    // Sync filter when URL parameters change (for browser back/forward)
    useEffect(() => {
        const query = searchParams.get("q") || "";
        const artist = searchParams.get("artist") || "";
        const title = searchParams.get("title") || "";
        const type = searchParams.get("type") || "";
        const sort_by = searchParams.get("sort_by") || "release_date";
        const order = searchParams.get("order") || "desc";
        const page = parseInt(searchParams.get("page")) || 1;
        
        const newFilter = {
            sort_by,
            artist,
            title,
            type,
            order,
            query
        };
        
        // Only update if URL params are different from current filter
        if (JSON.stringify(filter) !== JSON.stringify(newFilter)) {
            setFilter(newFilter);
        }
        
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }, [searchParams]); // Listen to URL changes

    // Generate pagination items with ellipsis
    const paginationRange = getPaginationRange(currentPage, totalPages, 5);

    return (<>
    <section className="header-section w-100">
        <NavBar mode="dark"/>
        <section className="section-text">
            <div className="h2 pt-5 mb-3">{t('search.pageTitle')}</div>
        </section>
    </section>
    <section className="p-4 px-5 pb-5 search-page">
        <h1 className="mb-4">{t('search.title')}</h1>
        <div className="row align-items-center search-top-row">
            <div className="col-12 col-md-8 mb-md-0">
                <SearchBar 
                    mode="light" 
                    width="100%"
                    onSearch={(query) => {
                        // Clear any pending debounce
                        if (debounceTimer.current) {
                            clearTimeout(debounceTimer.current);
                        }
                        const newFilter = {
                            ...filter,
                            artist: '',
                            title: '',
                            type: '',
                            tag: '',
                            query: query
                        };
                        setFilter(newFilter);
                        setCurrentPage(1);
                        syncURLWithFilter(newFilter, 1);
                        // Trigger search immediately without debounce
                        setTimeout(() => searchSongs(true), 0);
                    }}
                    onChange={(query) => {
                        // This will trigger debounced search via the useEffect
                        const newFilter = {
                            ...filter,
                            artist: '',
                            title: '',
                            type: '',
                            tag: '',
                            query: query
                        };
                        setFilter(newFilter);
                        setCurrentPage(1);
                        syncURLWithFilter(newFilter, 1);
                    }}
                    placeholder={t("common.search")}
                />
            </div>
            <div className="col-12 px-3 col-md-4 d-flex align-items-center justify-content-md-end" style={{gap: "10px"}}>
                <label htmlFor="order" style={{whiteSpace: "nowrap"}}>{t('search.orderLabel')}</label>
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
                    <option value="1">{t('search.sortOptions.newToOld')}</option>
                    <option value="2">{t('search.sortOptions.oldToNew')}</option>
                    <option value="3">{t('search.sortOptions.titleAsc')}</option>
                    <option value="4">{t('search.sortOptions.titleDesc')}</option>
                    <option value="5">{t('search.sortOptions.artistAsc')}</option>
                    <option value="6">{t('search.sortOptions.artistDesc')}</option>
                </select>
            </div>
        </div>
        <div className="row pt-3 pb-4 search-filter-row">
            <div className="col-12 col-md-3 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="type" style={{whiteSpace: "nowrap"}}>{t('search.typeLabel')}</label>
                <select 
                    className="form-select rounded-pill" 
                    name="type" 
                    id="type"
                    value={filter.type || "-1"}
                    onChange={e=>handlefieldFilter(e, 'type')}
                >
                    <option value="-1">{t('search.allTypes')}</option>
                    <option value="Transcription">{t(`song.type.Transcription`, "Transcription")}</option>
                    <option value="Arrangement">{t(`song.type.Arrangement`, "Arrangement")}</option>
                </select>
            </div>
            <div className="col-12 col-md-3 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="artist-name" style={{whiteSpace: "nowrap"}}>{t('search.artistLabel')}</label>
                <select 
                    className="form-select rounded-pill" 
                    name="artist-name" 
                    id="artist-name"
                    value={filter.artist || "-1"}
                    onChange={e => handlefieldFilter(e, 'artist')}
                >
                    <option value="-1">{t('search.allArtists')}</option>
                    {artists.map((artist, index)=><option key={index} value={artist}>{t(`song.artist.${artist}`, artist)}</option>)}
                </select>
            </div>
            <div className="col-12 col-md-3 px-3 d-flex align-items-center" style={{gap: "10px"}}>
                <label htmlFor="song-name" style={{whiteSpace: "nowrap"}}>{t('search.songLabel')}</label>
                <select 
                    className="form-select rounded-pill" 
                    name="song-name" 
                    id="song-name"
                    value={filter.title || "-1"}
                    onChange={e => handlefieldFilter(e, 'title')}
                >
                    <option value="-1">{t('search.allSongs')}</option>
                    {titles.map((title, index)=><option key={index} value={title}>{title}</option>)}
                </select>
            </div>
            <div className="col-12 col-md-3 px-3 d-flex align-items-center justify-content-md-end" style={{gap: "2em"}}>
                <button type="button" className="btn btn-light px-4" onClick={handleReset}>{t('common.reset')}</button>
                <button type="button" className="btn btn-dark px-4" onClick={handleSearch}>{t('common.search')}</button>
            </div>
        </div>
        <div className="row row-cols-1 row-cols-lg-3 g-3">
            {!loading && info.map((song, index) => 
                <div className="col my-3" key={index}>
                    <div className="card song-card pointer" onClick={()=>navigate(`/detail?id=${song.id}`)}>
                        <img src={song.cover_url} className="card-img-top" alt="card" style={{height: "15em"}}/>
                        <div className="card-body">
                            <h4 className="card-title">
                                {language === "en" ? song.title :
                                (language === "zh-CN" ? song.title_zhcn : song.title_zhhk)}
                            </h4>
                            <h6 className="card-subtitle text-muted mb-3">{t(`song.artist.${song.artist}`, song.artist)}</h6>
                            {song.release_date && (
                                <div className="card-text text-muted small mb-2">
                                    {song.release_date.split('T')[0]}
                                </div>
                            )}
                            {song.tags && song.tags.length > 0 && (
                                <div className="mb-2">
                                    {song.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className={`badge ${tagBgColors[idx % tagBgColors.length]} bg-gradient me-1`}>{t(`song.type.${tag}`, tag)}</span>
                                    ))}
                                </div>
                            )}
                            <div className="card-text align-items-center view-tag">
                                <span>{t('common.viewMore')} </span>
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!loading && info.length === 0 && 
                <div className="mb-2" style={{fontSize: "1.5rem"}}>{t('search.noResults')}</div>
            }
        </div>
        {!loading && totalPages > 1 && (
            <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            {t('common.previous')}
                        </button>
                    </li>
                    
                    {paginationRange.map((page, idx) => (
                        page === '...' ? (
                            <li key={`ellipsis-${idx}`} className="page-item disabled">
                                <button className="page-link" disabled>...</button>
                            </li>
                        ) : (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(page)}>
                                    {page}
                                </button>
                            </li>
                        )
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            {t('common.next')}
                        </button>
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