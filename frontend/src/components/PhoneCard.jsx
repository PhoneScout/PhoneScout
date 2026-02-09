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
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    if (!phoneId) return;

    const loadFirstImage = async () => {
      try {
        const response = await fetch(
          `http://localhost:5175/api/blob/GetPicturesZip/${phoneId}`
        );

        if (!response.ok) {
          console.error("Képek nem találhatók!");
          return;
        }

        const zipBlob = await response.blob();
        const zip = await JSZip.loadAsync(zipBlob);

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

  useEffect(() => {
    const syncCompare = () => {
      const saved = JSON.parse(localStorage.getItem("comparePhones") || "[]");
      setCompareIds(saved);
    };

    syncCompare();
    window.addEventListener("compareUpdated", syncCompare);
    window.addEventListener("storage", syncCompare);

    return () => {
      window.removeEventListener("compareUpdated", syncCompare);
      window.removeEventListener("storage", syncCompare);
    };
  }, []);

  const isInCompare = compareIds.includes(phoneId);

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    
    if (!comparePhones.includes(phoneId)) {
      comparePhones.push(phoneId);
      localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
      window.dispatchEvent(new Event("compareUpdated"));

      const compareElement = document.getElementById("compareCount");
      if (compareElement) {
        compareElement.textContent = `(${comparePhones.length})`;
      }

      const compareIcon = document.getElementById("osszehasonlitas");
      if (compareIcon) {
        const buttonRect = e.currentTarget.getBoundingClientRect();
        const compareRect = compareIcon.getBoundingClientRect();

        const animDot = document.createElement("div");
        animDot.style.position = "fixed";
        animDot.style.left = buttonRect.left + buttonRect.width / 2 + "px";
        animDot.style.top = buttonRect.top + buttonRect.height / 2 + "px";
        animDot.style.width = "16px";
        animDot.style.height = "16px";
        animDot.style.background = "#68F145";
        animDot.style.borderRadius = "50%";
        animDot.style.zIndex = "9999";
        animDot.style.pointerEvents = "none";
        animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
        document.body.appendChild(animDot);

        setTimeout(() => {
          const compareCenterX = compareRect.left + compareRect.width / 2;
          const compareCenterY = compareRect.top + compareRect.height / 2;

          animDot.style.left = compareCenterX - animDot.offsetWidth / 2 + "px";
          animDot.style.top = compareCenterY - animDot.offsetHeight / 2 + "px";
          animDot.style.opacity = "0.2";
          animDot.style.transform = "scale(0.5)";
        }, 10);

        setTimeout(() => {
          animDot.style.transition = "all 0.5s cubic-bezier(.4,2,.6,1)";
          animDot.style.transform = "scale(10)";
          animDot.style.opacity = "0";
        }, 450);

        setTimeout(() => {
          animDot.remove();
        }, 1010);
      }
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[phoneId] = (cart[phoneId] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));

    const cartElement = document.getElementById("cart");
    if (cartElement) {
      const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
      cartElement.textContent = `${itemCount}`;
    }

    const cartIcon = document.getElementById("cart");
    if (cartIcon) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const animDot = document.createElement("div");
      animDot.style.position = "fixed";
      animDot.style.left = buttonRect.left + buttonRect.width / 2 + "px";
      animDot.style.top = buttonRect.top + buttonRect.height / 2 + "px";
      animDot.style.width = "16px";
      animDot.style.height = "16px";
      animDot.style.background = "#68F145";
      animDot.style.borderRadius = "50%";
      animDot.style.zIndex = "9999";
      animDot.style.pointerEvents = "none";
      animDot.style.transition = "all 2s cubic-bezier(.4,2,.6,1)";
      document.body.appendChild(animDot);

      setTimeout(() => {
        const cartCenterX = cartRect.left + cartRect.width / 2;
        const cartCenterY = cartRect.top + cartRect.height / 2;

        animDot.style.left = cartCenterX - animDot.offsetWidth / 2 + "px";
        animDot.style.top = cartCenterY - animDot.offsetHeight / 2 + "px";
        animDot.style.opacity = "0.2";
        animDot.style.transform = "scale(0.5)";
      }, 10);

      setTimeout(() => {
        animDot.style.transition = "all 0.5s cubic-bezier(.4,2,.6,1)";
        animDot.style.transform = "scale(10)";
        animDot.style.opacity = "0";
      }, 450);

      setTimeout(() => {
        animDot.remove();
      }, 1010);
    }
  };

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
        <div
          className={`button ${isInCompare ? "button--compare-added" : ""}`}
          onClick={handleCompareClick}
        >
          <img src="/images/compare-removebg-preview 1.png" alt="Összehasonlítás" />
        </div>
        <div className="button" onClick={handleCartClick}>
          <img src="/images/cart-removebg-preview 1.png" alt="Kosár" />
        </div>
      </div>
    </Link>
  );
}
