import React, { useEffect, useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './Home.css';
import Navbar from '../components/Navbar'; //we still need the import here
import PhoneCard from '../components/PhoneCard';
import InputText from '../components/InputText';
import { Link } from 'react-router';
import axios from 'axios';

export default function Home() {
  const allPhonesURL = "http://localhost:5175/mainPage";

  // Banner carousel states
  const [bannerPage, setBannerPage] = useState(0);
  const [activeBannerButton, setActiveBannerButton] = useState("right");

  // Phone carousel states
  const [currentPage, setCurrentPage] = useState(0);
  const [activeChangeButton, setActiveChangeButton] = useState("right");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 991.98);



  const [allPhonesData, setAllPhonesData] = useState([]);
  const [homePreviousPages, setHomePreviousPages] = useState(() => {
    const stored = localStorage.getItem("pagesHistory");
    return stored ? JSON.parse(stored) : [{ pageName: "Főoldal", pageURL: "/" }];
  });

  useEffect(() => {
    axios.get(allPhonesURL)
      .then((response) => {
        setAllPhonesData(response.data);
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

  function changeBannerPage(direction) {
    const newPage = bannerPage + direction;

    if (newPage < 0 || newPage > 1) {
      return;
    }

    setBannerPage(newPage);

    if (newPage === 1) {
      setActiveBannerButton("left");
    } else if (newPage === 0) {
      setActiveBannerButton("right");
    }
  }


  function displayPhoneCards() {
    if (isMobileView) {
      const groupedPhones = [];

      for (let index = 0; index < allPhonesData.length; index += 4) {
        groupedPhones.push(allPhonesData.slice(index, index + 4));
      }

      return groupedPhones.map((phoneGroup, groupIndex) => (
        <div className="home-mobile-page" key={`mobile-page-${groupIndex}`}>
          {phoneGroup.map((phone) => (
            <PhoneCard
              key={phone.phoneID}
              phoneId={phone.phoneID}
              phoneName={phone.phoneName}
              phoneInStore={(phone.phoneInStore === 1 ? "Raktáron" : "Nincs raktáron")}
              phonePrice={phone.phonePrice}
              colors={phone.colors || []}
              ramStoragePairs={phone.ramStoragePairs || []}
            />
          ))}
        </div>
      ));
    }

    let start = 0;
    activeChangeButton === "right" ? start = 0 : start = 4;
    return allPhonesData.slice(start, start + 4).map((phone) => (
      <PhoneCard
        key={phone.phoneID}
        phoneId={phone.phoneID}
        phoneName={phone.phoneName}
        phoneInStore={(phone.phoneInStore === 1 ? "Raktáron" : "Nincs raktáron")}
        phonePrice={phone.phonePrice}
        colors={phone.colors || []}
        ramStoragePairs={phone.ramStoragePairs || []}
      />
    ))
  }

  const homePagesHistoryElements = homePreviousPages.map((page, index) => (
    <React.Fragment key={`${page.pageName}-${index}`}>
      <Link to={page.pageURL} className="pagesHistory">
        <div>{page.pageName}</div>
      </Link>
      {index < homePreviousPages.length - 1 && " / "}
    </React.Fragment>
  ));

  return (
    <div>
      {/* Banner Carousel - Full Width */}
      <div className="banner-carousel-section">
        <div className="banner-controls">
          <div className="banner-button-left">
            {
              activeBannerButton === "left" ?
                <button onClick={() => changeBannerPage(-1)} className="carouselButtonBanner">
                  <i className="fa-solid fa-arrow-left"></i>
                </button> : ""
            }
          </div>
          <div className="banner-content">
            {bannerPage === 0 && (
              <div className="banner-slide welcome-slide">
                <h1>Üdvözlünk a PhoneScout-ban!</h1>
                <p>Az Ön megbízható telefonkereskedője és szervíz partnere</p>
                <h3>Fedezze fel a legújabb telefonokat szuper árakon!</h3>
              </div>
            )}
            {bannerPage === 1 && (
              <div className="banner-slide promo-slide">
                <h1>Szuperajánlatok az egész hónapban!</h1>
                <p>Akár 30% kedvezmény a kiválasztott termékekre</p>
                <h3>Ne hagyja ki ezt az esélyt!</h3>
              </div>
            )}
          </div>
          <div className="banner-button-right">
            {
              activeBannerButton === "right" ?
                <button onClick={() => changeBannerPage(1)} className="carouselButtonBanner">
                  <i className="fa-solid fa-arrow-right"></i>
                </button> : ""
            }
          </div>
        </div>
        <div className="banner-dots">
          <div 
            className={`banner-dot ${bannerPage === 0 ? "banner-dotActive" : ""}`}
            onClick={() => {
              setBannerPage(0);
              setActiveBannerButton("right");
            }}
            style={{ cursor: 'pointer' }}
          ></div>
          <div 
            className={`banner-dot ${bannerPage === 1 ? "banner-dotActive" : ""}`}
            onClick={() => {
              setBannerPage(1);
              setActiveBannerButton("left");
            }}
            style={{ cursor: 'pointer' }}
          ></div>
        </div>
      </div>

      <div className="container mt-2" id="previousPagesPlace">
        {homePagesHistoryElements}
      </div>

      <div className="row">
        {!isMobileView && <div className="col-1">
          {
            activeChangeButton === "left" ? <button onClick={() => changePage(-1)} id="carouselButtonLeft" className="carouselButton">
              <i className="fa-solid fa-arrow-left"></i>
            </button> : ""
          }

        </div>}
        <div className={isMobileView ? 'col-12' : 'col-10'}>
          <div id='contentRow' className={isMobileView ? 'home-mobile-scroll' : ''}>
            {allPhonesData.length === 0 ? (
              <p>Telefonok betöltése...</p>
            ) : (
              displayPhoneCards()
            )}
          </div>
        </div>
        {!isMobileView && <>
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
        </>}

      </div>
      <div className="container service-section ">
        <div className="row align-items-center">
          <div className="col-lg-6 service-text">
            <h2>Gyors és Megbízható Szerviz</h2>
            <p>
              Meghibásodott a telefonod? Ne aggódj! Nálunk gyors és szakszerű javítást kapsz,
              hogy minél hamarabb újra használhasd a készüléked. Tapasztalt szakembereink és
              prémium minőségű alkatrészeink garantálják a hosszú távú megbízhatóságot.
            </p>
            <p>
              Miért válassz minket?</p>
            <ul>
              <li>Gyors javítás, akár néhány órán belül</li>
              <li>Kedvező árak és átlátható költségek</li>
              <li>Eredeti vagy prémium minőségű alkatrészek</li>
              <li>Garancia minden javításra</li>
            </ul>

            <Link className="btn btn-primary service-btn"
              to="/szervizigenyles">Irány a <strong>szervíz</strong>
              oldal</Link>
          </div>
          <div className="col-lg-6 service-image">
            <img loading="lazy" src="../Images/telefonservice.png" alt="Telefon Szervíz" className="rounded-image" />
          </div>
        </div>
      </div>
    </div>

  );
}
