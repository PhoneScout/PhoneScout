import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PhoneCard from '../components/PhoneCard';

export default function Home() {
  const allPhonesURL = "http://localhost:5165/api/GETmainPage";
  const [allPhonesData, setAllPhonesData] = useState([]);

  useEffect(() => {
    fetch(allPhonesURL)
      .then((response) => response.json())
      .then((data) => {
        setAllPhonesData(data);
      })
      .catch((error) => console.error("Hiba a JSON betöltésekor:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <br />

      {allPhonesData.length === 0 ? (
        <p>Telefonok betöltése...</p>
      ) : (
        allPhonesData.map((phone) => (
          <PhoneCard phoneName={phone.phoneName} phoneInStore={(phone.phoneInStore==="van"?"Raktáron":"Nincs raktáron")} phonePrice={phone.phonePrice} />
        ))
      )}
    </div>
  );
}
