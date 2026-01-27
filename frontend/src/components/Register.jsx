import React, { useState } from 'react';
import InputText from './InputText';
import styles from './Register.module.css';
import { Link } from 'react-router';

export default function Register({ onSwitchToLogin }) {
    // Állapot a checkbox pipálásának követésére.
    const [showBilling, setShowBilling] = useState(false);

    const handleCheckboxChange = (event) => {
        setShowBilling(event.target.checked);
    };

    function GenerateSalt(SaltLength) {
        const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let salt = "";

        for (let i = 0; i < SaltLength; i++) {
            const randomIndex = Math.floor(Math.random() * karakterek.length);
            salt += karakterek[randomIndex];
        }

        return salt;
    }

    const handleRegisterClick = async (e) => {
        if (e) e.preventDefault();

        const alertBox = document.getElementById('alertReg');
        // Alaphelyzetbe állítás minden gombnyomáskor
        alertBox.innerText = "";
        alertBox.style.color = "red";

        const name = document.getElementById('registerName')?.value.trim() || "";
        const email = document.getElementById('registerEmail')?.value.trim() || "";
        const password = document.getElementById('registerPassword')?.value || "";
        const passwordAgain = document.getElementById('registerPasswordAgain')?.value || "";

        if (!name || !email || !password) {
            alertBox.innerText = "Hiba: A név, email és jelszó mezők kitöltése kötelező!";
            return;
        }

        if (password !== passwordAgain) {
            alertBox.innerText = "Hiba: A két jelszó nem egyezik!";
            return;
        }

        try {
            const salt = GenerateSalt(64);

            const combinedPassword = password + salt;
            const msgBuffer = new TextEncoder().encode(combinedPassword);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            let userData = {
                name: name,
                email: email,
                salt: salt,
                hash: hashedPassword,
                privilegeID: 5,
                active: 0
            };

            // if (showBilling) {
            //     userData.postalCode = document.getElementById('registerPostalCode')?.value || "";
            //     userData.city = document.getElementById('registerCity')?.value || "";
            //     userData.street = document.getElementById('registerStreet')?.value || "";
            //     userData.houseNumber = document.getElementById('registerHouseNumber')?.value || "";
            //     userData.phone = document.getElementById('registerPhoneNU')?.value || "";
            // }

            const response = await fetch('http://localhost:5175/api/Registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alertBox.style.color = "red";
                alertBox.innerText = `Szerver hiba: ${errorText}`;
                return;
            }

            alertBox.style.color = "green";
            alertBox.innerText = "Sikeres regisztráció! Aktiválja fiókját megadott email címén!"

            const resMsg = document.getElementById('responseMessage');
            if (resMsg) resMsg.innerText = "";

            setTimeout(() => {
                if (onSwitchToLogin) onSwitchToLogin();
            }, 2000);

        } catch (error) {
            alertBox.style.color = "red";
            alertBox.innerText = "Hálózati hiba történt a szerverrel való kapcsolódáskor.";
        }
    };


    return (
        <div className={styles.registerContainer}>
            <form className={styles.formContainer} onSubmit={handleRegisterClick}>

                <div className={styles.backLinkContainer}>
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                </div>

                <h2 className={styles.mainTitle}>Regisztráció</h2>

                <div className={styles.formLayout}>
                    {/* Alap adatok */}
                    <div className={styles.formRow}>
                        <InputText type='text' id='registerName' label='Név' required />
                    </div>

                    <div className={styles.formRow}>
                        <InputText type='email' id='registerEmail' label='Email' required />
                    </div>

                    <div className={styles.formRow}>
                        <InputText type='password' id='registerPassword' label='Jelszó' required />
                        <InputText type='password' id='registerPasswordAgain' label='Jelszó újra' required />
                    </div>

                    {/* Animált Számlázási Rész */}
                    <div className={`${styles.billingWrapper} ${showBilling ? styles.show : ''}`}>
                        <div className={styles.billingInner}>
                            <h2 className={styles.billingTitle}>Számlázási adatok</h2>
                            <div className={styles.formRow}>
                                <InputText type='text' id="registerCity" label="Város" />
                                <InputText type='text' id="registerPostalCode" label="Irányítószám" />
                            </div>
                            <div className={styles.formRow}>
                                <InputText type='text' id="registerStreet" label="Utca" />
                            </div>
                            <div className={styles.formRow}>
                                <InputText type='tel' id="registerPhoneNU" label="Telefonszám" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        id="addBillingDetails"
                        checked={showBilling}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="addBillingDetails">Számlázási adatok megadása</label>
                </div>

                <button type="submit" className={styles.submitButton}>Regisztráció</button>

                <p id="alertReg" className={styles.alertMessage}></p>

                <button
                    type="button"
                    className={styles.switchLink}
                    onClick={onSwitchToLogin}
                >
                    Már van fiókod? Jelentkezz be itt!
                </button>
            </form>
        </div>

    );
}