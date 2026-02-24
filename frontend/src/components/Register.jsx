import React, { useState } from 'react';
import InputText from './InputText';
import styles from './Register.module.css';
import { Link } from 'react-router';
import axios from 'axios';

export default function Register({ onSwitchToLogin }) {
    // Állapot a checkbox pipálásának követésére.
    const [showBilling, setShowBilling] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: "",
        color: "red"
    });

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAgain, setShowPasswordAgain] = useState(false);


    const checkPasswordStrength = (value) => {
        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        if (!value) {
            setPasswordStrength({ score: 0, label: "", color: "#ccc" });
        } else if (score <= 2) {
            setPasswordStrength({ score, label: "Gyenge", color: "red" });
        } else if (score <= 4) {
            setPasswordStrength({ score, label: "Közepes", color: "orange" });
        } else {
            setPasswordStrength({ score, label: "Erős", color: "green" });
        }
    };

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

        if (passwordStrength.score < 4) {
            alertBox.innerText = "Hiba: A jelszó túl gyenge! Használj nagybetűt, számot és speciális karaktert.";
            return;
        }

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

            const userData = {
                name: name,
                email: email,
                salt: salt,
                hash: hashedPassword,
                privilegeID: 5,
                active: 0
            };

            //Felhasználó regisztrálása
            const response = await axios.post('http://localhost:5175/api/Registration', userData);

            if (response.status !== 200) {
                const errorText = await response.data;
                alertBox.style.color = "red";
                alertBox.innerText = `Szerver hiba: ${errorText}`;
                return;
            }

            // Regisztráció számlázási címmel
            if (showBilling) {
                //ID megszerzése
                const getResponse = await axios.get(`http://localhost:5175/api/Registration/GetId/${email}`);

                if (getResponse.status === 200) {
                    const userId = await getResponse.data;

                    const billingData = {
                        postalCode: document.getElementById('registerPostalCode')?.value || "",
                        city: document.getElementById('registerCity')?.value || "",
                        address: document.getElementById('registerAddress')?.value || "",
                        phoneNumber: document.getElementById('registerPhoneNU')?.value || "",
                        addressType: 0,
                        userId: userId,
                    };

                    // Számlázási adatok feltöltése
                    await axios.post('http://localhost:5175/api/address/PostAddress', billingData);
                }
            }

            alertBox.style.color = "green";
            alertBox.innerText = "Sikeres regisztráció! Aktiválja fiókját megadott email címén!"

            setTimeout(() => {
                if (onSwitchToLogin) onSwitchToLogin();
            }, 2000);

        } catch (error) {
            alertBox.style.color = "red";

            if (error.response) {
                const serverError = error.response.data;
                alertBox.innerText = `Szerver hiba: ${typeof serverError === 'object' ? JSON.stringify(serverError) : serverError}`;
            }
            else if (error.request) {
                alertBox.innerText = "A szerver nem válaszol. Ellenőrizze a hálózatot!";
            }
            else {
                alertBox.innerText = "Hiba történt a kérés feldolgozása közben.";
            }

            console.error("Hiba részletei:", error);
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
                        <div>
                            <InputText
                                type="password"
                                id="registerPassword"
                                label="Jelszó"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    checkPasswordStrength(e.target.value);
                                }}
                                inputStyle={{
                                    borderColor: passwordStrength.color,
                                    backgroundColor: password.length === 0 ? "white" : passwordStrength.color + "20"
                                }}
                            />
                        </div>

                        <div>
                            <InputText
                                type="password"
                                id="registerPasswordAgain"
                                label="Jelszó újra"
                                required
                            />
                        </div>
                    </div>
                    {password && (
                        <div className={styles.passwordStrengthContainer}>
                            <div
                                style={{
                                    background: "#eee",
                                    height: "6px",
                                    borderRadius: "4px",
                                    marginTop: "6px",
                                    width: "calc(100% - 15px)",
                                    maxWidth: "400px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${passwordStrength.score * 20}%`,
                                        height: "100%",
                                        background: passwordStrength.color,
                                        borderRadius: "4px",
                                        transition: "0.3s"
                                    }}
                                />
                            </div>

                            <small style={{ color: passwordStrength.color, display: "block", textAlign: "center", marginTop: "4px" }}>
                                {passwordStrength.label}
                            </small>
                        </div>
                    )}


                    {/* Animált Számlázási Rész */}
                    <div className={`${styles.billingWrapper} ${showBilling ? styles.show : ''}`}>
                        <div className={styles.billingInner}>
                            <h2 className={styles.billingTitle}>Számlázási adatok</h2>
                            <div className={styles.formRow}>
                                <InputText type='text' id="registerCity" label="Város" />
                                <InputText type='text' id="registerPostalCode" label="Irányítószám" />
                            </div>
                            <div className={styles.formRow}>
                                <InputText type='text' id="registerAddress" label="Utca" />
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