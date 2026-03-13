import React, { useEffect, useRef, useState } from 'react'
import './Service.css';
import { Link } from 'react-router';

// Render service page.
export default function Service() {
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Sync active list item with current carousel slide.
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const handleSlide = (event) => {
      if (typeof event?.to === 'number') {
        setActiveSlide(event.to);
      }
    };

    carouselElement.addEventListener('slid.bs.carousel', handleSlide);
    return () => carouselElement.removeEventListener('slid.bs.carousel', handleSlide);
  }, []);

  const openChatbot = () => {
    window.dispatchEvent(new Event('openChatbot'));
  };

  return (
    <div>
      <div className="container service-section">
        <div className="row align-items-center">
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
                className={activeSlide === 0 ? 'active' : ''}
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="0"
                onClick={() => setActiveSlide(0)}
                style={{ cursor: "pointer" }}
              >
                Gyors javítás, akár néhány órán belül
              </li>
              <li
                className={activeSlide === 1 ? 'active' : ''}
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="1"
                onClick={() => setActiveSlide(1)}
                style={{ cursor: "pointer" }}
              >
                Kedvező árak és átlátható költségek
              </li>
              <li
                className={activeSlide === 2 ? 'active' : ''}
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="2"
                onClick={() => setActiveSlide(2)}
                style={{ cursor: "pointer" }}
              >
                Eredeti vagy prémium minőségű alkatrészek
              </li>
              <li
                className={activeSlide === 3 ? 'active' : ''}
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="3"
                onClick={() => setActiveSlide(3)}
                style={{ cursor: "pointer" }}
              >
                Garancia minden javításra
              </li>
              <li
                className={activeSlide === 4 ? 'active' : ''}
                data-bs-target="#serviceCarousel"
                data-bs-slide-to="4"
                onClick={() => setActiveSlide(4)}
                style={{ cursor: "pointer" }}
              >
                Derítsd ki mi baja a telefonodnak
              </li>
            </ul>
          </div>

          <div className="col-lg-6 service-text">
            <div
              id="serviceCarousel"
              ref={carouselRef}
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

          <button className="btn btn-outline-info mt-4 w-100" id="chatbotBtn" onClick={openChatbot}>
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
