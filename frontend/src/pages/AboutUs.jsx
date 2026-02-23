import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function AboutUs() {
  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Rólunk</h1>
        <p>
          A PhoneScout célja, hogy a telefonválasztás és a szervizelés folyamata egyértelmű legyen,
          felesleges körök nélkül.
        </p>
        <span className="info-pill">Megbízható adatok</span>
        <span className="info-pill">Gyors keresés</span>
        <span className="info-pill">Világos lépések</span>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-8">
          <div className="info-card">
            <h5>Küldetésünk</h5>
            <p>
              Célunk, hogy mindenki gyorsan megtalálja a számára ideális készüléket: legyen szó ár-érték arányról,
              teljesítményről vagy kameráról. Ezért a PhoneScout egy helyen ad keresést, szűrést,
              összehasonlítást és szerviz igénylést.
            </p>
            <p className="mb-0">
              A felületünk döntést támogat: először választás, utána konkrét lépések.
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="info-card">
            <span className="info-badge">Fő funkciók</span>
            <h5>Mit tudsz itt elintézni?</h5>
            <ul className="info-list">
              <li>Telefonok listázása és szűrése</li>
              <li>Modellek összehasonlítása</li>
              <li>Kosár és profil kezelés</li>
              <li>Szerviz igénylés lépésről lépésre</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="info-section row g-3">
        <div className="col-md-4"><div className="info-kpi"><strong>100+</strong>Elérhető modell</div></div>
        <div className="col-md-4"><div className="info-kpi"><strong>1 folyamat</strong>Választás → Szerviz</div></div>
        <div className="col-md-4"><div className="info-kpi"><strong>Világos</strong>Követhető lépések</div></div>
      </section>

      <section className="info-section">
        <div className="info-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-2">Merre menj tovább?</h5>
            <p className="mb-0">Vásárláshoz indulj a szűrésből, hibánál indulj a szerviz oldalról.</p>
          </div>
          <div className="info-actions">
            <Link to="/szures" className="btn info-btn">Telefonok böngészése</Link>
            <Link to="/szerviz" className="btn info-btn-secondary">Szerviz oldal</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
