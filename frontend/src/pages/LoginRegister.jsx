import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function LoginRegister() {
  const [currentView, setCurrentView] = useState('login');

  const switchToRegister = () => setCurrentView('register');
  const switchToLogin = () => setCurrentView('login');
 
  return (
    <div>
      {currentView === 'login' ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
}