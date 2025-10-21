import React, { useEffect, useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import Navbar from '../components/Navbar';
import PhoneCard from '../components/PhoneCard';

export default function Home() {
  const allPhonesURL = "http://localhost:5165/api/GETmainPage";

  let currentPage = 0;
  let activeChangeButton = "right"
  let phonesPerPage = 4;


  const [allPhonesData, setAllPhonesData] = useState([]);

  useEffect(() => {
    fetch(allPhonesURL)
      .then((response) => response.json())
      .then((data) => {
        setAllPhonesData(data);
      })
      .catch((error) => console.error("Hiba a JSON betöltésekor:", error));
  }, []);


  function alma(direction) {
    console.log(currentPage);
    console.log(activeChangeButton);
    currentPage += direction;
    if (currentPage === 1) {
      activeChangeButton = "left"
    }
    else if (currentPage === 0) {
      activeChangeButton = "right"
    }
  }

  function displayPhoneCards(start) {
    allPhonesData.slice(start, 4).map((phone) => (
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
            activeChangeButton === "left" ? <button onClick={() => alma(-1)} id="carouselButtonLeft" className="carouselButton">
              <i className="fa-solid fa-arrow-left"></i>
            </button> : <button onClick={() => alma(1)} id="carouselButtonRight" className="carouselButton">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          }

        </div>
        <div className='col-10'>
          <div id='contentRow' className='contentRow'>
            {allPhonesData.length === 0 ? (
              <p>Telefonok betöltése...</p>
            ) : (
              allPhonesData.slice(0, 4).map((phone) => (
                <PhoneCard phoneName={phone.phoneName} phoneInStore={(phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron")} phonePrice={phone.phonePrice} />
              ))
            )}
          </div>
        </div>
        <div className="col-1">
          {
            activeChangeButton === "right" ? <button onClick={() => alma(1)} id="carouselButtonRight" className="carouselButton">
              <i className="fa-solid fa-arrow-right"></i>
            </button> : <button onClick={() => alma(-1)} id="carouselButtonLeft" className="carouselButton">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          }
        </div>
      </div>

      <div className="hr">
        <hr size="5" />
      </div>

    </div>
  );
}
