import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

const AdminUpload = () => {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [type, setType] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [tag1, setTag1] = useState("");
    const [tag2, setTag2] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log(token)
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("type", type);
        formData.append("release_date", releaseDate);
        formData.append("video_url", videoUrl);

        if (audioFile) {
            formData.append("audio", audioFile);
        }
        if (pdfFile) {
            formData.append("pdf", pdfFile);
        }
        if (coverFile) {
            formData.append("cover", coverFile);
        }

        setLoading(true);

        try {
            const response = await api.upload("/api/songs", formData);
            const response2 = await api.post(`/api/tags/${title}`, {
                "tag": tag1
            });
            const response3 = await api.post(`/api/tags/${title}`, {
                "tag": tag2
            });
            
            if ((response && response.error) || (response2 && response2.error) || (response3 && response3.error)) {
                setError(response.error);
            } else if (response && response.song && response2 && response2.tag && response3 && response3.tag) {
                setMessage("Song uploaded successfully.");
                setTitle("");
                setArtist("");
                setType("");
                setReleaseDate("");
                setVideoUrl("");
                setAudioFile(null);
                setPdfFile(null);
                setCoverFile(null);
                setTag1("");
                setTag2("");
                
                document.getElementById('audio-file').value = '';
                document.getElementById('piece-file').value = '';
                document.getElementById('cover-file').value = '';
            } else {
                setMessage("Song uploaded successfully.");
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message || "An unexpected error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete "${title}" by ${artist}?`)) {
            return;
        }

        setDelLoading(true);

        try {
            const response = await api.delete("/api/songs", {
                "title": title,
                "artist": artist
            });
            
            if ((response && response.error)) {
                setError(response.error);
            } else if (response && response.song) {
                setMessage("Song deleted successfully.");
                setTitle("");
                setArtist("");
                setType("");
                setReleaseDate("");
                setVideoUrl("");
                setAudioFile(null);
                setPdfFile(null);
                setCoverFile(null);
                setTag1("");
                setTag2("");
                
                document.getElementById('audio-file').value = '';
                document.getElementById('piece-file').value = '';
                document.getElementById('cover-file').value = '';
            } else {
                setMessage("Song deleted successfully.");
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message || "An unexpected error occurred during upload.");
        } finally {
            setDelLoading(false);
        }
    };

    const handleFileChange = (setter) => (e) => {
        const file = e.target.files?.[0] ?? null;
        setter(file);
    };

    return (
        <>
            <NavBar mode="light" />
            <section className="p-4 px-5 pb-5">
                <h1 className="mb-4">Admin Upload</h1>
                <div style={{maxWidth: "600px"}}>
                    <div className="mb-3">
                        <label htmlFor="piece-title" className="form-label">
                            Title <span className="text-danger">*</span>
                        </label>
                        <input
                            id="piece-title"
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="piece-artist" className="form-label">
                            Artist <span className="text-danger">*</span>
                        </label>
                        <input
                            id="piece-artist"
                            type="text"
                            className="form-control"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="piece-type" className="form-label">Type</label>
                        <select
                            className="form-select"
                            name="type"
                            id="piece-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">Select type</option>
                            <option value="Arrangement">Arrangement</option>
                            <option value="Transcription">Transcription</option>
                        </select>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="piece-release-date" className="form-label">Release Date</label>
                        <input
                            id="piece-release-date"
                            type="date"
                            className="form-control"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="piece-tag-1" className="form-label">
                            Tag 1
                        </label>
                        <input
                            id="piece-tag-1"
                            type="text"
                            className="form-control"
                            value={tag1}
                            onChange={(e) => setTag1(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="piece-tag-2" className="form-label">
                            Tag 2
                        </label>
                        <input
                            id="piece-tag-2"
                            type="text"
                            className="form-control"
                            value={tag2}
                            onChange={(e) => setTag2(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="piece-video" className="form-label">Video URL</label>
                        <input
                            id="piece-video"
                            type="url"
                            className="form-control"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://bilibili.com/..."
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="audio-file" className="form-label">
                            Audio File
                        </label>
                        <input
                            id="audio-file"
                            type="file"
                            className="form-control"
                            accept="audio/*"
                            onChange={handleFileChange(setAudioFile)}
                            required
                        />
                        {audioFile && (
                            <div className="form-text">
                                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="piece-file" className="form-label">Score File (PDF)</label>
                        <input
                            id="piece-file"
                            type="file"
                            className="form-control"
                            accept=".pdf"
                            onChange={handleFileChange(setPdfFile)}
                        />
                        {pdfFile && (
                            <div className="form-text">
                                Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="cover-file" className="form-label">Cover File</label>
                        <input
                            id="cover-file"
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange(setCoverFile)}
                        />
                        {coverFile && (
                            <div className="form-text">
                                Selected: {coverFile.name} ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    {message && (
                        <div className="alert alert-success" role="alert">
                            {message}
                        </div>
                    )}
                    
                    <button 
                        type="button" 
                        className="btn btn-dark"
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Uploading...
                            </>
                        ) : "Save"}
                    </button>

                    <button 
                        type="button" 
                        className="btn btn-dark mx-3" 
                        disabled={delLoading}
                        onClick={handleDelete}
                    >
                        {delLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Deleting...
                            </>
                        ) : "Delete"}
                    </button>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default AdminUpload;