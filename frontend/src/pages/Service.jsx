import React from 'react'
import './Service.css';
import { Link } from 'react-router';

export default function Service() {
  return (
    <div>
      <div className="container service-section">
        <div className="row align-items-center">
          {/* BAL OLDAL – SZÖVEG */}
          <div className="col-lg-6 service-text left-side">
            <h2>Gyors és Megbízható Szerviz</h2>

            <p>
              Meghibásodott a telefonod? Ne aggódj! Nálunk gyors és szakszerű
              javítást kapsz, hogy minél hamarabb újra használhasd a készüléked.
              Tapasztalt szakembereink és prémium minőségű alkatrészeink
              garantálják a hosszú távú megbízhatóságot.
            </p>

            <p>Miért válassz minket?</p>

            <ul id="serviceList">
              <li
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="0"
                style={{ cursor: "pointer" }}
              >
                Gyors javítás, akár néhány órán belül
              </li>
              <li
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="1"
                style={{ cursor: "pointer" }}
              >
                Kedvező árak és átlátható költségek
              </li>
              <li
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="2"
                style={{ cursor: "pointer" }}
              >
                Eredeti vagy prémium minőségű alkatrészek
              </li>
              <li
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="3"
                style={{ cursor: "pointer" }}
              >
                Garancia minden javításra
              </li>
              <li
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="4"
                style={{ cursor: "pointer" }}
              >
                Derítsd ki mi baja a telefonodnak
              </li>
            </ul>
          </div>

          {/* JOBB OLDAL – CAROUSEL */}
          <div className="col-lg-6 service-text">
            <div
              id="serviceCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="service-details-title" style={{ color: "#2300B3" }}>
                    Gyors javítás
                  </div>
                  <div className="service-details-text">
                    Szakembereink a legtöbb hibát akár néhány órán belül elhárítják,
                    hogy ne maradj sokáig telefon nélkül.
                  </div>
                  <img
                    src="/Images/telefonservice.png"
                    alt="Gyors javítás"
                    className="carousel-img mt-3"
                  />
                </div>

                <div className="carousel-item">
                  <div className="service-details-title" style={{ color: "#68F145" }}>
                    Kedvező árak és átlátható költségek
                  </div>
                  <div className="service-details-text">
                    Minden javítás előtt pontos árajánlatot kapsz, rejtett költségek
                    nélkül.
                  </div>
                  <img
                    src="/Images/service2.png"
                    alt="Kedvező árak"
                    className="carousel-img mt-3"
                  />
                </div>

                <div className="carousel-item">
                  <div className="service-details-title" style={{ color: "#3E9696" }}>
                    Eredeti vagy prémium minőségű alkatrészek
                  </div>
                  <div className="service-details-text">
                    Csak eredeti vagy prémium minőségű alkatrészeket használunk.
                  </div>
                  <img
                    src="/Images/service3.png"
                    alt="Minőségi alkatrészek"
                    className="carousel-img mt-3"
                  />
                </div>

                <div className="carousel-item">
                  <div className="service-details-title" style={{ color: "#FF4742" }}>
                    Garancia minden javításra
                  </div>
                  <div className="service-details-text">
                    Minden elvégzett munkára garanciát adunk.
                  </div>
                  <img
                    src="/Images/service4.png"
                    alt="Garancia"
                    className="carousel-img mt-3"
                  />
                </div>

                <div className="carousel-item">
                  <div className="service-details-title" style={{ color: "#9ccd8c" }}>
                    Derítsd ki mi baja a telefonodnak
                  </div>
                  <div className="service-details-text">
                    Használd a chatbotunkat, és pár kérdés után segítünk!
                  </div>
                  <img
                    src="/Images/service5.png"
                    alt="Chatbot"
                    className="carousel-img mt-3"
                  />
                </div>
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#serviceCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" />
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#serviceCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          </div>

          {/* GOMBOK */}
          <button className="btn btn-outline-info mt-4 w-100" id="chatbotBtn">
            <i className="fas fa-robot"></i> Chatbot: Segítség a hibához
          </button>

          <Link className="btn btn-primary service-btn"
            to="/szervizigenyles"><strong>Szervíz igénylése</strong>
          </Link>
        </div>

        <div className="hr">
          <hr size="5" />
        </div>


      </div>
    </div>
  );
};
