import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';
import { useAuth } from '../components/AuthContext';
import PhoneDataDisclaimer from '../components/PhoneDataDisclaimer';

export default function Shop() {
  const { token } = useAuth();

  return (
    <div className="container info-page">
      <section className="info-hero">
        <h1>A PhoneScout Webshop Használata</h1>
        <p>
          Fedezd fel, hogyan találhatsz könnyen és gyorsan a számodra tökéletes telefont.
        </p>
      </section>      

      <section className="info-section">
        <div className="info-card">
          <span className="info-badge">Lépésről lépésre</span>
          <h5>A vásárlási folyamat</h5>
          <div className="row g-4 mt-2">
            <div className="col-md-6 col-lg-3">
              <div className="process-step">
                <div className="step-number">1</div>
                <h6>Böngészés és szűrés</h6>
                <p>
                  Használd a <Link to="/szures">Szűrés oldalt</Link> a telefonok 
                  böngészéséhez. Szűkítsd a választékot ár, márka, tárhely és 
                  egyéb paraméterek alapján.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="process-step">
                <div className="step-number">2</div>
                <h6>Részletek és összehasonlítás</h6>
                <p>
                  Kattints egy telefonra a részletes specifikációkért. 
                  Jelölj meg több telefont és hasonlítsd össze őket az 
                  <Link to="/osszehasonlitas"> Összehasonlítás oldalon</Link>.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="process-step">
                <div className="step-number">3</div>
                <h6>Kosárba helyezés</h6>
                <p>
                  Ha megtaláltad a tökéletes telefont, rakd a kosárba. 
                  A <Link to="/kosar">Kosár oldalon</Link> áttekintheted 
                  a kiválasztott termékeket.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="process-step">
                <div className="step-number">4</div>
                <h6>Rendelés leadása</h6>
                <p>
                  Jelentkezz be vagy regisztrálj, majd véglegesítsd a 
                  rendelést.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section row g-4">
        <div className="col-lg-8">
          <div className="info-card h-100">
            <h5>Intelligens szűrési lehetőségek</h5>
            <p>
              A PhoneScout szűrőrendszere segít gyorsan megtalálni a számodra 
              ideális telefont:
            </p>
            <ul className="info-list">
              <li><strong>Ár szerinti szűrés:</strong> Állítsd be a költségkeretedet egy csúszkával</li>
              <li><strong>Márka választás:</strong> Válassz az összes elérhető gyártó közül</li>
              <li><strong>Tárhely:</strong> Szűrj ROM és RAM méret szerint is</li>
              <li><strong>Kamera minőség:</strong> Megapixel és egyéb kamera jellemzők</li>
              <li><strong>Akkumulátor kapacitás:</strong> Válaszd ki a megfelelő üzemidőt</li>
              <li><strong>Processzor teljesítmény:</strong> Szűrés CPU magok és órajel alapján</li>
            </ul>
            <Link to="/szures" className="btn info-btn mt-3">Telefonok szűrése most</Link>

            <hr className="my-4" />

            <h5>Összehasonlítási funkció</h5>
            <p>
              Nem tudod eldönteni két vagy három telefon között? Az összehasonlító 
              funkció segít:
            </p>
            <ul className="info-list">
              <li>Válassz ki több telefont</li>
              <li>Nézd meg egymás mellett az összes specifikációt</li>
              <li>Könnyen átláthatóak a különbségeket és hasonlóságokat</li>
              <li>Egyből látod, melyik telefon nyújt többet az áráért</li>
            </ul>
            <Link to="/osszehasonlitas" className="btn info-btn-secondary mt-3">Összehasonlítás megnyitása</Link>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="info-card h-100">
            <span className="info-badge">Tippek és trükkök</span>
            <h5>Hogyan válassz okosan?</h5>
            <div className="info-note mb-3">
              <strong>1. Határozd meg a célt</strong><br />
              Játékhoz, fotózáshoz vagy irodai munkához kell? 
              Ez befolyásolja a processzor, RAM és kamera választását.
            </div>
            <div className="info-note mb-3">
              <strong>2. Ne csak az árat nézd</strong><br />
              A PhoneScout összehasonlító funkciója segít eldönteni, hogy melyik telefon a legmegfelelőbb az áráért.
            </div>
            <div className="info-note mb-3">
              <strong>3. Használd a chatbotot</strong><br />
              Ha bizonytalan vagy, kérdezd meg a chatbot asszisztenst, 
              ami pontosan az igényeid alapján javasol telefonokat.
            </div>
            <div className="info-note">
              <strong>4. Figyeld a készletinformációkat</strong><br />
              A telefonoknál látható készletállapot folyamatosan frissül, 
              így mindig aktuális információt kapsz.
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h5>Fiók és rendeléskezelés</h5>
          <div className="row g-4">
            <div className="col-md-6">
              <h6>Miért érdemes regisztrálni?</h6>
              <ul className="info-list">
                <li>Gyorsabb vásárlási folyamat</li>
                <li>Rendelési előzmények nyomon követése</li>                
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Bejelentkezés nélkül is böngészhetsz</h6>
              <ul className="info-list">
                <li>Telefonok böngészése és szűrése</li>
                <li>Összehasonlítás funkció</li>
                <li>Részletes specifikációk megtekintése</li>
                <li>Csak a véglegesítéshez kell fiók</li>
              </ul>
            </div>
          </div>
          <div className="info-actions mt-4">
            {!token && (
              <Link to="/bejelentkezes" className="btn info-btn">Bejelentkezés / Regisztáció</Link>
            )}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="mb-2">Készen állsz a vásárlásra?</h5>
            <p className="mb-0">Kezdd el a böngészést most, és találd meg az álmaid telefonját!</p>
          </div>
          <Link to="/szures" className="btn info-btn">Böngészés indítása</Link>
        </div>
      </section>
    </div>
  );
}

