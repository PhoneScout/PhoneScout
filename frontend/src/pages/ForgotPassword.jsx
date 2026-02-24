import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputText from '../components/InputText';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // State-ek a beviteli mezőkhöz
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });
    const [emailInput, setEmailInput] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    // URL paraméterek
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0, label: "", color: "#ccc"
    });

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

    const hashPassword = async (password, salt) => {
        const combinedPassword = password + salt;
        const msgBuffer = new TextEncoder().encode(combinedPassword);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    function GenerateSalt(SaltLength) {
        const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let salt = "";
        for (let i = 0; i < SaltLength; i++) {
            salt += karakterek[Math.floor(Math.random() * karakterek.length)];
        }
        return salt;
    }

    // Email kérés kezelése
    const handleEmailRequest = async (e) => {
        e.preventDefault();
        setStatusMessage({ text: "", isError: false });

        if (!emailInput.trim()) {
            setStatusMessage({ text: "Kérjük, adjon meg egy email címet!", isError: true });
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5175/api/Registration/ForgotPasswordEmail/${encodeURIComponent(emailInput)}`);
            
            if (response.status === 200) {
                setStatusMessage({ text: "Email elküldve! Kérjük, ellenőrizze postafiókját az elfelejtett jelszó visszaállítási linkhez.", isError: false });
                setEmailSent(true);
                setEmailInput("");
                setTimeout(() => {
                    navigate("/bejelentkezes");
                }, 4000);
            }
        } catch (error) {
            const errorText = error.response?.data || "Hálózati hiba történt!";
            setStatusMessage({ text: "Hiba: " + errorText, isError: true });
        }
    };

    function GenerateSalt(SaltLength) {
        const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let salt = "";
        for (let i = 0; i < SaltLength; i++) {
            salt += karakterek[Math.floor(Math.random() * karakterek.length)];
        }
        return salt;
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setStatusMessage({ text: "", isError: false });

        if (!email) {
            setStatusMessage({ text: "Hiányzó e-mail cím az URL-ből!", isError: true });
            return;
        }

        if (password !== confirmPassword) {
            setStatusMessage({ text: "A két jelszó nem egyezik!", isError: true });
            return;
        }

        if (passwordStrength.score < 5) {
            setStatusMessage({ text: "A jelszó nem elég erős! Használjon kisbetűt, nagybetűt, számot és speciális karaktert!", isError: true });
            return;
        }

        try {
            const newSalt = GenerateSalt(64);
            const newHashed = await hashPassword(password, newSalt);

            const response = await axios.put("http://localhost:5175/api/Registration/ResetPassword", {
                email: email,
                newPassword: newHashed,
                salt: newSalt
            });

            if (response.status === 200) {
                setStatusMessage({ text: "Sikeres jelszó módosítás! Átirányítás a bejelentkezéshez...", isError: false });
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => navigate("/bejelentkezes"), 2000);
            }
        } catch (error) {
            const errorText = error.response?.data || "Hálózati hiba történt!";
            setStatusMessage({ text: "Hiba: " + errorText, isError: true });
        }
    };

    return (
        <div className="container_RegistrationConfirm">
            <div className="card_RegistrationConfirm">
                <div className="backLink_RegistrationConfirm">
                    <Link to="/"><i className="fa-solid fa-arrow-left"></i> Vissza az oldalra</Link>
                </div>

                {!email ? (
                    // Email kérés képernyő
                    <>
                        <h2 className="title_RegistrationConfirm">Elfelejtett jelszó</h2>

                        <p className="infoText_RegistrationConfirm">
                            Adja meg az email címét, és küldünk Önnek egy linket a jelszó visszaállításához.
                        </p>

                        {statusMessage.text && (
                            <div className="statusDisplay_ForgotPassword" style={{ color: statusMessage.isError ? 'red' : 'green' }}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleEmailRequest}>
                            <div>
                                <InputText
                                    type="email"
                                    id="forgotEmail"
                                    label="Email cím"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                />
                            </div>

                            <button type='submit' className="submitButton_RegistrationConfirm" disabled={emailSent}>
                                {emailSent ? "Email elküldve!" : "Email küldés"}
                            </button>
                        </form>

                        <Link to="/bejelentkezes" className="switchLink_RegistrationConfirm">
                            Vissza a bejelentkezéshez
                        </Link>
                    </>
                ) : (
                    // Jelszó módosítás képernyő
                    <>
                        <h2 className="title_RegistrationConfirm">Új jelszó megadása</h2>

                        <p className="infoText_RegistrationConfirm">
                            Kedves <strong>{name}</strong>! <br />
                            Adja meg az új jelszavát az alábbi mezőkben.
                        </p>

                        <p className="emailDisplay_RegistrationConfirm">
                            Regisztrált e-mail cím: {email}
                        </p>

                        {statusMessage.text && (
                            <div className="statusDisplay_ForgotPassword" style={{ color: statusMessage.isError ? 'red' : 'green' }}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange}>
                            <div>
                                <InputText
                                    type="password"
                                    id="forgotPassword"
                                    label="Új jelszó"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        checkPasswordStrength(e.target.value);
                                    }}
                                    inputStyle={{
                                        borderColor: passwordStrength.color,
                                        backgroundColor: password ? passwordStrength.color + "20" : "white"
                                    }}
                                />

                                <InputText
                                    type="password"
                                    id="forgotPasswordConfirm"
                                    label="Jelszó újra"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            {password && (
                                <div className="passwordStrengthContainer_ForgotPassword">
                                    <div style={{ background: "#eee", height: "6px", borderRadius: "4px", width: "100%" }}>
                                        <div style={{ 
                                            width: `${passwordStrength.score * 20}%`, 
                                            height: "100%", 
                                            background: passwordStrength.color, 
                                            transition: "0.3s" 
                                        }} />
                                    </div>
                                    <small style={{ color: passwordStrength.color, display: "block", textAlign: "center" }}>
                                        {passwordStrength.label}
                                    </small>
                                </div>
                            )}

                            <button type='submit' className="submitButton_RegistrationConfirm">
                                Jelszó mentése
                            </button>
                        </form>

                        <Link to="/bejelentkezes" className="switchLink_RegistrationConfirm">
                            Már tudod a jelszavad? Jelentkezz be!
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
