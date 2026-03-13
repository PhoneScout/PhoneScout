import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

export default function Contact() {
  const openChatbot = () => {
    window.dispatchEvent(new Event('openChatbot'));
  };

  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>Kapcsolat és Ügyfélszolgálat</h1>
        <p>
          Segítünk eligazodni a PhoneScout használatában és válaszolunk a kérdéseidre.
        </p>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-8">
          <div className="info-card h-100">
            <h5>Hogyan segíthetünk?</h5>
            <p>
              A PhoneScout rendszere arra lett tervezve, hogy önállóan tudd használni
              vásárláshoz és szerviz igényléshez. Ha mégis elakadtál vagy kérdésed van,
              az alábbi lehetőségek állnak rendelkezésedre:
            </p>
            <span className="info-badge mt-3">1. Chatbot asszisztens</span>
            <h5>Azonnali AI válaszok 0-24</h5>
            <p>
              A chatbot asszisztens segít eligazodni a telefonválasztásban,
              a vásárlási folyamatban és a szerviz igénylésben. Kattints a
              jobb alsó sarokban található ikonra vagy használd az alábbi gombot.
            </p>
            <button onClick={openChatbot} className="btn info-btn">
              Chatbot megnyitása most
            </button>

            <hr className="my-4" />

            <span className="info-badge mt-3">2. Ügyfélszolgálat</span>
            <h5>Gyors válaszok munkaidőn belül</h5>
            <p>
              Ha szeretnél személyesen beszélni velünk, vagy részletesebb segítségre van szükséged,
              elérhetőségeinken keresztül is kapcsolatba léphetsz velünk. Miskolci üzletünkben
              személyesen is várunk, ahol segítünk a telefonválasztásban vagy a szerviz igénylésben.
              <ul>
                <li>Telefon: +36 30 123 4567</li>
                <li>Email: phonescoutofficial@gmail.com</li>
                <li>Üzlet: Miskolc, Palóczy László utca 3</li>
              </ul>
            </p>

            <hr className="my-4" />

            <span className="info-badge">3. Gyakori kérdések (FAQ)</span>
            <h5>Vásárlással kapcsolatos kérdések</h5>
            <ul className="info-list">
              <li>
                <strong>Hogyan keresek telefont?</strong><br />
                Használd a <Link to="/szures">Szűrés oldalt</Link>, ahol ár, márka,
                tárhely és egyéb paraméterek alapján szűkítheted a listát.
              </li>
              <li>
                <strong>Hogyan hasonlítok össze telefonokat?</strong><br />
                Az összehasonlítás ikonra kattintva jelölhetsz ki telefonokat, majd
                az <Link to="/osszehasonlitas">Összehasonlítás oldalon</Link> láthatod
                őket egymás mellett.
              </li>
              <li>
                <strong>Hogyan vásárolok?</strong><br />
                Rakd a telefont a kosárba, majd a <Link to="/kosar">Kosár oldalon</Link> véglegesítsd
                a rendelést. Bejelentkezés szükséges a vásárláshoz.
              </li>
            </ul>

            <h5 className="mt-4">Szervizzel kapcsolatos kérdések</h5>
            <ul className="info-list">
              <li>
                <strong>Hogyan igénylek szerviz szolgáltatást?</strong><br />
                Látogass el a <Link to="/szervizigenyles">Szerviz igénylés oldalra</Link>,
                töltsd ki az űrlapot és kövesd a megjelenő instrukciókat.
              </li>
              <li>
                <strong>Hogyan küldöm be a telefonomat javításra?</strong><br />
                Két lehetőséged van: személyesen leadhatod az üzletünkben
                (Miskolc, Palóczy László utca 3) vagy postán beküldheted a
                <Link to="/csomagolasfeltetelek"> csomagolási útmutató</Link> szerint.
              </li>
              <li>
                <strong>Mennyi ideig tart a javítás?</strong><br />
                Az egyszerűbb javítások akár néhány órán belül elkészülhetnek,
                bonyolultabb esetekben 1-3 munkanap. A szerviz oldalon részletes
                információkat találsz.
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="info-card h-100">
            <span className="info-badge">Gyors linkek</span>
            <h5>Hasznos oldalak</h5>
            <ul className="info-list">
              <li><Link to="/rolunk">Rólunk - PhoneScout bemutató</Link></li>
              <li><Link to="/bolt">Bolt működése</Link></li>
              <li><Link to="/elerhetosegek">Elérhetőségek és nyitvatartás</Link></li>
              <li><Link to="/szures">Telefonok böngészése</Link></li>
              <li><Link to="/szerviz">Szerviz információk</Link></li>
              <li><Link to="/szervizigenyles">Szerviz igénylés</Link></li>
              <li><Link to="/csomagolasfeltetelek">Csomagolási feltételek</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-2">Még mindig nem találod a választ?</h5>
            <p className="mb-0">Használd a chatbot asszisztenst vagy nézd meg az elérhetőségeket.</p>
          </div>
          <div className="info-actions">
            <button onClick={openChatbot} className="btn info-btn">Chatbot indítása</button>
            <Link to="/elerhetosegek" className="btn info-btn-secondary">Elérhetőségek</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
