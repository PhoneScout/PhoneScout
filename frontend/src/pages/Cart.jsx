import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState({});
  const [phones, setPhones] = useState([]);
  const [cartPhones, setCartPhones] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
    fullName: '',
    city: '',
    zip: '',
    address: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(savedCart);
  }, []);

  // Fetch phones and update cart items
  useEffect(() => {
    fetch("http://localhost:5165/api/GETmainPage")
      .then(response => response.json())
      .then(allPhones => {
        setPhones(allPhones);
        const filtered = allPhones.filter(phone => cart[phone.phoneID] > 0);
        setCartPhones(filtered);

        // Calculate total price
        const total = filtered.reduce((sum, phone) => {
          const quantity = cart[phone.phoneID] || 0;
          return sum + phone.phonePrice * quantity;
        }, 0);
        setTotalPrice(total);
      })
      .catch(error => console.error("Error fetching phone data:", error));
  }, [cart]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleQuantityChange = (phoneID, delta) => {
    const newCart = { ...cart };
    const currentQuantity = newCart[phoneID] || 0;

    if (currentQuantity + delta <= 0) {
      delete newCart[phoneID];
    } else {
      newCart[phoneID] = currentQuantity + delta;
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (phoneID) => {
    const newCart = { ...cart };
    delete newCart[phoneID];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handlePhoneClick = (phoneID) => {
    localStorage.setItem("selectedPhone", phoneID);
    navigate("/telefonoldal");
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
      case "fullName":
        processedValue = value.replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]/g, "");
        break;
      case "city":
        processedValue = value.replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]/g, "");
        break;
      case "zip":
        processedValue = value.replace(/\D/g, "");
        processedValue = processedValue.slice(0, 4);
        break;
      case "phone":
        processedValue = value.replace(/\D/g, "");
        processedValue = processedValue.slice(0, 20);
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
      // Send orders
      const userID = localStorage.getItem("userID");
      for (const phone of cartPhones) {
        const quantity = cart[phone.phoneID] || 0;
        const orderData = {
          userID: userID,
          phoneID: phone.phoneID,
          amount: quantity,
          price: parseInt(phone.phonePrice) * parseInt(quantity),
          status: 0,
          fullName: formData.fullName,
          city: formData.city,
          postalCode: formData.zip,
          address: formData.address,
          phoneNumber: formData.phone
        };

        await fetch('http://localhost:5165/api/POSTorder/orderPost', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
      }

      // Clear cart
      setCart({});
      localStorage.setItem("cart", JSON.stringify({}));

      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  // Payment Modal Component
  const PaymentModal = () => (
    <div className="paymentModal" style={{ display: showPaymentModal ? 'flex' : 'none' }}>
      <div className="modalContent">
        <span className="closeModal" onClick={() => setShowPaymentModal(false)}>&times;</span>
        <h2 className="modalTitle">Fizetés</h2>
        <div className="formsContainer">
          <form id="paymentForm" className="modalForm">
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

          <form id="shippingForm" className="modalForm">
            <h4>Szállítási adatok</h4>
            <label>Teljes név:</label>
            <input
              type="text"
              id="fullName"
              required
              placeholder="Név"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}

            <label>Város:</label>
            <input
              type="text"
              id="city"
              required
              placeholder="Város"
              value={formData.city}
              onChange={handleInputChange}
            />
            {formErrors.city && <div className="invalid-feedback">{formErrors.city}</div>}

            <label>Irányítószám:</label>
            <input
              type="text"
              id="zip"
              maxLength="4"
              required
              placeholder="1234"
              value={formData.zip}
              onChange={handleInputChange}
            />
            {formErrors.zip && <div className="invalid-feedback">{formErrors.zip}</div>}

            <label>Cím:</label>
            <input
              type="text"
              id="address"
              required
              placeholder="Utca, házszám"
              value={formData.address}
              onChange={handleInputChange}
            />
            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}

            <label>Telefonszám:</label>
            <input
              type="text"
              id="phone"
              maxLength="11"
              required
              placeholder="36301234567"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
          </form>
        </div>
        <button id="submitPayment" className="submitPaymentBtn paymentButton" onClick={handlePayment}>
          Fizetés leadása
        </button>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div className="payment-success-modal" style={{ display: showSuccessModal ? 'flex' : 'none' }}>
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
          }}>        
          Bezárás
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      
      <div class="kosaradText">
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
                <div className="totalPrice" style={{ marginBottom: "20px", fontSize: "1.5em", fontWeight: "bold" }}>
                  Végösszeg: {formatPrice(totalPrice)} Ft
                </div>

                <button className="paymentButton" onClick={() => setShowPaymentModal(true)}>
                  Fizetés
                </button>

                {cartPhones.map(phone => {
                  const quantity = cart[phone.phoneID] || 0;
                  return (
                    <div
                      key={phone.phoneID}
                      className="phoneRow"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        if (!e.target.classList.contains("decreaseQuantity") &&
                          !e.target.classList.contains("increaseQuantity") &&
                          !e.target.classList.contains("removeFromCart")) {
                          handlePhoneClick(phone.phoneID);
                        }
                      }}
                    >
                      <div className="phoneImageCartSpecial" style={{ flex: 1, textAlign: "center" }}>
                        <img
                          src={phone.imageUrl || '/Images/image 3.png'}
                          alt={phone.phoneName}
                          loading="lazy"
                          style={{ maxWidth: "80px", maxHeight: "80px" }}
                        />
                      </div>
                      <div className="phoneDetails" style={{ flex: 3, paddingLeft: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.2em" }}>{phone.phoneName}</h3>
                        <p style={{ margin: "0.2em 0" }}>RAM: {phone.ram || '-'}</p>
                        <p style={{ margin: "0.2em 0" }}>Tárhely: {phone.storage || '-'}</p>
                        <p style={{ margin: "0.2em 0" }}>Szín: {phone.color || '-'}</p>
                        <p style={{ margin: "0.2em 0", color: phone.inStock ? 'green' : 'red' }}>
                          {phone.inStock ? 'Raktáron' : 'Nincs raktáron'}
                        </p>
                      </div>
                      <div className="phonePrice" style={{ flex: 2, textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "1em" }}>{formatPrice(phone.phonePrice)} Ft</p>
                      </div>
                      <div className="phoneQuantity" style={{ flex: 3, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button
                          className="decreaseQuantity"
                          style={{ marginRight: "10px" }}
                          onClick={() => handleQuantityChange(phone.phoneID, -1)}
                        >
                          -
                        </button>
                        <p style={{ margin: 0, fontSize: "1em" }}>{quantity}</p>
                        <button
                          className="increaseQuantity"
                          style={{ marginLeft: "10px", marginRight: "10px" }}
                          onClick={() => handleQuantityChange(phone.phoneID, 1)}
                        >
                          +
                        </button>
                        <button
                          className="removeFromCart"
                          style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                          onClick={() => removeFromCart(phone.phoneID)}
                        >
                          Eltávolítás a kosárból
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
      
      <Footer />
      <PaymentModal />
      <SuccessModal />
    </div>
  );
}