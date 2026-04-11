import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

const NavBar = ({ mode }) => {
    const { i18n, t } = useTranslation();
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

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('preferred-language', langCode);
        setMobileMenuOpen(false);
    };

    const getLanguageDisplay = () => {
        const currentLang = i18n.language;
        if (currentLang === 'zh-CN') {
            return { left: 'Eng', right: '繁' };
        } else if (currentLang === 'zh-HK') {
            return { left: '简', right: 'Eng' };
        } else {
            return { left: '简', right: '繁' };
        }
    };

    const languageDisplay = getLanguageDisplay();

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

    const handleLanguageClick = (position) => {
        const currentLang = i18n.language;
        if (position === 'left') {
            if (currentLang === 'zh-CN') {
                changeLanguage('en');
            } else if (currentLang === 'zh-HK') {
                changeLanguage('zh-CN');
            } else {
                changeLanguage('zh-CN');
            }
        } else if (position === 'right') {
            if (currentLang === 'zh-CN') {
                changeLanguage('zh-HK');
            } else if (currentLang === 'zh-HK') {
                changeLanguage('en');
            } else {
                changeLanguage('zh-HK');
            }
        }
    };

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
                        <div className="nav" onClick={() => handleNavigation("/search")}>
                            {t('nav.pianoArrangements')}
                        </div>
                        <div className="nav" onClick={() => handleExternalLink("https://space.bilibili.com/3546599764527382")}>
                            {t('nav.bilibili')}
                        </div>
                        <div className="nav-language">
                            <span 
                                className="nav" 
                                onClick={() => handleLanguageClick('left')}
                            >
                                {languageDisplay.left}
                            </span>
                            <span>/</span>
                            <span 
                                className="nav" 
                                onClick={() => handleLanguageClick('right')}
                            >
                                {languageDisplay.right}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;