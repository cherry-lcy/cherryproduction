import {useState} from "react";
import {useNavigate} from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/api/admin", {
                "username": username, 
                "password": password
            });

            let token = "";
            token = response?.token || "";

            console.log("token", token)
            if (token) {
                sessionStorage.setItem("token", token);
            }

            navigate("/admin/upload");
        } catch (e) {
            alert(e);
            setError("Unable to log in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <NavBar mode="light" />
        <section className="p-4 px-5 pb-5">
            <h1 className="mb-4">Admin Login</h1>
            <form onSubmit={handleSubmit} style={{maxWidth: "400px"}}>
                <div className="mb-3">
                    <label htmlFor="admin-username" className="form-label">Username</label>
                    <input
                        id="admin-username"
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="admin-password" className="form-label">Password</label>
                    <input
                        id="admin-password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>
                {error && (
                    <div className="mb-3 text-danger">
                        {error}
                    </div>
                )}
                <button type="submit" className="btn btn-dark" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
        </section>
        <Footer />
    </>);
};

export default AdminLogin;

