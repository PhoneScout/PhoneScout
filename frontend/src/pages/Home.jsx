import React, { useEffect, useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './Home.css';
import Navbar from '../components/Navbar';
import PhoneCard from '../components/PhoneCard';
import Footer from '../components/Footer';

export default function Home() {
  const allPhonesURL = "http://localhost:5165/api/GETmainPage";

  const [currentPage, setCurrentPage] = useState(0);
  const [activeChangeButton, setActiveChangeButton] = useState("right");



  const [allPhonesData, setAllPhonesData] = useState([]);

  useEffect(() => {
    fetch(allPhonesURL)
      .then((response) => response.json())
      .then((data) => {
        setAllPhonesData(data);
      })
      .catch((error) => console.error("Hiba a JSON betöltésekor:", error));
  }, []);


  function changePage(direction) {
    const newPage = currentPage + direction;
    setCurrentPage(newPage);

    if (newPage === 1) {
      setActiveChangeButton("left");
    } else if (newPage === 0) {
      setActiveChangeButton("right");
    }
  }


  function displayPhoneCards() {
    let start = 0;
    activeChangeButton === "right" ? start = 0 : start = 4;
    return allPhonesData.slice(start, start + 4).map((phone) => (
      <PhoneCard phoneName={phone.phoneName} phoneInStore={(phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron")} phonePrice={phone.phonePrice} />
    ))
  }

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="row">
        <div className="col-1">
          {
            activeChangeButton === "left" ? <button onClick={() => changePage(-1)} id="carouselButtonLeft" className="carouselButton">
              <i className="fa-solid fa-arrow-left"></i>
            </button> : ""
          }

        </div>
        <div className='col-10'>
          <div id='contentRow'>
            {allPhonesData.length === 0 ? (
              <p>Telefonok betöltése...</p>
            ) : (
              displayPhoneCards()
            )}
          </div>
        </div>
        <div className="col-1">
          {
            activeChangeButton === "right" ? <button onClick={() => changePage(1)} id="carouselButtonRight" className="carouselButton">
              <i className="fa-solid fa-arrow-right"></i>
            </button> : ""
          }
        </div>
        <div className="dots">
          <div className={`dot ${currentPage === 0 ? "dotActive" : ""}`} id="leftDot"></div>
          <div className={`dot ${currentPage === 1 ? "dotActive" : ""}`} id="rightDot"></div>
        </div>
        <div className="hr">
          <hr size="5" />
        </div>

        <div class="container service-section">
          <div class="row align-items-center">
            <div class="col-lg-6 service-text">
              <h2>Gyors és Megbízható Szerviz</h2>
              <p>
                Meghibásodott a telefonod? Ne aggódj! Nálunk gyors és szakszerű javítást kapsz,
                hogy minél hamarabb újra használhasd a készüléked. Tapasztalt szakembereink és
                prémium minőségű alkatrészeink garantálják a hosszú távú megbízhatóságot.
              </p>
              <p>
                Miért válassz minket?
                <ul>
                  <li>Gyors javítás, akár néhány órán belül</li>
                  <li>Kedvező árak és átlátható költségek</li>
                  <li>Eredeti vagy prémium minőségű alkatrészek</li>
                  <li>Garancia minden javításra</li>
                </ul>
              </p>
              <button class="btn btn-primary service-btn"
                onclick="window.location.href='./szerviz/szerviz.html'">Irány a <strong>szervíz</strong>
                oldal</button>
            </div>
            <div class="col-lg-6 service-image">
              <img loading="lazy" src="../Images/telefonservice.png" alt="Telefon Szervíz" class="rounded-image" />
            </div>
          </div>
        </div>


      </div>
      <Footer />
    </div>

  );
}
