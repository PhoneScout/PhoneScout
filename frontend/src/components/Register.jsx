import React, { useState } from 'react';
import InputText from './InputText';
import styles from './Register.module.css'; // Module import
import { Link } from 'react-router';

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
        <div className={styles.registerContainer}>
            <div className={`${styles.formContainer} ${showBilling ? styles.expanded : ''}`}>
                <div id="responseMessage" className={styles.alert}></div>
                
                {/* Vissza link konténer */}
                <div className={styles.backLinkContainer}>
                    <a href="../fooldal/index.html">
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                    </a>
                </div>

                {/* Fő elrendezés, ami soronként kezeli a bal/jobb oldali tartalmat */}
                <div className={`${styles.formLayout} ${showBilling ? styles.expanded : ''}`}>
                    
                    {/* 1. Sor: Címsorok */}
                    <div className={styles.formRow}>
                        <h2 className={styles.mainTitle}>Regisztráció</h2>
                        {showBilling && <h2 className={styles.billingTitle}>Számlázási adatok</h2>}
                    </div>

                    {/* 2. Sor: Vezetéknév / Irányítószám+Város placeholder */}
                    <div className={styles.formRow}>
                        <div className={styles.inputContainer}>
                            <InputText type='text' id='registerLastName' label='Vezetéknév' />
                        </div>
                        {showBilling && (
                            <div className={styles.inputContainer}>
                                <InputText type='text' id="registerPostalCode" label="Irányítószám"/>
                            </div>
                        )}
                    </div>

                    {/* 3. Sor: Keresztnév / Utca+Házszám placeholder */}
                    <div className={styles.formRow}>
                        <div className={styles.inputContainer}>
                            <InputText type='text' id='registerFirstName' label='Keresztnév' />
                        </div>
                        {showBilling && (
                            <div className={styles.inputContainer}>
                                <InputText type='text' id="registerCity" label="Város"/>
                            </div>
                        )}
                    </div>

                    {/* 4. Sor: Email / Telefonszám placeholder */}
                    <div className={styles.formRow}>
                        <div className={styles.inputContainer}>
                            <InputText type='email' id='registerEmail' label='Email' />
                        </div>
                        {showBilling && (
                            <div className={styles.inputContainer}>
                                <InputText type='text' id="registerStreet" label="Utca"/>
                            </div>
                        )}
                    </div>

                    {/* 5. Sor: Jelszó / Üres hely */}
                    <div className={styles.formRow}>
                        <div className={styles.inputContainer}>
                            <InputText type='password' id='registerPassword' label='Jelszó' />
                        </div>
                        {showBilling && (
                            <div className={styles.inputContainer}>
                                <InputText type='text' id="registerHouseNumber" label="Házszám"/>
                            </div>
                        )}
                    </div>

                    {/* 6. Sor: Jelszó újra / Üres hely */}
                    <div className={styles.formRow}>
                        <div className={styles.inputContainer}>
                            <InputText type='password' id='registerPasswordAgain' label='Jelszó újra' />
                        </div>
                        {showBilling && (
                            <div className={styles.inputContainer}>
                                <InputText type='tel' id="registerPhoneNU" label="Telefonszám"/>
                            </div>
                        )}
                    </div>
                    
                </div> {/* form-layout vége */}

                {/* A checkbox és a gombok a layout alatt helyezkednek el */}
                <div className={styles.checkboxContainer}>
                    <input 
                        type="checkbox" 
                        id="addBillingDetails" 
                        checked={showBilling} 
                        onChange={handleCheckboxChange} 
                    />
                    <label htmlFor="addBillingDetails">Számlázási adatok megadása</label>
                </div>

                <button className={styles.submitButton} onClick={handleRegisterClick}>Regisztráció</button>
                <p id="alertReg"></p>

                <a href="#" className={styles.switchLink} onClick={(e) => handleLinkClick(e, onSwitchToLogin)}>
                    Már van fiókod? Jelentkezz be itt!
                </a>

            </div>
        </div>
    );
}