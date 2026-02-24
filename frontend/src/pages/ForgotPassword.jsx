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

    // URL paraméterek
    const name = searchParams.get('name') || 'Felhasználó';
    const email = searchParams.get('email');

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
            setStatusMessage({ text: "A jelszó nem elég erős!", isError: true });
            return;
        }

        try {
            const newSalt = GenerateSalt(64);
            const newHashed = await hashPassword(password, newSalt);

            // Figyelem: Elfelejtett jelszónál általában nem kell az "oldPassword"
            // Ha a backend mégis kéri, ellenőrizd a végpontot!
            const response = await axios.put("http://localhost:5175/api/Registration/ResetPassword", {
                email: email,
                newPassword: newHashed,
                salt: newSalt
            });

            if (response.status === 200) {
                setStatusMessage({ text: "Sikeres jelszó módosítás! Jelentkezzen be.", isError: false });
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => navigate("/login"), 3000);
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

                <h2 className="title_RegistrationConfirm">Új jelszó megadása</h2>

                <p className="infoText_RegistrationConfirm">
                    Kedves <strong>{name}</strong>! Adja meg az új jelszavát!
                </p>

                {statusMessage.text && (
                    <div style={{ color: statusMessage.isError ? 'red' : 'green', textAlign: 'center', marginBottom: '10px' }}>
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handlePasswordChange}>
                    <div>
                        <InputText
                            type="password"
                            id="registerPassword"
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
                            id="registerPasswordAgain"
                            label="Jelszó újra"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {password && (
                        <div className="passwordStrengthContainer" style={{ marginBottom: '20px' }}>
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
            </div>
        </div>
    );
}
