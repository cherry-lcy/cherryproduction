import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SideBar from "../../components/SideBar";
import Loading from "../../components/Loading";
import Api from "../../utils/api";
import "./index.css";

const Detail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({});
    const [tags, setTags] = useState([]);
    const [pdfViewerUrl, setPdfViewerUrl] = useState("");

    const id = searchParams.get("id");
    // Helper function to extract public ID from Cloudinary URL
    const extractPublicId = (url) => {
        if (!url) return null;
        
        // Match pattern: /upload/v{timestamp}/path/to/file.pdf
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
        if (match) {
            return match[1];
        }
        return null;
    };

    // Helper function to get viewable PDF URL using Cloudinary API
    const getCloudinaryPdfViewerUrl = (pdfUrl) => {
        if (!pdfUrl) return '';
        
        const publicId = extractPublicId(pdfUrl);
        if (publicId) {
            // Use Cloudinary's API endpoint with attachment=false for inline viewing
            return `https://api.cloudinary.com/v1_1/dmbzvxqe9/raw/download?api_key=647627751715269&public_id=${encodeURIComponent(publicId)}&attachment=false`;
        }
        
        return pdfUrl;
    };

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

            if (response.data.pdf_url) {
                const viewerUrl = getCloudinaryPdfViewerUrl(response.data.pdf_url);
                setPdfViewerUrl(viewerUrl);
            }
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
    return (<>
        <SideBar link={info.video_url ? info.video_url : ''}/>
        <NavBar mode="light"/>
        <section className="p-4 px-5 pb-5 detail-page">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/search">{info.type ? info.type : ""}</Link></li>
                    <li className="breadcrumb-item active">{info.title ? info.title : ''}</li>
                </ol>
            </nav>
            <h1 className="mb-3">{info.title ? info.title : ''}</h1>
            <h5 className="text-muted mb-3">{info.artist? info.artist : ''}</h5>
            <div className="d-flex justify-content-start align-items-center mb-3" style={{gap: "1.5rem", fontSize: "18px"}}>
                {!loading && tags.map((tag, id)=>{
                    return id % 2 === 0 ? 
                    <span className="badge bg-info text-dark">{tag.tag}</span>:
                    <span className="badge bg-primary text-light">{tag.tag}</span>
                })}
            </div>
            <p className="desc mb-4">Last updated: {info.release_date ? info.release_date : "/"}</p>
            <audio className="mb-3" src={info.audio_url ? info.audio_url : ""} controls></audio>
            <h5 className="mb-2">Video</h5>
            <div className="mb-4 detail-media detail-video" style={{ height: '700px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <iframe
                    src={info.video_url ? info.video_url : ""}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title="Video Viewer"
                />
            </div>
            <h5 className="mb-3">Score</h5>
            <div className="mb-3 detail-media detail-pdf" style={{ height: '1000px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <iframe
                    src={info.pdf_url ? info.pdf_url : ''}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title="PDF Viewer"
                />
            </div>
            <p>If you prefer other format, please contact CherryProduction at Bilibili or Email.</p>
        </section>
        <Footer/>
        {loading && <Loading/>}
    </>)
}

export default Detail;