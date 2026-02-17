import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import JSZip from 'jszip';
import "./Cart.css";
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [phones, setPhones] = useState([]);
  const [cartPhones, setCartPhones] = useState([]);
  const [phoneImages, setPhoneImages] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const normalizeCart = () => {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(raw)) return raw;

    const legacyItems = Object.entries(raw).map(([id, qty]) => ({
      phoneID: Number(id),
      quantity: Number(qty),
      colorName: "",
      colorHex: "",
      ramAmount: null,
      storageAmount: null,
      phoneName: "",
      phonePrice: 0
    }));
    localStorage.setItem("cart", JSON.stringify(legacyItems));
    return legacyItems;
  };

  useEffect(() => {
    const savedCart = normalizeCart();
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5175/mainPage")
      .then(allPhones => {
        setPhones(allPhones.data);

        const phoneMap = new Map(allPhones.data.map(p => [p.phoneID, p]));

        const merged = cartItems.map(item => ({
          ...item,
          phone: phoneMap.get(item.phoneID)
        }));

        setCartPhones(merged);

        const total = merged.reduce((sum, item) => {
          const price = item.phone?.phonePrice ?? item.phonePrice ?? 0;
          return sum + price * (item.quantity || 0);
        }, 0);
        setTotalPrice(total);

        merged.forEach(item => {
          if (item.phoneID) {
            loadPhoneImage(item.phoneID);
          }
        });
      })
      .catch(error => console.error("Error fetching phone data:", error));
  }, [cartItems]);

  // Load phone image from backend ZIP
  const loadPhoneImage = async (phoneID) => {
    try {
      const response = await axios.get(
        `http://localhost:5175/api/blob/GetPicturesZip/${phoneID}`
      );

      if (response.status !== 200) {
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

      setPhoneImages(prev => ({ ...prev, [phoneID]: url }));
    } catch (err) {
      console.error("Hiba a kép betöltésekor:", err);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleQuantityChange = (itemKey, delta) => {
    const newCart = [...cartItems];
    const idx = newCart.findIndex(i => getItemKey(i) === itemKey);
    if (idx === -1) return;

    const currentQuantity = newCart[idx].quantity || 0;

    if (currentQuantity + delta <= 0) {
      newCart.splice(idx, 1);
    } else {
      newCart[idx].quantity = currentQuantity + delta;
    }

    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (itemKey) => {
    const newCart = cartItems.filter(i => getItemKey(i) !== itemKey);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const getItemKey = (item) =>
    `${item.phoneID}-${item.colorHex || ""}-${item.ramAmount || ""}-${item.storageAmount || ""}`;

  const handlePhoneClick = (phoneID) => {
    localStorage.setItem("selectedPhone", phoneID);
    navigate(`/telefon/${phoneID}`);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let processedValue = value;

    // Apply formatting based on field type
    switch (id) {
      case "cardNumber":
        processedValue = value.replace(/\D/g, "");
        processedValue = processedValue.slice(0, 16);
        processedValue = processedValue.replace(/(.{4})/g, "$1 ").trim();
        break;
      case "cvc":
        processedValue = value.replace(/\D/g, "");
        processedValue = processedValue.slice(0, 3);
        break;
      case "expiry":
        processedValue = value.replace(/\D/g, "");
        if (processedValue.length > 4) processedValue = processedValue.slice(0, 4);
        if (processedValue.length > 2) {
          let month = processedValue.slice(0, 2);
          if (parseInt(month, 10) > 12) month = "12";
          processedValue = month + "/" + processedValue.slice(2);
        }
        break;
      case "cardName":
        processedValue = value.replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]/g, "");
        break;
      default:
        break;
    }

    setFormData(prev => ({ ...prev, [id]: processedValue }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        errors[key] = "A mező kitöltése kötelező!";
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      const userID = parseInt(localStorage.getItem("userID") || "0", 10);
      const userEmail = localStorage.getItem("userEmail") || "";

      for (const item of cartPhones) {
        const phone = item.phone || {};
        const quantity = item.quantity || 0;

        const orderData = {
          id: 0,
          orderID: `ORD-${Date.now()}`,
          userID,
          userEmail,
          postalCode: "1234",
          city: "Tesztváros",
          address: "Teszt utca 1",
          phoneNumber: "36301234567",
          phoneName: phone.phoneName ?? item.phoneName ?? "",
          phoneColorName: item.colorName ?? "",
          phoneColorHex: item.colorHex ?? "",
          phoneRam: parseInt(item.ramAmount, 10) || 0,
          phoneStorage: parseInt(item.storageAmount, 10) || 0,
          price: Number(phone.phonePrice ?? item.phonePrice ?? 0),
          amount: Number(quantity),
          status: 0
        };

        const response = await axios.post("http://localhost:5175/api/Profile/postOrder", orderData);

        const responseText = await response.data;

        console.log("STATUS:", response.status);
        console.log("RESPONSE BODY:", responseText);
        console.log("SENT DATA:", { dto: orderData });

        if (response.status !== 200) {
          return;
        }
      }

      setCartItems([]);
      localStorage.setItem("cart", JSON.stringify([]));

      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div>

      <div className="kosaradText">
        <h1>A kosarad</h1>
      </div>

      <div className="kosar">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            {cartPhones.length === 0 ? (
              <p>A kosarad üres.</p>
            ) : (
              <div>
                <div className="totalPriceCart">
                  Végösszeg: {formatPrice(totalPrice)} Ft
                </div>

                <button className="paymentButton" onClick={() => setShowPaymentModal(true)}>
                  Fizetés
                </button>

                {cartPhones.map(item => {
                  const phone = item.phone || {};
                  const quantity = item.quantity || 0;
                  const itemKey = getItemKey(item);
                  return (

                    <div
                      key={itemKey}
                      className="phoneRowCart"
                      onClick={(e) => {
                        if (!e.target.classList.contains("decreaseQuantity") &&
                          !e.target.classList.contains("increaseQuantity") &&
                          !e.target.classList.contains("removeFromCart")) {
                          handlePhoneClick(item.phoneID);
                        }
                      }}
                    >
                      <div className="phoneImageCartSpecial">
                        <img
                          src={phoneImages[item.phoneID] || "/images/placeholder.png"}
                          alt={phone.phoneName}
                        />
                      </div>

                      <div className="phoneDetailsCart">
                        <h3>{phone.phoneName}</h3>
                        <div className="variantInfo">
                          <span
                            className="colorSwatch"
                            style={{ backgroundColor: item.colorHex || "#ccc" }}
                            title={item.colorName || "N/A"}
                          />
                          <span>{item.colorName || "Ismeretlen szín"}</span>
                          <span className="variantSeparator">|</span>
                          <span>{item.ramAmount} GB / {item.storageAmount} GB</span>
                        </div>
                      </div>

                      <div className="phonePriceCart">
                        <p>{formatPrice(phone.phonePrice ?? item.phonePrice ?? 0)} Ft</p>
                      </div>
                      <div className={`stock-bubbleCart ${phone.phoneInStore === "van" ? "phonestockTrue" : "phonestockFalse"}`}>
                        {phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron"}
                      </div>
                      <div className="phoneQuantityCart">
                        <button
                          className="decreaseQuantity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(itemKey, -1);
                          }}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="increaseQuantity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(itemKey, 1);
                          }}
                        >
                          +
                        </button>
                        <button
                          className="removeFromCart"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(itemKey);
                          }}
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="col-2"></div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="paymentModal" style={{ display: 'flex' }}>
          <div className="modalContent">
            <span className="closeModal" onClick={() => setShowPaymentModal(false)}>&times;</span>
            <h2 className="modalTitle">Fizetés</h2>
            <div className="formsContainer">
              <form id="paymentForm" className="modalForm" onSubmit={(e) => e.preventDefault()}>
                <h4>Bankkártya adatok</h4>
                <label>Kártyaszám:</label>
                <input
                  type="text"
                  id="cardNumber"
                  maxLength="19"
                  required
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  autoFocus
                />
                {formErrors.cardNumber && <div className="invalid-feedback">{formErrors.cardNumber}</div>}

                <label>Lejárat:</label>
                <input
                  type="text"
                  id="expiry"
                  maxLength="5"
                  required
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                />
                {formErrors.expiry && <div className="invalid-feedback">{formErrors.expiry}</div>}

                <label>CVC:</label>
                <input
                  type="text"
                  id="cvc"
                  maxLength="3"
                  required
                  placeholder="123"
                  value={formData.cvc}
                  onChange={handleInputChange}
                />
                {formErrors.cvc && <div className="invalid-feedback">{formErrors.cvc}</div>}

                <label>Kártyán szereplő név:</label>
                <input
                  type="text"
                  id="cardName"
                  required
                  placeholder="Név"
                  value={formData.cardName}
                  onChange={handleInputChange}
                />
                {formErrors.cardName && <div className="invalid-feedback">{formErrors.cardName}</div>}
              </form>
            </div>
            <button
              id="submitPayment"
              className="submitPaymentBtn paymentButton"
              type="button"
              onClick={handlePayment}
            >
              Fizetés leadása
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="payment-success-modal" style={{ display: 'flex' }}>
          <div className="payment-success-content">
            <h2>Fizetés sikeres!</h2>
            <p>Köszönjük a vásárlást!</p>
            <button
              id="closeSuccessModal"
              className="submitPaymentBtn paymentButton"
              style={{ marginTop: '20px' }}
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
              type="button"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}