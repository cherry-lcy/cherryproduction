import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Piece from "../../assets/Icarus.pdf";
import Song from "../../assets/Icarus.mp3";
import "./index.css";

const Detail = () => {
    const navigate = useNavigate();

    return (<>
        <NavBar mode="light"/>
        <section className="p-4 px-5 pb-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/search">Singer</Link></li>
                    <li className="breadcrumb-item active">Icarus</li>
                </ol>
            </nav>
            <h1 className="mb-3">Icarus</h1>
            <h5 className="text-muted mb-3">ARTMS</h5>
            <div className="d-flex justify-content-start align-items-center mb-3" style={{gap: "1.5rem", fontSize: "18px"}}>
                <span class="badge bg-info text-dark">Arrangement</span>
                <span class="badge bg-primary text-light">ARTMS</span>
            </div>
            <p className="desc mb-4">Last updated: 5/3/2025</p>
            <audio className="mb-3" src={Song} controls></audio>
            <h5 className="mb-2">Video</h5>
            <div className="d-flex align-items-center mb-3">
                <label className="mx-2">Link:</label>
                <button 
                    className="bilibili-icon" 
                    onClick={()=>window.open("https://www.bilibili.com/video/BV1hfA2zgEgt", "_blank")}>
                </button>
            </div>
            <div className="mb-4" style={{ width: '80%', height: '700px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <iframe
                    
                    src="https://www.bilibili.com/video/BV1hfA2zgEgt"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title="Video Viewer"
                />
            </div>
            <h5 className="mb-3">Video</h5>
            <div className="mb-3" style={{ width: '80%', height: '1000px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <iframe
                    src={Piece}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title="PDF Viewer"
                />
            </div>
            <p>If you prefer other format, please contact CherryProduction at Bilibili or Email.</p>
        </section>
        <Footer/>
    </>)
}

export default Detail;