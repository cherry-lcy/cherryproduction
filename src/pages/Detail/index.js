import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SideBar from "../../components/SideBar";
import Loading from "../../components/Loading";
import Api from "../../utils/api";
import NotFound from "../NotFound";
import { useLanguage } from "../../contexts/LanguageContext";
import "./index.css";

const Detail = () => {
    const {t, language} = useLanguage();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({});
    const [tags, setTags] = useState([]);

    const id = searchParams.get("id");

    useEffect(()=>{
        setLoading(true);
        if(!id){
            setLoading(false);
            navigate("/search");
            return;
        }
    
        async function getSongDetail(){
            const response = await Api.get(`/api/song/${id}`);
            setInfo(response.data);
        }

        async function getTags(){
            const response = await Api.get(`/api/tag/${id}`);
            setTags(response.tags);
        }

        Promise.all([getSongDetail(), getTags()]).then(()=>{
            setLoading(false);
        })
    }, [id, navigate])

    useEffect(()=>{
        console.log(tags, info);
    }, [tags, info])

    if (!loading && (!info || !info.id || !tags)) {
        return <NotFound />;
    }

    return (<>
        <SideBar link={info.video_url ? info.video_url : ''} songId={id}/>
        <NavBar mode="light"/>
        <section className="p-4 px-5 pb-5 detail-page">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">{t("common.home")}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/search?type=${info.type}&sort_by=release_date&order=desc`}>
                        {info.type ? 
                            (info.type === "Transcription" ? t("detail.transcriptions") : t("detail.arrangements")) 
                        : ""}
                    </Link></li>
                    <li className="breadcrumb-item active">
                        {info.title ? (language === "en" ? info.title :
                            (language === "zh-CN" ? info.title_zhcn : info.title_zhhk)
                        ) 
                        : ''}
                    </li>
                </ol>
            </nav>
            <h1 className="mb-3">
                {info.title ? (language === "en" ? info.title :
                    (language === "zh-CN" ? info.title_zhcn : info.title_zhhk)
                ) 
                : ''}
            </h1>
            <h5 className="text-muted mb-3">{info.artist? info.artist : ''}</h5>
            <div className="d-flex justify-content-start align-items-center mb-3" style={{gap: "1.5rem", fontSize: "18px"}}>
                {!loading && tags.map((tag, id)=>{
                    return id % 2 === 0 ? 
                    <span className="badge bg-info text-dark" key={id}>{t(`song.type.${tag.tag}`, tag.tag)}</span>:
                    <span className="badge bg-primary text-light" key={id}>{t(`song.type.${tag.tag}`, tag.tag)}</span>
                })}
            </div>
            <p className="desc mb-4">{t("detail.lastUpdated")}: {info.release_date ? info.release_date.split('T')[0] : "/"}</p>
            <audio className="mb-3" src={info.audio_url ? info.audio_url : ""} controls></audio>
            <h4 className="mb-2">{t("detail.video")}</h4>
            <div className="mb-4 detail-media detail-video" style={{ height: '700px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <iframe
                    src={info.video_url ? info.video_url : ""}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title="Video Viewer"
                />
            </div>
            <h4 className="mb-3">{t("detail.score")}</h4>
            <p>{t("detail.score-save")}</p>
            <div 
                className="mb-3 detail-media detail-pdf" 
                style={{ 
                    height: '1000px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    backgroundColor: '#f5f5f5'
                }}
            >
                {info.pdf_url ? (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        minHeight: 'min-content'
                    }}>
                        <img 
                            src={info.pdf_url} 
                            alt={`${info.title} score`}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const errorDiv = document.createElement('div');
                                errorDiv.style.padding = '20px';
                                errorDiv.style.textAlign = 'center';
                                errorDiv.style.color = '#666';
                                errorDiv.innerText = 'Unable to load score image. Please contact CherryProduction for assistance.';
                                e.target.parentElement.appendChild(errorDiv);
                            }}
                        />
                    </div>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        {t("detail.noScore")}
                    </div>
                )}
            </div>
            <p>{t("detail.otherFormat")}</p>
        </section>
        <Footer/>
        {loading && <Loading/>}
    </>)
}

export default Detail;