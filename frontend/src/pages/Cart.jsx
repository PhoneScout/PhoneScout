import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./Cart.css";
import axios from 'axios';

const EMPTY_ADDRESS = {
  postalCode: '',
  city: '',
  address: '',
  phoneNumber: ''
};

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
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
  const [deliveryAddressData, setDeliveryAddressData] = useState(EMPTY_ADDRESS);
  const [billingAddressData, setBillingAddressData] = useState(EMPTY_ADDRESS);
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressLoadError, setAddressLoadError] = useState('');

  const navigate = useNavigate();

  const getUserContext = () => {
    const userID = parseInt(localStorage.getItem("userid") || localStorage.getItem("userID") || "0", 10);
    const userEmail = localStorage.getItem("email") || localStorage.getItem("userEmail") || "";
    const userName = localStorage.getItem("fullname") || "";

    return { userID, userEmail, userName };
  };

  const normalizeAddress = (address) => ({
    postalCode: address?.postalCode?.toString() || '',
    city: address?.city || '',
    address: address?.address || '',
    phoneNumber: address?.phoneNumber?.toString() || ''
  });

  const areAddressesEqual = (a, b) => {
    return (
      (a.postalCode || '').trim() === (b.postalCode || '').trim() &&
      (a.city || '').trim().toLowerCase() === (b.city || '').trim().toLowerCase() &&
      (a.address || '').trim().toLowerCase() === (b.address || '').trim().toLowerCase() &&
      (a.phoneNumber || '').trim() === (b.phoneNumber || '').trim()
    );
  };

  const normalizeCart = () => {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(raw)) {
      // Ensure all items have storageIndex, default to 0 if missing
      return raw.map(item => ({
        ...item,
        storageIndex: item.storageIndex ?? 0
      }));
    }

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

  useEffect(() => {
    const savedCart = normalizeCart();
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5175/mainPage")
      .then(allPhones => {
        const phoneMap = new Map(allPhones.data.map(p => [p.phoneID, p]));

        const merged = cartItems.map(item => {
          const basePrice = item.phone?.phonePrice ?? item.phonePrice ?? 0;
          const storageIdx = item.storageIndex ?? 0;
          const calculatedPrice = Math.round(basePrice * (1 + storageIdx * 0.1));
          
          return {
            ...item,
            phone: phoneMap.get(item.phoneID),
            calculatedPrice
          };
        });

        setCartPhones(merged);

        const total = merged.reduce((sum, item) => {
          return sum + item.calculatedPrice * (item.quantity || 0);
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

  useEffect(() => {
    if (!showPaymentModal) return;

    const loadAddresses = async () => {
      const { userID } = getUserContext();

      if (!userID || Number.isNaN(userID) || userID <= 0) {
        setAddressLoadError('A címek betöltéséhez bejelentkezés szükséges.');
        setDeliveryAddressData(EMPTY_ADDRESS);
        setBillingAddressData(EMPTY_ADDRESS);
        setBillingSameAsDelivery(true);
        return;
      }

      setAddressLoadError('');
      setAddressLoading(true);

      try {
        const [shippingRes, billingRes] = await Promise.all([
          axios.get(`http://localhost:5175/api/address/GetAddresses/${userID}/1`),
          axios.get(`http://localhost:5175/api/address/GetAddresses/${userID}/0`)
        ]);

        const shippingAddress = normalizeAddress(Array.isArray(shippingRes.data) && shippingRes.data.length > 0 ? shippingRes.data[0] : null);
        const billingAddress = normalizeAddress(Array.isArray(billingRes.data) && billingRes.data.length > 0 ? billingRes.data[0] : null);

        const deliveryToSet = shippingAddress;
        const billingToSet = billingAddress.address || billingAddress.city || billingAddress.postalCode || billingAddress.phoneNumber
          ? billingAddress
          : shippingAddress;

        const isSame = areAddressesEqual(deliveryToSet, billingToSet);

        setDeliveryAddressData(deliveryToSet);
        setBillingAddressData(billingToSet);
        setBillingSameAsDelivery(isSame);
      } catch (error) {
        console.error('Hiba a címek betöltésekor:', error);
        setAddressLoadError('A címek betöltése sikertelen. A mezők kézzel kitölthetők.');
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddresses();
  }, [showPaymentModal]);

  // Load phone image from backend
  const loadPhoneImage = async (phoneID) => {
    try {
      const response = await axios.get(
        `http://localhost:5175/api/blob/GetIndex/${phoneID}`,
        { responseType: 'blob' }
      );

      if (response.status !== 200) {
        console.error("Kép nem található!");
        return;
      }

      const url = URL.createObjectURL(response.data);

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

  const handleAddressInputChange = (type, field, value) => {
    let processedValue = value;

    if (field === 'postalCode') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    if (field === 'phoneNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 15);
    }

    if (type === 'delivery') {
      setDeliveryAddressData(prev => ({ ...prev, [field]: processedValue }));

      if (billingSameAsDelivery) {
        setBillingAddressData(prev => ({ ...prev, [field]: processedValue }));
      }
    } else {
      setBillingAddressData(prev => ({ ...prev, [field]: processedValue }));
    }
  };

  const toggleBillingSameAsDelivery = (checked) => {
    setBillingSameAsDelivery(checked);

    if (checked) {
      setBillingAddressData(deliveryAddressData);
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        errors[key] = "A mező kitöltése kötelező!";
      }
    });

    const addressValidationErrors = {};
    const requiredFields = ['postalCode', 'city', 'address', 'phoneNumber'];

    requiredFields.forEach(field => {
      if (!deliveryAddressData[field]?.toString().trim()) {
        addressValidationErrors[`delivery-${field}`] = 'A mező kitöltése kötelező!';
      }
    });

    if (!billingSameAsDelivery) {
      requiredFields.forEach(field => {
        if (!billingAddressData[field]?.toString().trim()) {
          addressValidationErrors[`billing-${field}`] = 'A mező kitöltése kötelező!';
        }
      });
    }

    setFormErrors(errors);
    setAddressErrors(addressValidationErrors);

    return Object.keys(errors).length === 0 && Object.keys(addressValidationErrors).length === 0;
  };

  const openPaymentModal = () => {
    setFormErrors({});
    setAddressErrors({});
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      const { userID, userEmail, userName } = getUserContext();

      if (!userID || Number.isNaN(userID) || userID <= 0) {
        setAddressLoadError('A rendelés leadásához jelentkezz be újra.');
        return;
      }

      const selectedBillingAddress = billingSameAsDelivery ? deliveryAddressData : billingAddressData;
      const orderID = `ORD-${Date.now()}`;

      for (const item of cartPhones) {
        const phone = item.phone || {};
        const quantity = item.quantity || 0;
        const finalPrice = item.calculatedPrice ?? phone.phonePrice ?? item.phonePrice ?? 0;

        const orderData = {
          id: 0,
          orderID,
          userID,
          userEmail,
          userName,
          billingPostalCode: parseInt(selectedBillingAddress.postalCode, 10) || 0,
          billingCity: selectedBillingAddress.city,
          billingAddress: selectedBillingAddress.address,
          billingPhoneNumber: parseInt(selectedBillingAddress.phoneNumber, 10) || 0,
          deliveryPostalCode: parseInt(deliveryAddressData.postalCode, 10) || 0,
          deliveryCity: deliveryAddressData.city,
          deliveryAddress: deliveryAddressData.address,
          deliveryPhoneNumber: parseInt(deliveryAddressData.phoneNumber, 10) || 0,
          phoneName: phone.phoneName ?? item.phoneName ?? "",
          phoneColorName: item.colorName ?? "",
          phoneColorHex: item.colorHex ?? "",
          phoneRam: parseInt(item.ramAmount, 10) || 0,
          phoneStorage: parseInt(item.storageAmount, 10) || 0,
          price: Number(finalPrice),
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
              <div className="emptyCartMessage">
                <h>A kosarad üres.</h>
              </div>
            ) : (
              <div>
                <div className="totalPriceCart">
                  Végösszeg: {formatPrice(totalPrice)} Ft
                </div>

                <button className="paymentButton" onClick={openPaymentModal}>
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
                        <p>{formatPrice(item.calculatedPrice ?? phone.phonePrice ?? item.phonePrice ?? 0)} Ft <strong>/ db</strong></p>
                      </div>
                      <div className={`stock-bubbleCart ${phone.phoneInStore === 1 || phone.phoneInStore === "1" ? "phonestockTrue" : "phonestockFalse"}`}>
                        {phone.phoneInStore === 1 || phone.phoneInStore === "1" ? "Raktáron" : "Nincs raktáron"}
                      </div>
                      <div className="phoneQuantityCart">
                        <button
                          className={`decreaseQuantity ${quantity === 1 ? 'decreaseQuantity--delete' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(itemKey, -1);
                          }}
                        >
                          {quantity === 1 ? <i className="fa-solid fa-trash"></i> : "-"}
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
            {addressLoadError && <div className="error-message">{addressLoadError}</div>}
            {addressLoading && <div className="addressInfoText">Címadatok betöltése...</div>}
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

              <form className="modalForm" onSubmit={(e) => e.preventDefault()}>
                <h4>Szállítási cím</h4>
                <div className="addressInfoText">Automatikusan kitöltve a profil alapján, szükség esetén módosítható.</div>

                <label>Irányítószám:</label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  placeholder="1234"
                  value={deliveryAddressData.postalCode}
                  onChange={(e) => handleAddressInputChange('delivery', 'postalCode', e.target.value)}
                />
                {addressErrors['delivery-postalCode'] && <div className="invalid-feedback">{addressErrors['delivery-postalCode']}</div>}

                <label>Város:</label>
                <input
                  type="text"
                  required
                  placeholder="Város"
                  value={deliveryAddressData.city}
                  onChange={(e) => handleAddressInputChange('delivery', 'city', e.target.value)}
                />
                {addressErrors['delivery-city'] && <div className="invalid-feedback">{addressErrors['delivery-city']}</div>}

                <label>Cím:</label>
                <input
                  type="text"
                  required
                  placeholder="Utca, házszám"
                  value={deliveryAddressData.address}
                  onChange={(e) => handleAddressInputChange('delivery', 'address', e.target.value)}
                />
                {addressErrors['delivery-address'] && <div className="invalid-feedback">{addressErrors['delivery-address']}</div>}

                <label>Telefonszám:</label>
                <input
                  type="text"
                  required
                  placeholder="36301234567"
                  value={deliveryAddressData.phoneNumber}
                  onChange={(e) => handleAddressInputChange('delivery', 'phoneNumber', e.target.value)}
                />
                {addressErrors['delivery-phoneNumber'] && <div className="invalid-feedback">{addressErrors['delivery-phoneNumber']}</div>}

                <div className="addressCheckboxRow">
                  <input
                    id="billingSameAsDelivery"
                    type="checkbox"
                    checked={billingSameAsDelivery}
                    onChange={(e) => toggleBillingSameAsDelivery(e.target.checked)}
                  />
                  <label htmlFor="billingSameAsDelivery">A számlázási cím megegyezik a szállítási címmel</label>
                </div>
              </form>

              {!billingSameAsDelivery && (
                <form className="modalForm" onSubmit={(e) => e.preventDefault()}>
                  <h4>Számlázási cím</h4>

                  <label>Irányítószám:</label>
                  <input
                    type="text"
                    maxLength="4"
                    required
                    placeholder="1234"
                    value={billingAddressData.postalCode}
                    onChange={(e) => handleAddressInputChange('billing', 'postalCode', e.target.value)}
                  />
                  {addressErrors['billing-postalCode'] && <div className="invalid-feedback">{addressErrors['billing-postalCode']}</div>}

                  <label>Város:</label>
                  <input
                    type="text"
                    required
                    placeholder="Város"
                    value={billingAddressData.city}
                    onChange={(e) => handleAddressInputChange('billing', 'city', e.target.value)}
                  />
                  {addressErrors['billing-city'] && <div className="invalid-feedback">{addressErrors['billing-city']}</div>}

                  <label>Cím:</label>
                  <input
                    type="text"
                    required
                    placeholder="Utca, házszám"
                    value={billingAddressData.address}
                    onChange={(e) => handleAddressInputChange('billing', 'address', e.target.value)}
                  />
                  {addressErrors['billing-address'] && <div className="invalid-feedback">{addressErrors['billing-address']}</div>}

                  <label>Telefonszám:</label>
                  <input
                    type="text"
                    required
                    placeholder="36301234567"
                    value={billingAddressData.phoneNumber}
                    onChange={(e) => handleAddressInputChange('billing', 'phoneNumber', e.target.value)}
                  />
                  {addressErrors['billing-phoneNumber'] && <div className="invalid-feedback">{addressErrors['billing-phoneNumber']}</div>}
                </form>
              )}
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