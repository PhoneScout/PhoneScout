import React from 'react'

export default function Navbar() {
  return (
    <div>
<div class="row custom-header">
        <div class="col-3 logo-container">
            <a href="../fooldal/index.html" class="logo-link">
                <img src="../Images/ImagePhoneScoutLogo.png" alt="PhoneScout Logo" class="logo-img"/>
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
  )
}
