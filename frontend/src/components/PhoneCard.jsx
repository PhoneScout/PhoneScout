import React, { useState, useEffect } from "react";
import "./PhoneCard.css";
import { Link } from "react-router-dom";
import JSZip from "jszip";

export default function PhoneCard({
  phoneId,
  phoneName,
  phoneInStore,
  phonePrice
}) {
  const [phoneImg, setPhoneImg] = useState(null);

  useEffect(() => {
    if (!phoneId) return;

    const loadFirstImage = async () => {
      try {
        // ZIP lekérése a backendről
        const response = await fetch(
          `http://localhost:5175/api/blob/GetPicturesZip/${phoneId}`
        );

        if (!response.ok) {
          console.error("Képek nem találhatók!");
          return;
        }

        const zipBlob = await response.blob();
        const zip = await JSZip.loadAsync(zipBlob);

        // Első fájl kiválasztása
        const firstFileName = Object.keys(zip.files)[0];
        const firstFile = zip.files[firstFileName];

        const blob = await firstFile.async("blob");
        const url = URL.createObjectURL(blob);

        setPhoneImg(url);
      } catch (err) {
        console.error("Hiba a kép betöltésekor:", err);
      }
    };

    loadFirstImage();
  }, [phoneId]);

  return (
    <Link to={`/telefon/${phoneId}`} className="phone-card-link phoneRow">
      <div className="phoneImage">
        <img
          src={phoneImg || "/images/placeholder.png"}
          alt={phoneName}
        />
        <div className="price-bubble">{phonePrice} Ft</div>
        <div className="stock-bubble phonestockFalse">{phoneInStore}</div>
      </div>

      <div className="phoneDetails">
        <h3>{phoneName}</h3>
      </div>

      <div className="cardButtons">
        <div className="button">
          <img src="/images/compare-removebg-preview 1.png" alt="Összehasonlítás" />
        </div>
        <div className="button">
          <img src="/images/cart-removebg-preview 1.png" alt="Kosár" />
        </div>
      </div>
    </Link>
  );
}
