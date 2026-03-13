import React, { useState } from 'react';

const STORAGE_KEY = 'phonescoutPhoneDataDisclaimerDismissed';

// Render a dismissible disclaimer for phone data accuracy.
export default function PhoneDataDisclaimer({ className = '' }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(STORAGE_KEY) !== 'true';
  });

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`alert alert-warning alert-dismissible fade show small ${className}`.trim()} role="alert">
      <strong>Figyelmeztetés:</strong> A telefonokról megjelenített adatok tájékoztató jellegűek, ezért
      előfordulhatnak pontatlanságok, hiányosságok vagy nem teljesen naprakész információk.
      <button
        type="button"
        className="btn-close"
        aria-label="Bezárás"
        onClick={handleClose}
      ></button>
    </div>
  );
}
