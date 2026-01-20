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

        console.log("Bejelentkezés folyamatban...", { email, password });
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
