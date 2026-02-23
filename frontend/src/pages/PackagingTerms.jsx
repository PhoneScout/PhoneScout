import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function PackagingTerms() {
  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Csomagolási feltételek</h1>
        <p>
          A Szerviz igénylés után kapott folyamat részeként kövesd az alábbi csomagolási lépéseket.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-8">
          <div className="info-card h-100">
            <span className="info-badge">Lépésről lépésre</span>
            <h5>Csomagolási ellenőrzőlista</h5>
            <ol className="info-steps">
              <li>A telefont kapcsold ki, és lehetőség szerint távolítsd el a SIM-kártyát.</li>
              <li>Tekerd körbe a készüléket legalább két réteg buborékfóliával.</li>
              <li>Használj merev falú dobozt, amelyben a készülék nem tud mozogni.</li>
              <li>Töltsd ki az üres helyeket térkitöltő anyaggal (papír, hab, buborékfólia).</li>
              <li>A csomagba tedd be a nevet és telefonszámot, amit az űrlapon megadtál.</li>
              <li>A csomagba tedd be a bevizsgálási kódot is.</li>
              <li>A csomagot erős ragasztószalaggal zárd le.</li>
            </ol>
            <div className="info-note mt-2">
              Beküldési cím: Miskolc, Palóczy László utca 3, 3525 (PhoneScout Szerviz)
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="info-card h-100">
            <span className="info-badge">Mielőtt feladod</span>
            <h5>Fontos tudnivaló</h5>
            <p>
              Nem megfelelő csomagolásból eredő sérülésekért a szállító és a feladó felel.
            </p>
            <div className="info-note">
              Tipp: feladás előtt készíts fotót a becsomagolt készülékről és jegyezd fel a bevizsgálási kódot.
            </div>
            <div className="info-actions mt-2">
              <Link to="/szervizigenyles" className="btn info-btn">Vissza a szerviz igényléshez</Link>
              <Link to="/elerhetosegek" className="btn info-btn-secondary">Szerviz elérhetőségek</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
