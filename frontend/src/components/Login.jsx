import React from 'react'
import styles from './Login.module.css'; // Module import
import 'bootstrap/dist/css/bootstrap.css'
import InputText from './InputText';
import { Link } from 'react-router';

export default function Login({onSwitchToRegister}) {

    function login(){
        console.log("Majd jó lesz")
    }

    return (
        <div className={styles.loginContainer}> {/* Használd a styles osztályt */}
            <div className={styles.formContainer}>
                
                <div className={styles.backLinkContainer}>
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                </div>

                <div id="responseMessage" className={styles.alert}></div>

                <h2>Bejelentkezés</h2>

                <form id='loginForm' onSubmit={login()}>
                    <div className={styles.inputContainer}>
                        <InputText type='email' id='loginEmail' label='Email' />
                    </div>
                    <div className={styles.inputContainer}>
                        <InputText type='password' id='loginPassword' label='Jelszó' />
                    </div>
                    <button type='submit' className={styles.submitButton}>Bejelentkezés</button>
                    <p id="alertLog"></p>
                </form>
                <a href="#" onClick={onSwitchToRegister} className={styles.switchLink}>Nincs fiókod? Regisztálj itt!</a>
            </div>
        </div>
    )
}