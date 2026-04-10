import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import CherryBg from "../../assets/cherry-pattern-wallpaper.webp";
import WordCloudComponent from "../../components/WordCloud";
import Footer from "../../components/Footer";
import Api from "../../utils/api";
import { words } from "../../utils/constant";
import "./index.css";

const Home = () => {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [tags, setTags] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSongs() {
            try {
                setLoading(true);
                const response = await Api.get("/api/songs/search?sort_by=release_date&order=desc&limit=3");
                const fetchedSongs = response.data.songs;
                setSongs(fetchedSongs);
                
                const tagsMap = {};
                for (const song of fetchedSongs) {
                    const res = await Api.get(`/api/tag/${song.id}`);
                    tagsMap[song.id] = res.tags;
                }
                setTags(tagsMap);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        getSongs();
    }, []);

    useEffect(() => {
        console.log(songs);
    }, [songs]);

    const SkeletonCard = () => (
        <div className="card col-4 song-card pointer skeleton-card">
            <div className="card-body pt-4 pb-4">
                <div className="skeleton-title"></div>
                <div className="skeleton-subtitle mb-4"></div>
                <div className="skeleton-tags">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <NavBar mode="light"/>
            <section>
                <img 
                    className="w-100 section-image" 
                    src={CherryBg}
                    alt="Cherry background"
                />
            </section>
            <section className="p-4 px-5"> 
                <h1 className="mb-4">About</h1>
                <p className="mb-3">
                    Cherry Production, fueled by love, amateur arrangement and transcription.
                    <br/>
                    Adapt favorite K-pop songs; submissions and recommendations are welcome.
                </p>
                <p className="mb-3">
                    Bilibili: CherryProduction
                    <br/>
                    Email: @qq.com
                </p>
            </section>
            <section className="w-100 row p-4 px-5 home-intro-row"> 
                <div className="col-12 col-md-6 mb-3"> 
                    <WordCloudComponent words={words} width={"100%"} height={"100%"}/>
                </div>
                <div className="col-12 col-md-6"> 
                    <section className="px-5"> 
                        <h1 className="mb-4">Piano Arrangements</h1>
                        <p className="mb-3">Committed to transcribing/arranging K-POP songs:</p>
                        <ul className="features mb-5"> 
                            <li>Preserving the original style to the fullest</li>
                            <li>Crafting playable arrangements</li>
                            <li>With rich and intricate textures</li>
                        </ul>
                        <button type="button" className="btn btn-light" onClick={() => navigate("/search")}>
                            Learn more
                        </button>
                    </section>
                </div>
            </section>
            <section className="w-100 p-4 px-5 pb-5"> 
                <h2 className="mb-4 pointer" onClick={() => navigate("/search")}>Latest Arrangements/Transcriptions</h2>
                <div className="row position-relative home-latest-row" style={{gap: "0.5rem", flexWrap: "nowrap"}}>
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        songs && songs.map((song, index) => (
                            <div key={song.id || index} className="card col-12 col-md-4 song-card pointer">  
                                <div className="card-body pt-4 pb-4" onClick={() => navigate(`/detail?id=${song.id}`)}> 
                                    <h4 className="card-title">{song.title}</h4>
                                    <h6 className="card-subtitle mb-4 text-muted">{song.artist}</h6>
                                    <div>
                                        {tags[song.id] && 
                                            tags[song.id].map((tag, tagIndex) => (
                                                <span key={tagIndex} className="tag">{tag.tag}</span>  
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div style={{width: "0 !important"}}>
                        <i 
                            className="bi bi-chevron-right" 
                            style={{
                                width: "auto !important",
                                position: "absolute",
                                right: "-2rem",
                                top: "45%",
                                cursor: "pointer",
                                height: "0 !important"
                            }}
                            onClick={() => navigate("/search")}
                        />
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
}

export default Home;