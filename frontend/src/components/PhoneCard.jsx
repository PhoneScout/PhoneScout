import React, { useState, useEffect } from "react";
import "./PhoneCard.css";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import axios from "axios";

export default function PhoneCard({
  phoneId,
  phoneName,
  phoneInStore,
  phonePrice,
  colors = [],
  ramStoragePairs = []
}) {
  const [phoneImg, setPhoneImg] = useState(null);
  const [compareIds, setCompareIds] = useState([]);

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);
  const [selectedPairIdx, setSelectedPairIdx] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [colorError, setColorError] = useState(false);
  const [pairError, setPairError] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(phonePrice);

  useEffect(() => {
    if (!phoneId) return;

    const loadFirstImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5175/api/blob/GetIndex/${phoneId}`,
          { responseType: 'blob' }
        );

        if (response.status !== 200) {
          console.error("Kép nem található!");
          return;
        }

        const url = URL.createObjectURL(response.data);
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

  // Calculate price based on storage index
  useEffect(() => {
    if (selectedPairIdx !== null && phonePrice) {
      const basePrice = phonePrice;
      const priceMultiplier = 1 + (selectedPairIdx * 0.1);
      setCalculatedPrice(Math.round(basePrice * priceMultiplier));
    } else {
      setCalculatedPrice(phonePrice);
    }
  }, [selectedPairIdx, phonePrice]);

  const isInCompare = compareIds.includes(phoneId);
  const isInStock =
    phoneInStore === 1 ||
    phoneInStore === true ||
    String(phoneInStore).trim().toLowerCase() === "raktáron";

  const normalizeCart = () => {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(raw)) {
      // Ensure all items have storageIndex, default to 0 if missing
      return raw.map(item => ({
        ...item,
        storageIndex: item.storageIndex ?? 0
      }));
    }

    // Legacy object -> array
    const legacyItems = Object.entries(raw).map(([id, qty]) => ({
      phoneID: Number(id),
      quantity: Number(qty),
      colorName: "",
      colorHex: "",
      ramAmount: null,
      storageAmount: null,
      storageIndex: 0,
      phoneName: "",
      phonePrice: 0
    }));
    localStorage.setItem("cart", JSON.stringify(legacyItems));
    return legacyItems;
  };

  const getCartCount = (items) =>
    items.reduce((sum, item) => sum + (item.quantity || 0), 0);

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
    
    // Only show modal if colors and ramStoragePairs are provided
    if (colors.length === 0 || ramStoragePairs.length === 0) {
      return;
    }
    
    setSelectedColor(null);
    setSelectedPair(null);
    setSelectedPairIdx(null);
    setSelectedQty(1);
    setColorError(false);
    setPairError(false);
    setCalculatedPrice(phonePrice);
    setShowVariantModal(true);
  };

  const addToCartWithVariants = () => {
    let hasErrors = false;

    if (!selectedColor) {
      setColorError(true);
      hasErrors = true;
    } else {
      setColorError(false);
    }

    if (!selectedPair || selectedPairIdx === null) {
      setPairError(true);
      hasErrors = true;
    } else {
      setPairError(false);
    }

    if (hasErrors || selectedQty < 1) return;

    const cartItems = normalizeCart();
    const matchIndex = cartItems.findIndex(
      (item) =>
        item.phoneID === phoneId &&
        item.colorHex === selectedColor.colorHex &&
        item.ramAmount === selectedPair.ramAmount &&
        item.storageAmount === selectedPair.storageAmount
    );

    if (matchIndex >= 0) {
      cartItems[matchIndex].quantity += selectedQty;
    } else {
      cartItems.push({
        phoneID: phoneId,
        quantity: selectedQty,
        colorName: selectedColor.colorName,
        colorHex: selectedColor.colorHex,
        ramAmount: selectedPair.ramAmount,
        storageAmount: selectedPair.storageAmount,
        storageIndex: selectedPairIdx,
        phoneName,
        phonePrice
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));

    // Trigger cart update event to notify Navbar
    window.dispatchEvent(new Event("cartUpdated"));

    setShowVariantModal(false);
  };

  return (
    <>
      <Link to={`/telefon/${phoneId}`} className="phone-card-link phoneRow">
        <div className="phoneImage">
          <img
            src={phoneImg}
            alt={phoneName}
          />
          <div className="price-bubble">{phonePrice} Ft</div>
          <div className={`stock-bubble ${isInStock ? "phonestockTrue" : "phonestockFalse"}`}>
            {phoneInStore}
          </div>
        </div>

        <div className="phoneDetails">
          <h3>{phoneName}</h3>
        </div>

        <div className="cardButtons">
          <div
            className={`button ${isInCompare ? "button--compare-added" : ""}`}
            onClick={handleCompareClick}
          >
            <i className="fa-solid fa-scale-unbalanced-flip"></i>
          </div>
          <div className="button" onClick={handleCartClick}>
            <i className="fa-solid fa-cart-shopping" ></i>
          </div>
        </div>
      </Link>

      {showVariantModal && colors.length > 0 && ramStoragePairs.length > 0 && createPortal(
        <div className="phoneCardVariantModalOverlay" onClick={() => setShowVariantModal(false)}>
          <div className="phoneCardVariantModal" onClick={(e) => e.stopPropagation()}>
            <h3>Válassz színt és RAM/Storage verziót</h3>

            <div className="phoneCardVariantSection">
              <div className="phoneCardVariantTitle">Szín</div>
              <div className="phoneCardColorOptions">
                {colors.map((c, idx) => (
                  <button
                    key={`${c.colorHex}-${idx}`}
                    className={`phoneCardColorCircle ${selectedColor?.colorHex === c.colorHex ? "phoneCardColorCircle--selected" : ""}`}
                    style={{ backgroundColor: c.colorHex }}
                    title={c.colorName}
                    onClick={() => {
                      setSelectedColor(c);
                      setColorError(false);
                    }}
                    type="button"
                  />
                ))}
              </div>
              {selectedColor && (
                <div className="phoneCardVariantLabel">{selectedColor.colorName}</div>
              )}
              {colorError && (
                <div className="phoneCardVariantError">Kérjük, válasszon ki egy színt!</div>
              )}
            </div>

            <div className="phoneCardVariantSection">
              <div className="phoneCardVariantTitle">RAM / Storage</div>
              <div className="phoneCardPairOptions">
                {ramStoragePairs.map((p, idx) => (
                  <button
                    key={`${p.ramAmount}-${p.storageAmount}-${idx}`}
                    className={`phoneCardPairButton ${selectedPairIdx === idx ? "phoneCardPairButton--selected" : ""}`}
                    onClick={() => {
                      setSelectedPair(p);
                      setSelectedPairIdx(idx);
                      setPairError(false);
                    }}
                    type="button"
                  >
                    {p.ramAmount} GB / {p.storageAmount} GB
                  </button>
                ))}
              </div>
              {pairError && (
                <div className="phoneCardVariantError">Kérjük, válasszon ki egy RAM/Storage verziót!</div>
              )}
            </div>

            <div className="phoneCardVariantSection">
              <div className="phoneCardVariantTitle">Mennyiség</div>
              <div className="phoneCardPairOptions">
                <button
                  className="phoneCardPairButton"
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="phoneCardQuantityNumber">{selectedQty}</span>
                <button
                  className="phoneCardPairButton"
                  type="button"
                  onClick={() => setSelectedQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="phoneCardVariantSection">
              <div className="phoneCardVariantTitle">Ár</div>
              <div className="phoneCardVariantLabel" style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#666' }}>
                {calculatedPrice?.toLocaleString()} Ft / db
              </div>
              <div className="phoneCardVariantLabel" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#68F145', marginTop: '8px' }}>
                {(calculatedPrice * selectedQty)?.toLocaleString()} Ft
              </div>
            </div>

            <div className="phoneCardVariantActions">
              <button className="phoneCardVariantCancel" onClick={() => setShowVariantModal(false)} type="button">
                Mégse
              </button>
              <button
                className="phoneCardVariantConfirm"
                onClick={addToCartWithVariants}
                type="button"
              >
                Kosárba
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
