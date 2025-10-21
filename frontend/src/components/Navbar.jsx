import React, { useState, useEffect } from 'react';
import logo from '../images/ImagePhoneScoutLogo.png';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './Navbar.css';

export default function Navbar() {
    // Store pages history in state
    const [previousPages, setPreviousPages] = useState(() => {
        // Try to load from localStorage or fallback to default
        const stored = localStorage.getItem("pagesHistory");
        return stored ? JSON.parse(stored) : [{ pageName: "Főoldal", pageURL: "../fooldal/index.html" }];
    });

    // Whenever previousPages changes, save to localStorage
    useEffect(() => {
        localStorage.setItem("pagesHistory", JSON.stringify(previousPages));
    }, [previousPages]);

    // Handler for clicking a page history link
    function checkPagesHistory(name, url) {
        const pageIndex = previousPages.findIndex(p => p.pageName === name);
        let newHistory;

        if (pageIndex === -1) {
            // Add new page at the end
            newHistory = [...previousPages, { pageName: name, pageURL: url }];
        } else {
            // Trim future history after this page
            newHistory = previousPages.slice(0, pageIndex + 1);
        }

        setPreviousPages(newHistory);
    }

    // Render the pages history as links separated by "/"
    const pagesHistoryElements = previousPages.map((page, index) => (
        <React.Fragment key={page.pageName}>
            <a
                href={page.pageURL}
                className="pagesHistory"
                onClick={(e) => {
                    e.preventDefault(); // prevent default navigation for demo purposes
                    checkPagesHistory(page.pageName, page.pageURL);
                }}
            >
                <div>{page.pageName}</div>
            </a>
            {index < previousPages.length - 1 && " / "}
        </React.Fragment>
    ));

    // Example: cart count state and updating it
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem("cart")) || {};
            const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
            setCartCount(itemCount);
        }
        updateCartCount();

        // Optionally listen to storage changes or set interval to update
    }, []);

    // Similar for compare count...

    // showUsername state
    const [firstname, setFirstname] = useState(null);
    const [jogosultsag, setJogosultsag] = useState(null);

    useEffect(() => {
        setFirstname(localStorage.getItem("firstname"));
        setJogosultsag(localStorage.getItem("jogosultsag"));
    }, []);

    function logout() {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("firstname");
        localStorage.removeItem("jogosultsag");
        alert("Sikeres kijelentkezés!");
        setTimeout(() => {
            window.location.href = "./index.html";
        }, 1000);
    }

    return (
        <div>
           <div class="row custom-header">
        <div class="col-3 logo-container">
            <a href="../fooldal/index.html" class="logo-link">
                <img src={logo} alt="PhoneScout Logo" class="logo-img"/>
                <div class="logo-text blue">Phone</div>
                <div class="logo-text green">Scout</div>
            </a>
        </div>

        <div class="col-4 nav-links">
            <a class="menuPoints" href="../szurosoldal/szuro.html">Mind</a>
            <a class="menuPoints" href="../szerviz/szerviz.html"
                onclick="checkPagesHistory('Szerviz','../szerviz/szerviz.html')">Szerviz</a>
            <a href="../osszehasonlitas/osszehasonlitas.html" class="menuPoints" id="osszehasonlitas"
                onclick="checkPagesHistory('Összehasonlítás','../osszehasonlitas/osszehasonlitas.html')">
                Összehasonlítás <span id="compareCount">(0)</span>
            </a>
        </div>

        <div class="col-2 search-container">
            <div class="search-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div class="search-input">
                <input onclick="searchPhonesGET()" placeholder="Keresés..." type="text" id="searchBox" autocomplete="off"/>
                <div class="search-dropdown" id="searchDropdown"></div>
            </div>
        </div>


        <div class="col-3 user-cart-container">
            <div class="dropdown" id="dropdownMenu">
                <a href="#" class="dropdown-toggle userIcon" id="loginDropdown" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <div id="userChange">
                        <div id="firstName">Bejelentkezés</div>
                        <div class="user-img-wrapper">
                            <img src="../Images/doneUserIcon1.png" alt=""/>
                        </div>
                    </div>
                </a>
                <ul class="dropdown-menu" aria-labelledby="loginDropdown">
                    <li><button class="profile_button">Profil</button></li>
                    <li><button class="logout_button" onclick="logout()">Kijelentkezés</button></li>
                </ul>
            </div>

            <div id="loginText">
                <a class="userIcon" href="../login_register/login.html" id="loginLink">
                    <div id="userChange">
                        <div id="firstName">Bejelentkezés</div>
                        <div class="user-img-wrapper">
                            <img src="../Images/doneUserIcon1.png" alt=""/>
                        </div>
                    </div>
                </a>
            </div>

            <div class="cart-icon">
                <a href="../kosar/kosar.html" target="_blank"
                    onclick="checkPagesHistory('Kosár','../kosar/kosar.html')"><i id="cart"
                        class="fa-solid fa-cart-shopping"></i></a>
            </div>
        </div>
    </div>
        </div>
    );
}
