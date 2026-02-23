import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function Contacts() {
  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Elérhetőségek</h1>
        <p>
          Ez az oldal tájékozódási pont: válaszd ki, melyik folyamatban vagy elakadva.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-md-6 col-xl-4">
          <div className="info-card h-100">
            <span className="info-badge">Vásárlás</span>
            <h5>Telefon keresés</h5>
            <ul className="info-list">
              <li>Szűkítsd a kínálatot a Szűrés oldalon</li>
              <li>Hasonlítsd össze a jelölteket</li>
              <li>Végül add kosárba a kiválasztott modellt</li>
            </ul>
            <Link to="/szures" className="btn info-btn">Szűrés megnyitása</Link>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="info-card h-100">
            <span className="info-badge">Szerviz</span>
            <h5>Hibakezelés folyamata</h5>
            <ul className="info-list">
              <li>Szerviz oldalon válaszd ki a megfelelő irányt</li>
              <li>Szerviz igénylésnél add meg a kötelező adatokat</li>
              <li>Kövesd a bevizsgálási kódhoz tartozó útmutatót</li>
            </ul>
            <Link to="/szervizigenyles" className="btn info-btn">Szerviz indítása</Link>
          </div>
        </div>
        <div className="col-md-12 col-xl-4">
          <div className="info-card h-100">
            <span className="info-badge">Végső támpont</span>
            <h5>Ha már teljesen elvesztél</h5>
            <ul className="info-list">
              <li>Szerviz beküldési cím: Miskolc, Palóczy László utca 3, 3525</li>
              <li>Ez a cím a szerviz instrukciókban is ugyanígy szerepel</li>
              <li>Első körben mindig az online lépéseket kövesd</li>
            </ul>
            <Link to="/kapcsolat" className="btn info-btn-secondary">Útvonal választása</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
