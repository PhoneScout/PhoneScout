import React, { useState } from 'react';
import InputText from './InputText';
import styles from './Register.module.css';
import { Link } from 'react-router';
import axios from 'axios';
import { getCityFromPostalCode } from '../utils/postalCodeUtils';

// Render registration form.
export default function Register({ onSwitchToLogin }) {
    const [showBilling, setShowBilling] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: "",
        color: "red"
    });

    const [password, setPassword] = useState("");

    // Autofill city by postal code.
    const handlePostalCodeChange = async (e) => {
        const postalCode = e.target.value.replace(/\D/g, '').slice(0, 4);
        const cityInput = document.getElementById('registerCity');
        
        if (postalCode.length === 4 && cityInput) {
            try {
                const data = await getCityFromPostalCode(postalCode);
                if (data && data.telepules) {
                    cityInput.value = data.telepules;
                }
            } catch (error) {
                console.log('Irányítószám nem található');
                cityInput.value = '';
            }
        } else if (cityInput) {
            cityInput.value = '';
        }
    };

    // Evaluate password strength.
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

    // Toggle billing section.
    const handleCheckboxChange = (event) => {
        setShowBilling(event.target.checked);
    };

    // Generate random salt.
    function GenerateSalt(SaltLength) {
        const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let salt = "";

        for (let i = 0; i < SaltLength; i++) {
            const randomIndex = Math.floor(Math.random() * karakterek.length);
            salt += karakterek[randomIndex];
        }

        return salt;
    }

    // Submit registration data.
    const handleRegisterClick = async (e) => {
        if (e) e.preventDefault();

        const alertBox = document.getElementById('alertReg');
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
        const billingPostalCode = document.getElementById('registerPostalCode')?.value.trim() || "";
        const billingCity = document.getElementById('registerCity')?.value.trim() || "";
        const billingAddress = document.getElementById('registerAddress')?.value.trim() || "";
        const billingPhoneNumber = document.getElementById('registerPhoneNU')?.value.trim() || "";

        if (!name || !email || !password) {
            alertBox.innerText = "Hiba: A név, email és jelszó mezők kitöltése kötelező!";
            return;
        }

        if (password !== passwordAgain) {
            alertBox.innerText = "Hiba: A két jelszó nem egyezik!";
            return;
        }

        if (showBilling && (!billingPostalCode || !billingCity || !billingAddress || !billingPhoneNumber)) {
            alertBox.innerText = "Hiba: Ha számlázási címet ad meg, minden számlázási mező kitöltése kötelező!";
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
                active: 0,
                billingAddress: showBilling ? {
                    postalCode: Number(billingPostalCode),
                    city: billingCity,
                    address: billingAddress,
                    phoneNumber: Number(billingPhoneNumber),
                    addressType: 0,
                } : null
            };

            const response = await axios.post('http://localhost:5175/api/Registration', userData);

            if (response.status !== 200) {
                const errorText = await response.data;
                alertBox.style.color = "red";
                alertBox.innerText = `Szerver hiba: ${errorText}`;
                return;
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

                    <div className={`${styles.billingWrapper} ${showBilling ? styles.show : ''}`}>
                        <div className={styles.billingInner}>
                            <h2 className={styles.billingTitle}>Számlázási adatok</h2>
                            <div className={styles.formRow}>
                                <InputText type='text' id="registerPostalCode" label="Irányítószám" onChange={handlePostalCodeChange} />
                                <InputText type='text' id="registerCity" label="Város" />
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