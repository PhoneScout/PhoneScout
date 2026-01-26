import React from 'react';
import styles from './Login.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import InputText from './InputText';
import { Link } from 'react-router-dom'; // Feltételezve, hogy react-router-dom-ot használsz

export default function Login({ onSwitchToRegister }) {

     const login = async (e) => {
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
            // Salt lekérése az "x" végpontról
            const saltResponse = await fetch(`http://localhost:5175/api/Login/GetSalt/${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!saltResponse.ok) {
                throw new Error("A felhasználóhoz nem található salt (lehet, hogy nem létezik a fiók).");
            }

            const salt = await saltResponse.text(); 

            // Hash generálása a regisztrációval megegyező módon
            const combinedPassword = password + salt;
            const msgBuffer = new TextEncoder().encode(combinedPassword);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Login adatok postolása az "y" végpontra
            const loginData = {
                email: email,
                tmphash: hashedPassword
            };

            const response = await fetch('http://localhost:5175/api/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alertBox.innerText = `Belépési hiba: ${errorText}`;
                return;
            }

            // SIKER
            alertBox.style.color = "green";
            alertBox.innerText = "Sikeres bejelentkezés! Átirányítás...";
            
            // Itt jöhet a token mentése vagy az oldalváltás
            const result = await response.json();
            console.log("Szerver válasza:", result);

        } catch (error) {
            alertBox.style.color = "red";
            alertBox.innerText = "Hiba történt a bejelentkezés során: " + error.message;
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.formContainer}>
                
                <div className={styles.backLinkContainer}>
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                </div>

                <h2 className={styles.mainTitle}>Bejelentkezés</h2>

                <form id='loginForm' onSubmit={login}>
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
