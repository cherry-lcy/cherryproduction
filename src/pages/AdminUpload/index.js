import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

const AdminUpload = () => {
    const [title, setTitle] = useState("");
    const [zhcnTitle, setZhcnTitle] = useState("");
    const [zhhkTitle, setZhhkTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [type, setType] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [tag1, setTag1] = useState("");
    const [tag2, setTag2] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [audioUrl, setAudioUrl] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadingAudio, setUploadingAudio] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log(token)
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const uploadFileToCloudinary = async (file, endpoint, fileType) => {
        const formData = new FormData();
        formData.append(fileType, file);
        formData.append("title", title);
        formData.append("artist", artist);
        const response = await api.upload(endpoint, formData);
        return response;
    };

    const handleAudioUpload = async () => {
        if (!audioFile) return null;
        
        setUploadingAudio(true);
        try {
            const response = await uploadFileToCloudinary(audioFile, "/api/upload-audio", "audio");
            if (response && response.audio_url) {
                setAudioUrl(response.audio_url);
                setMessage("Audio uploaded successfully");
                return response.audio_url;
            } else {
                setError(response?.error || "Failed to upload audio");
                return null;
            }
        } catch (error) {
            console.error('Audio upload error:', error);
            setError(error.message || "Failed to upload audio");
            return null;
        } finally {
            setUploadingAudio(false);
        }
    };

    const handlePdfUpload = async () => {
        if (!pdfFile) return null;
        
        setUploadingPdf(true);
        try {
            const response = await uploadFileToCloudinary(pdfFile, "/api/upload-pdf", "pdf");
            if (response && response.pdf_url) {
                setPdfUrl(response.pdf_url);
                setMessage("PDF uploaded successfully");
                return response.pdf_url;
            } else {
                setError(response?.error || "Failed to upload PDF");
                return null;
            }
        } catch (error) {
            console.error('PDF upload error:', error);
            setError(error.message || "Failed to upload PDF");
            return null;
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleCoverUpload = async () => {
        if (!coverFile) return null;
        
        setUploadingCover(true);
        try {
            const response = await uploadFileToCloudinary(coverFile, "/api/upload-image", "image");
            if (response && response.image_url) {
                setCoverUrl(response.image_url);
                setMessage("Cover uploaded successfully");
                return response.image_url;
            } else {
                setError(response?.error || "Failed to upload cover");
                return null;
            }
        } catch (error) {
            console.error('Cover upload error:', error);
            setError(error.message || "Failed to upload cover");
            return null;
        } finally {
            setUploadingCover(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        if (!title || !artist) {
            setError("Title and Artist are required");
            return;
        }

        if (!audioFile && !audioUrl) {
            setError("Please select an audio file");
            return;
        }

        setLoading(true);

        try {
            let finalAudioUrl = audioUrl;
            let finalPdfUrl = pdfUrl;
            let finalCoverUrl = coverUrl;

            if (audioFile && !audioUrl) {
                finalAudioUrl = await handleAudioUpload();
                if (!finalAudioUrl) {
                    setError("Failed to upload audio");
                    setLoading(false);
                    return;
                }
            }

            if (pdfFile && !pdfUrl) {
                finalPdfUrl = await handlePdfUpload();
            }

            if (coverFile && !coverUrl) {
                finalCoverUrl = await handleCoverUpload();
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("title_zhcn", zhcnTitle !== "" ? zhcnTitle : title);
            formData.append("title_zhhk", zhhkTitle !== "" ? zhhkTitle : title);
            formData.append("artist", artist);
            formData.append("type", type);
            formData.append("release_date", releaseDate);
            formData.append("video_url", videoUrl);
            formData.append("audio_url", finalAudioUrl);
            formData.append("pdf_url", finalPdfUrl || "");
            formData.append("cover_url", finalCoverUrl || "");

            const response = await api.upload("/api/songs", formData);
            
            if (tag1) {
                await api.post(`/api/tags/${title}`, { tag: tag1 });
            }
            if (tag2) {
                await api.post(`/api/tags/${title}`, { tag: tag2 });
            }
            
            if (response && response.error) {
                setError(response.error);
            } else if (response && response.song) {
                setMessage("Song uploaded successfully.");
                setTitle("");
                setZhcnTitle("");
                setZhhkTitle("");
                setArtist("");
                setType("");
                setReleaseDate("");
                setVideoUrl("");
                setAudioFile(null);
                setPdfFile(null);
                setCoverFile(null);
                setAudioUrl("");
                setPdfUrl("");
                setCoverUrl("");
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
            } else {
                setMessage("Song deleted successfully.");
                setTitle("");
                setZhcnTitle("");
                setZhhkTitle("");
                setArtist("");
                setType("");
                setReleaseDate("");
                setVideoUrl("");
                setAudioFile(null);
                setPdfFile(null);
                setCoverFile(null);
                setAudioUrl("");
                setPdfUrl("");
                setCoverUrl("");
                setTag1("");
                setTag2("");
                
                document.getElementById('audio-file').value = '';
                document.getElementById('piece-file').value = '';
                document.getElementById('cover-file').value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.message || "An unexpected error occurred during upload.");
        } finally {
            setDelLoading(false);
        }
    };

    const handleFileChange = (setter, urlSetter) => (e) => {
        const file = e.target.files?.[0] ?? null;
        setter(file);
        if (urlSetter) {
            urlSetter("");
        }
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
                        <label htmlFor="piece-title" className="form-label">
                            Title (简体中文)
                        </label>
                        <input
                            id="piece-title"
                            type="text"
                            className="form-control"
                            value={zhcnTitle}
                            onChange={(e) => setZhcnTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="piece-title" className="form-label">
                            Title (繁體中文)
                        </label>
                        <input
                            id="piece-title"
                            type="text"
                            className="form-control"
                            value={zhhkTitle}
                            onChange={(e) => setZhhkTitle(e.target.value)}
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
                            Audio File <span className="text-danger">*</span>
                        </label>
                        <input
                            id="audio-file"
                            type="file"
                            className="form-control"
                            accept="audio/*"
                            onChange={handleFileChange(setAudioFile, setAudioUrl)}
                            required
                        />
                        {audioFile && (
                            <div className="form-text">
                                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                                {uploadingAudio && " - Uploading..."}
                            </div>
                        )}
                        {audioUrl && (
                            <div className="form-text text-success">
                                ✓ Audio uploaded successfully
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="piece-file" className="form-label">Score File (PDF)</label>
                        <input
                            id="piece-file"
                            type="file"
                            className="form-control"
                            accept="application/pdf,image/*"
                            onChange={handleFileChange(setPdfFile, setPdfUrl)}
                        />
                        {pdfFile && (
                            <div className="form-text">
                                Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                                {uploadingPdf && " - Uploading..."}
                            </div>
                        )}
                        {pdfUrl && (
                            <div className="form-text text-success">
                                ✓ PDF uploaded successfully
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
                            onChange={handleFileChange(setCoverFile, setCoverUrl)}
                        />
                        {coverFile && (
                            <div className="form-text">
                                Selected: {coverFile.name} ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                                {uploadingCover && " - Uploading..."}
                            </div>
                        )}
                        {coverUrl && (
                            <div className="form-text text-success">
                                ✓ Cover uploaded successfully
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
                        disabled={loading || uploadingAudio || uploadingPdf || uploadingCover}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
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