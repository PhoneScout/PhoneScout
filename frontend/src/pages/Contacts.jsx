import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function Contacts() {
  const openChatbot = () => {
    window.dispatchEvent(new Event('openChatbot'));
  };

  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Elérhetőségek</h1>
        <p>
          Minden fontos kapcsolattartási információ egy helyen.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-6">
          <div className="info-card h-100">
            <span className="info-badge">Központ</span>
            <h5>PhoneScout Üzlet és Szerviz</h5>
            <div className="mb-3">
              <strong>Cím:</strong><br />
              Miskolc, Palóczy László utca 3, 3525<br />
              <strong>Telefonszám:</strong><br />
              +36 30 123 4567<br />
              <strong>E-mail:</strong><br />
              phonescoutofficial@gmail.com<br />
            </div>
            <div className="mb-3">
              <strong>Nyitvatartás:</strong><br />
              Hétfő - Péntek: 9:00 - 18:00<br />
              Szombat: 10:00 - 14:00<br />
              Vasárnap: Zárva
            </div>
            <div className="info-note">
              Üzletünkben böngészhetsz a telefonok között, vagy személyesen leadhatod a 
              szervizbe küldendő készülékedet.
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="info-card h-100">
            <span className="info-badge">Online kapcsolat</span>
            <h5>Vásárlás és szerviz igénylés</h5>
            <div className="mb-3">
              <strong>Webshop:</strong><br />
              Az online rendelés a weboldalon keresztül 0-24 órában elérhető.
              Szűrj, hasonlítsd össze a telefonokat és rendeld meg online.
            </div>
            <div className="mb-3">
              <strong>Chatbot asszisztens:</strong><br />
              Ha kérdésed van vagy segítségre van szükséged, használd a chatbot-ot 
              a jobb alsó sarokban.
            </div>
            <button onClick={openChatbot} className="btn info-btn">
              Chatbot megnyitása
            </button>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h5>Szerviz beküldési információk</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Személyes leadás:</strong>
              <p>
                Hozd be a telefonodat az üzletünkbe (Miskolc, Palóczy László utca 3) 
                nyitvatartási időben. Munkatársaink helyben felveszik az adatokat 
                és azonnal megkezdik a diagnosztikát.
              </p>
            </div>
            <div className="col-md-6">
              <strong>Postai beküldés:</strong>
              <p>
                Töltsd ki a <Link to="/szervizigenyles">szerviz igénylési űrlapot</Link>, 
                csomagold be a telefont a <Link to="/csomagolasfeltetelek">csomagolási feltételek</Link> szerint, 
                és küldd el postán a fenti címre, PhoneScout Szerviz címzéssel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h5>Gyakori kérdések gyors linkjei</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <strong>Vásárlás:</strong>
              <ul className="info-list mt-2">
                <li><Link to="/szures">Telefonok böngészése</Link></li>
                <li><Link to="/osszehasonlitas">Összehasonlítás</Link></li>
                <li><Link to="/kosar">Kosár megtekintése</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <strong>Szerviz:</strong>
              <ul className="info-list mt-2">
                <li><Link to="/szerviz">Szerviz információk</Link></li>
                <li><Link to="/szervizigenyles">Szerviz igénylés</Link></li>
                <li><Link to="/csomagolasfeltetelek">Csomagolási útmutató</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <strong>Információk:</strong>
              <ul className="info-list mt-2">
                <li><Link to="/rolunk">Rólunk</Link></li>
                <li><Link to="/bolt">Bolt működése</Link></li>
                <li><Link to="/kapcsolat">Kapcsolat és FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
