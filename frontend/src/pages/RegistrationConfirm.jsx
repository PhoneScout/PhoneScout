import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'; // Importáld a useNavigate-et
import './ResigstrationConfirm.css';

export default function RegistrationConfirm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Inicializáld a navigációt
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const name = searchParams.get('name') || 'Felhasználó';
    const email = searchParams.get('email');

    const handleActivation = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:5175/api/Registration?name=${name}&email=${email}`, {
                method: 'GET'
            });

            if(response.ok) {
                setMessage("Sikeres aktiválás! Most már bejelentkezhetsz. Átirányítás...");
                setIsSuccess(true);

                setTimeout(() => {
                    navigate('/bejelentkezes');
                }, 2000);

            } else {
                setMessage("Hiba történt az aktiválás során. Kérjük, próbáld újra később.");
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage("A szerver nem érhető el.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="container_RegistrationConfirm">
            <div className="card_RegistrationConfirm">
                
                <div className="backLink_RegistrationConfirm">
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                </div>

                <h2 className="title_RegistrationConfirm">Fiók aktiválása</h2>

                <p className="infoText_RegistrationConfirm">
                    Kedves <strong>{name}</strong>! <br />
                    Kérjük, erősítsd meg a regisztrációdat az alábbi gombra kattintva.
                </p>
                
                <p className="emailDisplay_RegistrationConfirm">
                    Regisztrált e-mail cím: {email}
                </p>

                <form onSubmit={handleActivation}>
                    <button type='submit' className="submitButton_RegistrationConfirm">
                        Fiók aktiválása
                    </button>
                </form>

                <p className="alert_RegistrationConfirm" style={{ color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </p>

                <Link to="/bejelentkezes" className="switchLink_RegistrationConfirm">
                    Már aktiváltad? Jelentkezz be itt!
                </Link>
            </div>
        </div>
    );
}
