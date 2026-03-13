import React, { useEffect, useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './Home.css';
// eslint-disable-next-line no-unused-vars
import Navbar from '../components/Navbar'; //we still need the import here
import PhoneCard from '../components/PhoneCard';
import { Link } from 'react-router';
import axios from 'axios';

// Render home page.
export default function Home() {
  const allPhonesURL = "http://localhost:5175/mainPage";
  const eventsURL = "http://localhost:5175/api/event";

  const [bannerPage, setBannerPage] = useState(0);
  const [manualBannerNavigationCount, setManualBannerNavigationCount] = useState(0);
  const [allEventsData, setAllEventsData] = useState([]);
  const [nowTime, setNowTime] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(0);
  const [activeChangeButton, setActiveChangeButton] = useState("right");
  // eslint-disable-next-line no-unused-vars
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 991.98);



  const [allPhonesData, setAllPhonesData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [homePreviousPages, setHomePreviousPages] = useState(() => {
    const stored = localStorage.getItem("pagesHistory");
    return stored ? JSON.parse(stored) : [{ pageName: "Főoldal", pageURL: "/" }];
  });

  // Load home data.
  useEffect(() => {
    axios.get(allPhonesURL)
      .then((response) => {
        setAllPhonesData(response.data);
      })
      .catch((error) => console.error("Hiba a JSON betöltésekor:", error));

    axios.get(eventsURL)
      .then((response) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const twoWeeksLaterEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59, 59, 999);

        const upcomingTwoWeekEvents = response.data
          .filter((event) => {
            const eventDate = new Date(event.eventDate);
            return !Number.isNaN(eventDate.getTime()) && eventDate >= todayStart && eventDate <= twoWeeksLaterEnd;
          })
          .sort((firstEvent, secondEvent) => new Date(firstEvent.eventDate) - new Date(secondEvent.eventDate));

        setAllEventsData(upcomingTwoWeekEvents);
      })
      .catch((error) => console.error("Hiba az eventos adatok betöltésekor:", error));
  }, []);

  // Update countdown timer.
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  // Change phone page.
  function changePage(direction) {
    const newPage = currentPage + direction;
    setCurrentPage(newPage);

    if (newPage === 1) {
      setActiveChangeButton("left");
    } else if (newPage === 0) {
      setActiveChangeButton("right");
    }
  }

  // Change banner page.
  function changeBannerPage(direction, isManual = false) {
    const eventSlideCount = allEventsData.length > 0 ? allEventsData.length : 1;
    const totalBannerSlides = 2 + eventSlideCount;

    let newPage = bannerPage + direction;

    if (newPage < 0) {
      newPage = totalBannerSlides - 1;
    }

    if (newPage > totalBannerSlides - 1) {
      newPage = 0;
    }

    setBannerPage(newPage);

    if (isManual) {
      setManualBannerNavigationCount((prevCount) => prevCount + 1);
    }
  }

  // Set banner page directly.
  function setBannerPageManually(targetPage) {
    const eventSlideCount = allEventsData.length > 0 ? allEventsData.length : 1;
    const totalBannerSlides = 2 + eventSlideCount;
    const boundedPage = Math.max(0, Math.min(targetPage, totalBannerSlides - 1));

    setBannerPage(boundedPage);
    setManualBannerNavigationCount((prevCount) => prevCount + 1);
  }

  // Auto-rotate banner.
  useEffect(() => {
    const eventSlideCount = allEventsData.length > 0 ? allEventsData.length : 1;
    const totalBannerSlides = 2 + eventSlideCount;

    const bannerTimeout = setTimeout(() => {
      setBannerPage((prevPage) => {
        return prevPage === totalBannerSlides - 1 ? 0 : prevPage + 1;
      });
    }, 10000);

    return () => clearTimeout(bannerTimeout);
  }, [allEventsData, bannerPage, manualBannerNavigationCount]);

  // Render phone cards.
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

  const eventSlideCount = allEventsData.length > 0 ? allEventsData.length : 1;
  const totalBannerSlides = 2 + eventSlideCount;
  const currentEvent = bannerPage >= 2 ? allEventsData[bannerPage - 2] : null;

  // Format event date.
  const formatEventDate = (dateValue) => {
    if (!dateValue) {
      return "Dátum nincs megadva";
    }

    const eventDate = new Date(dateValue);
    const year = eventDate.getFullYear();
    const monthNames = ['januar', 'februar', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
    const month = monthNames[eventDate.getMonth()];
    const day = eventDate.getDate();
    const hours = String(eventDate.getHours()).padStart(2, '0');
    const minutes = String(eventDate.getMinutes()).padStart(2, '0');

    return `${year} ${month} ${day}. ${hours}:${minutes}`;
  };

  // Format countdown text.
  const formatCountdown = (dateValue) => {
    if (!dateValue) {
      return "Nincs időpont";
    }

    const eventDate = new Date(dateValue);

    if (Number.isNaN(eventDate.getTime())) {
      return "Érvénytelen időpont";
    }

    const differenceInMs = eventDate.getTime() - nowTime.getTime();

    if (differenceInMs <= 0) {
      return "Esemény folyamatban";
    }

    const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} nap ${hours} óra ${minutes} perc`;
  };

  return (
    <div>
      <div className="banner-carousel-section">
        <div className="banner-controls">
          <div className="banner-button-left">
            <button onClick={() => changeBannerPage(-1, true)} className="carouselButtonBanner">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          </div>
          <div className="banner-content">
            {bannerPage === 0 && (
              <div className="banner-slide welcome-slide">
                <h1>Üdvözlünk a PhoneScout-ban!</h1>
                <p>A te megbízható telefonkereskedőd és szervíz partnered</p>
                <h3>Fedezd fel a legújabb telefonokat szuper árakon!</h3>
              </div>
            )}
            {bannerPage === 1 && (
              <div className="banner-slide promo-slide">
                <h1>Szuper ajánlatok az egész hónapban!</h1>
                <p>Akár 30% kedvezmény a kiválasztott termékekre</p>
                <h3>Ne hagyd ki ezt az esélyt!</h3>
              </div>
            )}
            {bannerPage >= 2 && (
              <div className="banner-slide events-slide">
                {currentEvent ? (
                  <a
                    href={currentEvent.eventURL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-slide-link"
                    onClick={(event) => {
                      if (!currentEvent.eventURL) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <div className="event-slide-content">
                      <div className="event-slide-image-wrap">
                        {currentEvent.imageBase64 ? (
                          <img
                            src={`data:${currentEvent.contentType};base64,${currentEvent.imageBase64}`}
                            alt={currentEvent.eventName}
                            className="event-slide-image"
                          />
                        ) : (
                          <div className="event-slide-image-placeholder">Nincs kép</div>
                        )}
                      </div>
                      <div className="event-slide-text">
                        <h2>{currentEvent.eventName}</h2>
                        {currentEvent.eventHostName && (
                          <p className="event-host-name">{currentEvent.eventHostName}</p>
                        )}
                        <p className="event-date-text">{formatEventDate(currentEvent.eventDate)}</p>
                        <div className="event-countdown">{formatCountdown(currentEvent.eventDate)}</div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <p className="no-events">Jelenleg nincsenek aktív események</p>
                )}
              </div>
            )}
          </div>
          <div className="banner-button-right">
            <button onClick={() => changeBannerPage(1, true)} className="carouselButtonBanner">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="banner-dots">
          {Array.from({ length: totalBannerSlides }).map((_, index) => (
            <div
              key={`banner-dot-${index}`}
              className={`banner-dot ${bannerPage === index ? "banner-dotActive" : ""}`}
              onClick={() => setBannerPageManually(index)}
              style={{ cursor: 'pointer' }}
            ></div>
          ))}
        </div>
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
              to="/szerviz">Irány a <strong>szervíz</strong>
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
