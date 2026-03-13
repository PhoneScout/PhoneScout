import React, { useState, useEffect, useRef } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Render navigation.
export default function Navbar() {

    const { token, logout: authLogout } = useAuth();

    const [previousPages, setPreviousPages] = useState(() => {
        const stored = localStorage.getItem("pagesHistory");
        return stored ? JSON.parse(stored) : [{ pageName: "Főoldal", pageURL: "/" }];
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    const mobileMenuRef = useRef(null);

    const searchBoxRef = useRef(null);
    const searchDropdownRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allPhoneNames, setAllPhoneNames] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigate = useNavigate();

    // Save history.
    useEffect(() => {
        localStorage.setItem("pagesHistory", JSON.stringify(previousPages));
    }, [previousPages]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            if (width > 992) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle click outside mobile menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (isMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('.hamburger-btn')) {
                setIsMenuOpen(false);
            }
        }

        // Close the mobile menu on escape.
        function handleEscapeKey(event) {
            if (event.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMenuOpen]);

    // Load search data.
    useEffect(() => {
        fetchPhoneNames();
    }, []);

    // Handle click outside search dropdown
    useEffect(() => {
        function handleClickOutsideSearch(event) {
            if (searchBoxRef.current &&
                searchDropdownRef.current &&
                !searchBoxRef.current.contains(event.target) &&
                !searchDropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutsideSearch);
        return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
    }, []);

    // Load phone names for search.
    const fetchPhoneNames = async () => {
        try {
            const response = await axios.get("http://localhost:5175/allPhonesName");
            const data = response.data;
            setAllPhoneNames(data);
        } catch (error) {
            console.error("Hiba a telefonnevek betöltésekor:", error);
        }
    };

    // Filter phone names by query.
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 0) {
            const filteredResults = allPhoneNames.filter(phone =>
                phone.phoneName.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setSearchResults(filteredResults);
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    // Open a phone from search results.
    const openPhonePage = (phoneID, phoneName) => {
        localStorage.setItem("selectedPhone", phoneID);
        checkPagesHistory(phoneName, `/telefon/${phoneID}`);
        navigate(`/telefon/${phoneID}`);
        setSearchQuery('');
        setShowDropdown(false);
    };

    // Handle search box focus
    const handleSearchFocus = () => {
        if (searchQuery.length > 0) {
            setShowDropdown(true);
        }
    };

    // Check if mobile view
    const isMobileView = windowWidth <= 992;

    // Update history.
    function checkPagesHistory(name, url) {
        const pageIndex = previousPages.findIndex(p => p.pageName === name);
        let newHistory;

        if (pageIndex === -1) {
            newHistory = [...previousPages, { pageName: name, pageURL: url }];
        } else {
            newHistory = previousPages.slice(0, pageIndex + 1);
        }

        setPreviousPages(newHistory);
    }

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close mobile menu
    const closeMobileMenu = () => {
        if (isMobileView) {
            setIsMenuOpen(false);
        }
    };

    const [cartCount, setCartCount] = useState(0);

    // Sync cart count.
    useEffect(() => {
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            let itemCount = 0;
            if (Array.isArray(cart)) {
                itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            } else {
                itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
            }
            setCartCount(itemCount);
        }
        updateCartCount();

        // React to cart changes.
        const handleCartUpdate = () => updateCartCount();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const [fullname, setFullname] = useState(null);

    // Sync user data.
    useEffect(() => {
        const syncUserData = () => {
            setFullname(localStorage.getItem("fullname"));
        };

        syncUserData();
        window.addEventListener('userProfileUpdated', syncUserData);

        return () => {
            window.removeEventListener('userProfileUpdated', syncUserData);
        };
    }, [token]);

    // Log out user.
    function logout() {
        authLogout();
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("fullname");
        localStorage.removeItem("email")
        localStorage.removeItem("jogosultsag");
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 2000);

        setPreviousPages([{ pageName: "Főoldal", pageURL: "/" }]);
        localStorage.removeItem("pagesHistory");

        navigate("/");
        closeMobileMenu();
    }

    const isLoggedIn = !!token;

    const [compareCount, setCompareCount] = useState(0);

    // Sync compare count.
    useEffect(() => {
        function updateCompareCount() {
            const comparePhones = JSON.parse(localStorage.getItem("comparePhones")) || [];
            setCompareCount(comparePhones.length);
        }
        updateCompareCount();

        // React to compare changes.
        const handleCompareUpdate = () => updateCompareCount();
        window.addEventListener('compareUpdated', handleCompareUpdate);

        return () => window.removeEventListener('compareUpdated', handleCompareUpdate);
    }, []);

    return (
        <div className="navbar-wrapper">
            {showSuccessModal && (
                <div
                    className="position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-success shadow-sm"
                    role="alert"
                    style={{ zIndex: 2000 }}
                >
                    Sikeres kijelentkezés!
                </div>
            )}

            <div className="custom-header">
                <div className="col-8 col-md-4 col-lg-3 logo-container">
                    <div className="d-flex align-items-center">
                        <button
                            className={`hamburger-btn ${isMobileView ? 'd-block' : 'd-none'}`}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>

                        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
                            <img src="/images/ImagePhoneScoutLogo.png" alt="PhoneScout Logo" className="logo-img" />
                            <div className="logo-text blue">Phone</div>
                            <div className="logo-text green">Scout</div>
                        </Link>
                    </div>
                </div>

                <div className="col-lg-4 NavBarCol nav-links d-none d-lg-flex">
                    <Link
                        to="/szures"
                        className="menuPoints"
                        onClick={() => {
                            closeMobileMenu();
                            checkPagesHistory('Minden telefon', '/szures');
                        }}
                    >
                        Minden telefon
                    </Link>
                    <Link
                        to="/szerviz"
                        className="menuPoints"
                        onClick={() => {
                            closeMobileMenu();
                            checkPagesHistory('Szerviz', '/szerviz');
                        }}
                    >
                        Szerviz
                    </Link>
                    <Link
                        to="/osszehasonlitas"
                        className="menuPoints"
                        id="osszehasonlitas"
                        onClick={() => {
                            closeMobileMenu();
                            checkPagesHistory('Összehasonlítás', '/osszehasonlitas');
                        }}
                    >
                        Összehasonlítás <span id="compareCount">({compareCount})</span>
                    </Link>
                </div>

                <div className="col-lg-2 search-container d-none d-lg-flex">
                    <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="search-input" ref={searchBoxRef}>
                        <input
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={handleSearchFocus}
                            placeholder="Keresés..."
                            type="text"
                            id="searchBox"
                            autoComplete="off"
                        />
                        {showDropdown && searchResults.length > 0 && (
                            <div className={`search-dropdown ${showDropdown ? 'active' : ''}`} ref={searchDropdownRef}>
                                {searchResults.map(phone => (
                                    <div
                                        key={phone.phoneID}
                                        className="dropdown-item"
                                        onClick={() => openPhonePage(phone.phoneID, phone.phoneName)}
                                    >
                                        <img
                                            src={`http://localhost:5175/api/blob/GetIndex/${phone.phoneID}`}
                                            alt={phone.phoneName}
                                            className="search-result-thumb"
                                            loading="lazy"
                                        />
                                        <span className="search-result-name">{phone.phoneName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-3 user-cart-container d-none d-lg-flex justify-content-end">
                    {isLoggedIn ? (
                        <div className="dropdown" id="dropdownMenu">
                                <button type="button" className="dropdown-toggle userIcon" id="loginDropdown" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                <div id="userChange">
                                    <div id="fullName">{fullname}</div>
                                    <div className="user-img-wrapper">
                                        <img src="../Images/doneUserIcon1.png" alt="User" />
                                    </div>
                                </div>
                                </button>
                            <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                                <li><Link to="/profil"><button className="profile_button">Profil</button></Link></li>
                                <li><button className="logout_button" onClick={logout}>Kijelentkezés</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link
                            to="/bejelentkezes"
                            className="userIcon"
                            id="loginLink"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div id="userChange">
                                <div id="fullName">Bejelentkezés</div>
                                <div className="user-img-wrapper">
                                    <img src="../Images/doneUserIcon1.png" alt="User" />
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="cart-icon">
                        <Link
                            to="/kosar"
                            onClick={() => {
                                checkPagesHistory('Kosár', '/kosar');
                                closeMobileMenu();
                            }}
                        >
                            <i id="cart" className="fa-solid fa-cart-shopping"></i>
                            <span className="cart-badge">{cartCount > 0 ? cartCount : '0'}</span>
                        </Link>
                    </div>
                </div>

                <div className="col-4 col-md-8 col-lg-0 d-flex d-lg-none justify-content-end align-items-center">
                    <div className="cart-icon mobile-cart">
                        <Link
                            to="/kosar"
                            onClick={() => {
                                checkPagesHistory('Kosár', '/kosar');
                                closeMobileMenu();
                            }}
                        >
                            <i id="cart" className="fa-solid fa-cart-shopping"></i>
                            <span className="cart-badge">{cartCount > 0 ? cartCount : '0'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}