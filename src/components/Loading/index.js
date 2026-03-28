import "./index.css";

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="text-center icon-container">
                <div className="loading-spinner">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div className="loading-text">Loading...</div>
            </div>
        </div>
    );
};

export default Loading;