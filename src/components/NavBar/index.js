import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import SearchBar from '../SearchBox';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

const NavBar = ({ mode }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleExternalLink = (url) => {
        window.open(url, "_blank");
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`navbar ${mode === "light" ? "light" : "dark"}`}>
            <div className="navbar-row">
                <div className="navbar-brand" onClick={() => handleNavigation("/")}>
                    CHERRY PRODUCTION
                </div>
                <div className="navbar-content" ref={menuRef}>
                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <i className="bi bi-list"></i>
                    </button>
                    <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
                        <div className="nav" onClick={() => handleNavigation("/search")}>Piano Arrangements</div>
                        <div className="nav" onClick={() => handleExternalLink("https://space.bilibili.com/3546599764527382")}>Bilibili</div>
                        <div className="nav-language">
                            <span className="nav">简</span>
                            <span>/</span>
                            <span className="nav">繁</span>
                        </div>
                        <div className="search-bar-container">
                            <SearchBar mode={mode} width={"100%"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;