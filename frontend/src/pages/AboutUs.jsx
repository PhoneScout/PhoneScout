import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function AboutUs() {
  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Rólunk - PhoneScout</h1>
        <p>
          Telefonok választása és javítása egy helyen, egyszerűen és gyorsan.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-8">
          <div className="info-card h-100">
            <h5>Kik vagyunk?</h5>
            <p>
              A PhoneScout egy modern online platform, amely összekötött webshop és szerviz szolgáltatást nyújt. 
              Célunk, hogy a telefonvásárlás és a készülékjavítás folyamata egyszerű, átlátható és gyors legyen.
            </p>
            <p>
              Miskolcon található központunkban a legmodernebb telefon modellek közül választhatsz, és ugyanitt 
              professzionális szerviz szolgáltatást is igénybe vehetsz, ha a telefon javításra szorul.
            </p>
            
            <h5 className="mt-4">Küldetésünk</h5>
            <p className="mb-0">
              Megkönnyíteni a telefonválasztást intelligens szűrőkkel és részletes összehasonlítási lehetőségekkel, 
              valamint biztosítani a gyors és megbízható javítási szolgáltatást transparens árakkal és 
              lépésről-lépésre követhető folyamatokkal.
            </p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="info-card h-100">
            <span className="info-badge">Szolgáltatásaink</span>
            <h5>Mit kínálunk?</h5>
            <ul className="info-list">
              <li>Online telefon webshop a legmodernebb modellekkel</li>
              <li>Okos szűrési és összehasonlítási rendszer</li>
              <li>Professzionális telefon szerviz</li>
              <li>Gyors javítás eredeti alkatrészekkel</li>
              <li>Online szerviz igénylés</li>
              <li>Chatbot asszisztens támogatás</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="info-section row g-3">
        <div className="col-md-4">
          <div className="info-kpi">
            <strong>A legmodernebb</strong>
            Telefon modellek
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-kpi">
            <strong>1 platform</strong>
            Webshop + Szerviz
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-kpi">
            <strong>Miskolc</strong>
            Helyi központ
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h5>Miért válassz minket?</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Átlátható vásárlás:</strong>
              <p className="mb-0">Minden telefonról részletes specifikáció, összehasonlítási lehetőség, valós ár.</p>
            </div>
            <div className="col-md-6">
              <strong>Gyors szerviz:</strong>
              <p className="mb-0">Professzionális javítás néhány órán vagy napon belül, eredeti alkatrészekkel.</p>
            </div>
            <div className="col-md-6">
              <strong>Egy rendszer:</strong>
              <p className="mb-0">Vásárlás és szerviz ugyanazon a platformon, egységes élmény.</p>
            </div>
            <div className="col-md-6">
              <strong>Ügyfél támogatás:</strong>
              <p className="mb-0">Chatbot asszisztens segít a választásban és a szerviz folyamat során.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-2">Kezdd el nézegetni a telefonoat</h5>
            <p className="mb-0">Használd a szűrőt a tökéletes telefon megtalálásához vagy nézd meg a szerviz lehetőségeket.</p>
          </div>
          <div className="info-actions">
            <Link to="/szures" className="btn info-btn">Telefonok böngészése</Link>
            <Link to="/szerviz" className="btn info-btn-secondary">Szerviz szolgáltatás</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
