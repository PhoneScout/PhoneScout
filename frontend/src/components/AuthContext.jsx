import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Provide authentication state.
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('userToken'));

    // Store a new auth token.
    const login = (newToken) => {
        localStorage.setItem('userToken', newToken);
        setToken(newToken);
    };

    // Clear the auth token.
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

export const useAuth = () => useContext(AuthContext);