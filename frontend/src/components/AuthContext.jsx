import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Kezdőérték: megnézzük, van-e már token a tárolóban
    const [token, setToken] = useState(localStorage.getItem('userToken'));

    const login = (newToken) => {
        localStorage.setItem('userToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Egyedi hook, hogy bárhol könnyen elérjük
export const useAuth = () => useContext(AuthContext);