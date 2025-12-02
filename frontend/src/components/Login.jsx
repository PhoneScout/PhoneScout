import React from 'react'
import './Login.css';
import 'bootstrap/dist/css/bootstrap.css'
import InputText from './InputText';
import { Link } from 'react-router';

export default function Login({onSwitchToRegister}) {

    function login(){
        console.log("Majd jó lesz")
    }

    return (
        <div class="form-container">
            
            <div className="back-link-container">
                <a href="../fooldal/index.html"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</a>
            </div>

            <div id="responseMessage" class="alert"></div>

            <h2>Bejelentkezés</h2>

            <form id='loginForm' onSubmit={login()}>
                <div class="input-container">
                    <InputText type='email' id='loginEmail' label='Email' />
                </div>
                <div class="input-container">
                    <InputText type='password' id='loginPassword' label='Jelszó' />
                </div>
                <button type='submit'>Bejelentkezés</button>
                <p id="alertLog"></p>
            </form>
            <a href="#" onClick={onSwitchToRegister}>Nincs fiókod? Regisztálj itt!</a>
        </div>
    )
}