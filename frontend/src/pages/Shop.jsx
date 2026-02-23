import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function Shop() {
  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Bolt</h1>
        <p>
          Egyszerű vásárlási útvonal: szűrés, összehasonlítás, kosár — felesleges lépések nélkül.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-4">
          <div className="info-card h-100">
            <h5>Okos szűrés</h5>
            <p className="mb-0">
              Szűrj ár, márka, tárhely és egyéb paraméterek alapján pár kattintással.
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="info-card h-100">
            <h5>Összehasonlítás</h5>
            <p className="mb-0">
              Tedd egymás mellé a kiválasztott telefonokat, és dönts pontos adatok alapján.
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="info-card h-100">
            <h5>Gyors vásárlási folyamat</h5>
            <p className="mb-0">
              Kosár, profil és rendelési adatok egyszerűen kezelhetők a PhoneScout felületén.
            </p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <span className="info-badge">Ajánlott sorrend</span>
          <h5>Így a leggyorsabb a választás</h5>
          <ol className="info-steps">
            <li><strong>Szűrés:</strong> szűkítsd a listát ár, márka és tárhely alapján.</li>
            <li><strong>Összehasonlítás:</strong> tedd egymás mellé a legjobb 2-3 modellt.</li>
            <li><strong>Kosár:</strong> add a kiválasztott telefont a kosárhoz és folytasd a vásárlást.</li>
          </ol>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-2">Kezdd a böngészést most</h5>
            <p className="mb-0">Nyisd meg a teljes telefonlistát és használd a részletes szűrőt.</p>
          </div>
          <div className="info-actions">
            <Link to="/szures" className="btn info-btn">Telefonok megtekintése</Link>
            <Link to="/osszehasonlitas" className="btn info-btn-secondary">Összehasonlítás</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
