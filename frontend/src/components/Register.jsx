import React, { useState } from 'react';
import InputText from './InputText';
import './Register.css'; // Az összes stílust ez a fájl tartalmazza

export default function Register({ onSwitchToLogin }) {
    // Állapot a checkbox pipálásának követésére.
    const [showBilling, setShowBilling] = useState(false);

    const handleCheckboxChange = (event) => {
        setShowBilling(event.target.checked);
    };

    const handleRegisterClick = () => {
        console.log("Regisztráció folyamatban...");
    };

    const handleLinkClick = (event, callback) => {
        event.preventDefault();
        callback();
    };

    return (
        <div className={`form-container ${showBilling ? 'expanded' : ''}`}>
            <div id="responseMessage" className="alert"></div>
            
            {/* Vissza link konténer */}
            <div className="back-link-container">
                <a href="../fooldal/index.html">
                    <i className="fa-solid fa-arrow-left"></i> Vissza az oldalra
                </a>
            </div>

            {/* Fő elrendezés, ami soronként kezeli a bal/jobb oldali tartalmat */}
            <div>
                
                {/* 1. Sor: Címsorok */}
                <div className="form-row header-row">
                    <h2 className="main-title">Regisztráció</h2>
                    {showBilling && <h2 className="billing-title">Számlázási adatok</h2>}
                </div>

                {/* 2. Sor: Vezetéknév / Irányítószám+Város placeholder */}
                <div className="form-row">
                    <div className="input-container">
                        <InputText type='text' id='registerLastName' label='Vezetéknév' />
                    </div>
                    {showBilling && (
                        <div className="input-container">
                            <InputText type='text' id="registerPostalCode" label="Irányítószám"/>

                        </div>
                    )}
                </div>

                {/* 3. Sor: Keresztnév / Utca+Házszám placeholder */}
                <div className="form-row">
                    <div className="input-container">
                        <InputText type='text' id='registerFirstName' label='Keresztnév' />
                    </div>
                    {showBilling && (
                         <div className="input-container">
                            <InputText type='text' id="registerCity" label="Város"/>
                        </div>
                    )}
                </div>

                {/* 4. Sor: Email / Telefonszám placeholder */}
                <div className="form-row">
                    <div className="input-container">
                        <InputText type='email' id='registerEmail' label='Email' />
                    </div>
                    {showBilling && (
                        <div className="input-container">
                            <InputText type='text' id="registerStreet" label="Utca"/>
                        </div>
                    )}
                </div>

                {/* 5. Sor: Jelszó / Üres hely */}
                <div className="form-row">
                    <div className="input-container">
                        <InputText type='password' id='registerPassword' label='Jelszó' />
                    </div>
                    {showBilling && (
                        <div className="input-container">
                            <InputText type='text' id="registerHouseNumber" label="Házszám"/>
                        </div>
                        )}
                </div>

                {/* 6. Sor: Jelszó újra / Üres hely */}
                <div className="form-row">
                    <div className="input-container">
                        <InputText type='password' id='registerPasswordAgain' label='Jelszó újra' />
                    </div>
                    {showBilling && (
                        <div className="input-container">
                            <InputText type='tel' id="registerPhoneNU" label="Telefonszám"/>
                        </div>
                        )}
                </div>

                {/* A tényleges számlázási inputokat elhelyezheted a placeholder-ök helyett, ha szükséges */}
                
            </div> {/* form-layout vége */}

            {/* A checkbox és a gombok a layout alatt helyezkednek el */}
            <div className="checkbox-container">
                <input 
                    type="checkbox" 
                    id="addBillingDetails" 
                    checked={showBilling} 
                    onChange={handleCheckboxChange} 
                />
                <label htmlFor="addBillingDetails">Számlázási adatok megadása</label>
            </div>

            <button onClick={handleRegisterClick}>Regisztráció</button>
            <p id="alertReg"></p>

            <a href="#" onClick={(e) => handleLinkClick(e, onSwitchToLogin)}>
                Már van fiókod? Jelentkezz be itt!
            </a>

        </div>
    );
}
