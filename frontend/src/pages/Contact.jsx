import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function Contact() {
  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Kapcsolat</h1>
        <p>
          Ez az oldal akkor segít, ha elakadtál a folyamatban, és nem tudod, merre menj tovább.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-6">
          <div className="info-card h-100">
            <span className="info-badge">Ajánlott útvonal</span>
            <h5>Ha készülékhibád van</h5>
            <ol className="info-steps">
              <li>Nyisd meg a <strong>Szerviz</strong> oldalt, és nézd át az opciókat.</li>
              <li>Használd a chatbotot, ha nem egyértelmű a hiba.</li>
              <li>Indítsd el a <strong>Szerviz igénylést</strong>, és kövesd a kapott instrukciókat.</li>
            </ol>
            <div className="info-note mt-3">
              A rendszer elsődlegesen az oldalon belüli lépésekre épül, nem külön kapcsolatfelvételre.
            </div>
            <Link to="/szerviz" className="btn info-btn">Szerviz megnyitása</Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="info-card h-100">
            <span className="info-badge">Ha teljesen elvesztél</span>
            <h5>Végső támpont</h5>
            <p>
              Ha már nem tudod, melyik oldalon kell folytatnod, innen indulj:
            </p>
            <ul className="info-list">
              <li><strong>Bolt:</strong> telefon keresés, szűrés, összehasonlítás</li>
              <li><strong>Szerviz:</strong> hiba típusok és javítási lehetőségek</li>
              <li><strong>Szerviz igénylés:</strong> konkrét beküldési folyamat</li>
            </ul>
            <div className="info-actions">
              <Link to="/bolt" className="btn info-btn-secondary">Bolt</Link>
              <Link to="/szervizigenyles" className="btn info-btn">Szerviz igénylése</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
