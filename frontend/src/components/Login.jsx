import React from 'react';
import styles from './Login.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import InputText from './InputText';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Render the login form.
export default function Login({ onSwitchToRegister }) {

    const navigate = useNavigate();
    const { login: authLogin } = useAuth(); 

    // Format API error messages.
    const getApiErrorMessage = (error, fallback) => {
        const status = error?.response?.status;
        const responseData = error?.response?.data;

        if (typeof responseData === 'string' && responseData.trim()) {
            return responseData;
        }

        if (typeof responseData?.message === 'string' && responseData.message.trim()) {
            return responseData.message;
        }

        switch (status) {
            case 400:
                return 'Hibás email cím vagy jelszó.';
            case 401:
                return 'Hibás email cím vagy jelszó.';
            case 404:
                return 'Hibás email cím vagy jelszó.';
            case 429:
                return 'Túl sok próbálkozás történt. Kérjük, próbálja újra később.';
            case 500:
                return 'Szerverhiba történt. Kérjük, próbálja újra később.';
            default:
                if (error?.code === 'ERR_NETWORK') {
                    return 'Nem sikerült kapcsolódni a szerverhez. Ellenőrizze az internetkapcsolatot.';
                }
                return fallback;
        }
    };

    // Submit login credentials.
    const handleLogin = async (e) => {    
        if (e) e.preventDefault();

        const alertBox = document.getElementById('alertLog');
        alertBox.innerText = "";
        alertBox.style.color = "red";

        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!email || !password) {
            alertBox.innerText = "Hiba: Minden mezőt töltsön ki!";
            return;
        }

        try {
            const saltResponse = await axios.get(`http://localhost:5175/api/Login/GetSalt/${encodeURIComponent(email)}`);

            if (saltResponse.status !== 200) {
                throw new Error("Hibás email cím vagy jelszó.");
            }

            let salt = await saltResponse.data;

            if (salt.startsWith('"') && salt.endsWith('"')) {
                try {
                    salt = JSON.parse(salt);
                } catch (e) {
                    salt = salt.slice(1, -1);
                }
            }


            const combinedPassword = password + salt;
            const msgBuffer = new TextEncoder().encode(combinedPassword);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');


            const loginData = {
                email: email,
                tmpHash: hashedPassword
            };

            const response = await axios.post('http://localhost:5175/api/Login',loginData);

            if (response.status !== 200) {
                const errorText = await response.data;
                alertBox.innerText = `Belépési hiba: ${errorText}`;
                return;
            }

            alertBox.style.color = "green";
            alertBox.innerText = "Sikeres bejelentkezés! Átirányítás...";

            const result = await response.data;
            console.info("Sikeres bejelentkezés.");

            if (result.token) {
                authLogin(result.token);
                localStorage.setItem("fullname", result.fullName || "Felhasználó"); 
                localStorage.setItem("email", result.email || "Email"); 
            }

            setTimeout(() => {
                navigate('/')
            }, 2000);

        } catch (error) {
            const errorMessage = getApiErrorMessage(error, "Hiba történt a bejelentkezés során.");
            console.error(errorMessage);
            alertBox.style.color = "red";
            alertBox.innerText = errorMessage;
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.formContainer}>

                <div className={styles.backLinkContainer}>
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                </div>

                <h2 className={styles.mainTitle}>Bejelentkezés</h2>

                <form id='loginForm' onSubmit={handleLogin}>
                    <div className={styles.formLayout}>
                        <div className={styles.inputContainer}>
                            <InputText type='email' id='loginEmail' label='Email' required />
                        </div>
                        <div className={styles.inputContainer}>
                            <InputText type='password' id='loginPassword' label='Jelszó' required />
                        </div>
                    </div>

                    <button type='submit' className={styles.submitButton}>Bejelentkezés</button>

                    <p id="alertLog" className={styles.alertMessage}></p>

                    <Link to="/elfelejtettjelszo" className={styles.switchLink} style={{display: 'inline-block', marginRight: '10px'}}>
                        Elfelejtett jelszó?
                    </Link>

                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className={styles.switchLink}
                    >
                        Nincs fiókod? Regisztrálj itt!
                    </button>


                </form>
            </div>
        </div>
    )
}
