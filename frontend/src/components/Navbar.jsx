import React, { useState, useEffect, useRef } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate importálása
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function Navbar() {

    const { token, logout: authLogout } = useAuth();

    const [previousPages, setPreviousPages] = useState(() => {
        const stored = localStorage.getItem("pagesHistory");
        return stored ? JSON.parse(stored) : [{ pageName: "Főoldal", pageURL: "/" }];
    });

    // Mobile menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    // Ref for mobile menu to detect clicks outside
    const mobileMenuRef = useRef(null);

    // Ref for search dropdown
    const searchBoxRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const mobileSearchBoxRef = useRef(null);
    const mobileSearchDropdownRef = useRef(null);

    // State for search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allPhoneNames, setAllPhoneNames] = useState([]);

    const navigate = useNavigate(); // useNavigate hook

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("pagesHistory", JSON.stringify(previousPages));
    }, [previousPages]);

    // Handle window resize
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

        // Handle escape key
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

    // Load phone names for search
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

    const fetchPhoneNames = async () => {
        try {
            const response = await axios.get("http://localhost:5175/allPhonesName");
            const data = response.data;
            setAllPhoneNames(data);
        } catch (error) {
            console.error("Hiba a telefonnevek betöltésekor:", error);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.length > 0) {
            const filteredResults = allPhoneNames.filter(phone => 
                phone.phoneName.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5); // Limit to 5 results
            setSearchResults(filteredResults);
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    // Open phone page from search result
    const openPhonePage = (phoneID, phoneName) => {
        localStorage.setItem("selectedPhone", phoneID);
        
        // Add to page history
        checkPagesHistory(phoneName, `/telefon/${phoneID}`);
        
        // Navigate to phone page
        navigate(`/telefon/${phoneID}`);
        
        // Clear search
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

    // Handler for page history
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

    // Render pages history
    const pagesHistoryElements = previousPages.map((page, index) => (
        <React.Fragment key={page.pageName}>
            <Link
                to={page.pageURL}
                className="pagesHistory"
                onClick={() => {
                    checkPagesHistory(page.pageName, page.pageURL);
                    closeMobileMenu();
                }}
            >
                <div>{page.pageName}</div>
            </Link>
            {index < previousPages.length - 1 && " / "}
        </React.Fragment>
    ));

    // Cart state
    const [cartCount, setCartCount] = useState(0);

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
        
        // Listen for cart updates if you have a custom event
        const handleCartUpdate = () => updateCartCount();
        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // User state
    const [fullname, setFullname] = useState(null);
    const [jogosultsag, setJogosultsag] = useState(null);

    useEffect(() => {
        const syncUserData = () => {
            setFullname(localStorage.getItem("fullname"));
            setJogosultsag(localStorage.getItem("jogosultsag"));
        };

        syncUserData();
        window.addEventListener('userProfileUpdated', syncUserData);

        return () => {
            window.removeEventListener('userProfileUpdated', syncUserData);
        };
    }, [token]);

    function logout() {
        authLogout();
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("fullname");
        localStorage.removeItem("email")
        localStorage.removeItem("jogosultsag");
        alert("Sikeres kijelentkezés!");
        
        // Reset page history
        setPreviousPages([{ pageName: "Főoldal", pageURL: "/" }]);
        localStorage.removeItem("pagesHistory");
        
        // Navigate to home page
        navigate("/");
        closeMobileMenu();
    }

    // Check if user is logged in
    const isLoggedIn = !!token;

    // Compare count state
    const [compareCount, setCompareCount] = useState(0);

    useEffect(() => {
        function updateCompareCount() {
            const comparePhones = JSON.parse(localStorage.getItem("comparePhones")) || [];
            setCompareCount(comparePhones.length);
        }
        updateCompareCount();
        
        // Listen for compare updates
        const handleCompareUpdate = () => updateCompareCount();
        window.addEventListener('compareUpdated', handleCompareUpdate);
        
        return () => window.removeEventListener('compareUpdated', handleCompareUpdate);
    }, []);

    return (
        <div className="navbar-wrapper">
            {/* Main Navbar */}
            <div className="custom-header">
                {/* Logo and Hamburger */}
                <div className="col-8 col-md-4 col-lg-3 logo-container">
                    <div className="d-flex align-items-center">
                        {/* Hamburger button - visible only on mobile/tablet */}
                        <button 
                            className={`hamburger-btn ${isMobileView ? 'd-block' : 'd-none'}`}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                        
                        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
                            <img src="/images/ImagePhoneScoutLogo.png" alt="PhoneScout Logo" className="logo-img"/>
                            <div className="logo-text blue">Phone</div>
                            <div className="logo-text green">Scout</div>
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation - hidden on mobile */}
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

                {/* Desktop Search - hidden on mobile */}
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
                                        {phone.phoneName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop User/Cart - hidden on mobile */}
                <div className="col-lg-3 user-cart-container d-none d-lg-flex justify-content-end">
                    {isLoggedIn ? (
                        // Logged in user - show dropdown with profile and logout
                        <div className="dropdown" id="dropdownMenu">
                            <a href="#" className="dropdown-toggle userIcon" id="loginDropdown" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <div id="userChange">
                                    <div id="fullName">{fullname}</div>
                                    <div className="user-img-wrapper">
                                        <img src="../Images/doneUserIcon1.png" alt="User"/>
                                    </div>
                                </div>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                                <li><Link to="/profil"><button className="profile_button">Profil</button></Link></li>
                                <li><button className="logout_button" onClick={logout}>Kijelentkezés</button></li>
                            </ul>
                        </div>
                    ) : (
                        // Not logged in - show login link
                        <Link 
                            to="/bejelentkezes" 
                            className="userIcon"
                            id="loginLink"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div id="userChange">
                                <div id="fullName">Bejelentkezés</div>
                                <div className="user-img-wrapper">
                                    <img src="../Images/doneUserIcon1.png" alt="User"/>
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

                {/* Mobile Cart Icon - visible only on mobile */}
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

            {/* Mobile Menu - Fixed position */}
            {isMenuOpen && isMobileView && (
                <div className="mobile-menu-wrapper" ref={mobileMenuRef}>
                    <div className="mobile-menu-content">
                        {/* Close button inside menu */}
                        <button 
                            className="mobile-menu-close" 
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                        
                        {/* Mobile Navigation Links */}
                        <div className="mobile-nav-links">
                            <Link 
                                to="/szures" 
                                className="mobile-menu-point" 
                                onClick={() => {
                                    closeMobileMenu();
                                    checkPagesHistory('Minden telefon', '/szures');
                                }}
                            >
                                <i className="fa-solid fa-mobile-screen-button"></i>
                                Minden telefon
                            </Link>
                            <Link 
                                to="/szerviz" 
                                className="mobile-menu-point"
                                onClick={() => {
                                    closeMobileMenu();
                                    checkPagesHistory('Szerviz', '/szerviz');
                                }}
                            >
                                <i className="fa-solid fa-screwdriver-wrench"></i>
                                Szerviz
                            </Link>
                            <Link 
                                to="/osszehasonlitas" 
                                className="mobile-menu-point"
                                onClick={() => {
                                    closeMobileMenu();
                                    checkPagesHistory('Összehasonlítás', '/osszehasonlitas');
                                }}
                            >
                                <i className="fa-solid fa-code-compare"></i>
                                Összehasonlítás
                            </Link>
                        </div>

                        {/* Mobile Search */}
                        <div className="mobile-search-container">
                            <div className="search-input">
                                <input 
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    onFocus={handleSearchFocus}
                                    placeholder="Keresés..." 
                                    type="text" 
                                    id="mobileSearchBox" 
                                    autoComplete="off"
                                />
                                <div className="search-icon">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                            </div>
                            {showDropdown && searchResults.length > 0 && (
                                <div className={`search-dropdown ${showDropdown ? 'active' : ''}`} style={{marginTop: '10px'}}>
                                    {searchResults.map(phone => (
                                        <div 
                                            key={phone.phoneID}
                                            className="dropdown-item" 
                                            onClick={() => {
                                                openPhonePage(phone.phoneID, phone.phoneName);
                                                closeMobileMenu();
                                            }}
                                        >
                                            {phone.phoneName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile User Section */}
                        <div className="mobile-user-section">
                            <div className="mobile-user-info">
                                <img src="../Images/doneUserIcon1.png" alt="User" className="mobile-user-img"/>
                                <div className="mobile-user-text">
                                    <div className="mobile-user-name">{fullname || "Vendég"}</div>
                                    <div className="mobile-user-status">
                                        {fullname ? "Bejelentkezve" : "Nincs bejelentkezve"}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mobile-user-actions">
                                {fullname ? (
                                    <>
                                        <Link 
                                            to="/profil" 
                                            className="mobile-user-action-btn profile-btn"
                                            onClick={closeMobileMenu}
                                        >
                                            <i className="fa-solid fa-user"></i>
                                            Profil
                                        </Link>
                                        <button 
                                            className="mobile-user-action-btn logout-btn"
                                            onClick={logout}
                                        >
                                            <i className="fa-solid fa-right-from-bracket"></i>
                                            Kijelentkezés
                                        </button>
                                    </>
                                ) : (
                                    <Link 
                                        to="/bejelentkezes" 
                                        className="mobile-user-action-btn login-btn"
                                        onClick={closeMobileMenu}
                                    >
                                        <i className="fa-solid fa-right-to-bracket"></i>
                                        Bejelentkezés
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pages History - Always visible */}
            <div className="container mt-2" id="previousPagesPlace">
                {pagesHistoryElements}
            </div>
        </div>
    );
}