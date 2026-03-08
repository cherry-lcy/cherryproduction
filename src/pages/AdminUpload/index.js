import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const AdminUpload = () => {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [type, setType] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const token = localStorage.getItem("adminToken");
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
            const response = await fetch("/api/songs", {
                method: "POST",
                headers: {
                    // Assuming admin_required reads bearer token from Authorization header
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                let errorMessage = "Upload failed.";
                try {
                    const data = await response.json();
                    if (data && data.error) {
                        errorMessage = data.error;
                    }
                } catch (e) {
                    // ignore JSON parse errors
                }
                setError(errorMessage);
                return;
            }

            // On success, you can inspect returned song if needed
            // const data = await response.json();

            setMessage("Song uploaded successfully.");
            setTitle("");
            setArtist("");
            setType("");
            setReleaseDate("");
            setVideoUrl("");
            setAudioFile(null);
            setPdfFile(null);
            setCoverFile(null);
        } catch (e) {
            setError("An unexpected error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <NavBar mode="light" />
        <section className="p-4 px-5 pb-5">
            <h1 className="mb-4">Admin Upload</h1>
            <form onSubmit={handleSubmit} style={{maxWidth: "600px"}}>
                <div className="mb-3">
                    <label htmlFor="piece-title" className="form-label">Title</label>
                    <input
                        id="piece-title"
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="piece-artist" className="form-label">Artist</label>
                    <input
                        id="piece-artist"
                        type="text"
                        className="form-control"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
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
                    <label htmlFor="piece-video" className="form-label">Video URL</label>
                    <input
                        id="piece-video"
                        type="url"
                        className="form-control"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="audio-file" className="form-label">Audio File</label>
                    <input
                        id="audio-file"
                        type="file"
                        className="form-control"
                        onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                    />
                    {audioFile && (
                        <div className="form-text">
                            Selected file: {audioFile.name}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="piece-file" className="form-label">Score File (PDF)</label>
                    <input
                        id="piece-file"
                        type="file"
                        className="form-control"
                        onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                    />
                    {pdfFile && (
                        <div className="form-text">
                            Selected file: {pdfFile.name}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="cover-file" className="form-label">Cover File</label>
                    <input
                        id="cover-file"
                        type="file"
                        className="form-control"
                        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                    />
                    {coverFile && (
                        <div className="form-text">
                            Selected file: {coverFile.name}
                        </div>
                    )}
                </div>
                {error && (
                    <div className="mb-3 text-danger">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-3 text-success">
                        {message}
                    </div>
                )}
                <button type="submit" className="btn btn-dark" disabled={loading}>
                    {loading ? "Uploading..." : "Save"}
                </button>
            </form>
        </section>
        <Footer />
    </>);
};

export default AdminUpload;

