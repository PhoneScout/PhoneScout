import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { getCityFromPostalCode } from '../utils/postalCodeUtils';

const EMPTY_ADDRESS = {
  postalCode: '',
  city: '',
  address: '',
  phoneNumber: ''
};

// Render service request page.
export default function ServiceRequest() {
  const PHONE_NUMBER_LENGTH = 11;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    device: '',
    problem: '',
    atvizsgalas: false
  });
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [formMessage, setFormMessage] = useState('');
  const [requestFieldErrors, setRequestFieldErrors] = useState({});
  const [showAtvizsgalasInfo, setShowAtvizsgalasInfo] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: ''
  });
  const [paymentFormErrors, setPaymentFormErrors] = useState({});
  const [deliveryAddressData, setDeliveryAddressData] = useState(EMPTY_ADDRESS);
  const [billingAddressData, setBillingAddressData] = useState(EMPTY_ADDRESS);
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [addressErrors, setAddressErrors] = useState({});
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressLoadError, setAddressLoadError] = useState('');
  const [billingAddressList, setBillingAddressList] = useState([]);
  const [deliveryAddressList, setDeliveryAddressList] = useState([]);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState(null);
  const [selectedDeliveryAddressId, setSelectedDeliveryAddressId] = useState(null);
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false);
  const [showDeliveryAddressForm, setShowDeliveryAddressForm] = useState(false);
  const [repairData, setRepairData] = useState(null);
  const [hasSubmittedRepair, setHasSubmittedRepair] = useState(false);

  const REPAIR_PRICE = 5000;
  const INSPECTION_FEE = 5000;

  // Normalize phone values.
  const sanitizePhone = (value) => (value || '').replace(/\D/g, '').slice(0, PHONE_NUMBER_LENGTH);

  // Calculate total price.
  const getTotalPrice = () => {
    let total = REPAIR_PRICE;
    if (formData.atvizsgalas) {
      total += INSPECTION_FEE;
    }
    return total;
  };

  const problemOptions = [
    { id: 'problemDisplay', value: 'Kijelző', label: 'Kijelző' },
    { id: 'problemBattery', value: 'Akkumulátor', label: 'Akkumulátor' },
    { id: 'problemSoftware', value: 'Szoftver', label: 'Szoftver' },
    { id: 'problemCamera', value: 'Kamera', label: 'Kamera' },
    { id: 'problemSound', value: 'Hang', label: 'Hang' },
    { id: 'problemOther', value: 'Egyéb', label: 'Egyéb' }
  ];

  // Read user context from localStorage.
  const getUserContext = () => {
    const userID = parseInt(localStorage.getItem("userid") || localStorage.getItem("userID") || "0", 10);
    const userEmail = localStorage.getItem("email") || localStorage.getItem("userEmail") || "";
    const userName = localStorage.getItem("fullname") || "";

    return { userID, userEmail, userName };
  };

  // Check payment authentication.
  const isAuthenticatedForPayment = () => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('jwtToken') || localStorage.getItem('token');
    const { userID } = getUserContext();
    return Boolean(token) && userID && !Number.isNaN(userID) && userID > 0;
  };

  // Extract API error message.
  const getApiErrorMessage = (error, fallbackMessage) => {
    const status = error?.response?.status;
    const responseData = error?.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (typeof responseData?.message === 'string' && responseData.message.trim()) {
      return responseData.message;
    }

    if (responseData?.errors && typeof responseData.errors === 'object') {
      const allMessages = Object.values(responseData.errors)
        .flatMap(value => Array.isArray(value) ? value : [value])
        .filter(msg => typeof msg === 'string' && msg.trim());

      if (allMessages.length > 0) {
        return allMessages[0];
      }
    }

    switch (status) {
      case 400:
        return 'Hibás adatok lettek elküldve. Kérjük, ellenőrizze a mezőket.';
      case 401:
        return 'A művelethez bejelentkezés szükséges.';
      case 403:
        return 'Nincs jogosultsága ehhez a művelethez.';
      case 404:
        return 'A kért erőforrás nem található.';
      case 409:
        return 'Az igénylés már létezik vagy ütközés történt.';
      case 500:
        return 'Szerverhiba történt. Kérjük, próbálja újra később.';
      default:
        if (error?.code === 'ERR_NETWORK') {
          return 'Nem sikerült elérni a szervert. Ellenőrizze az internetkapcsolatot.';
        }
        return fallbackMessage;
    }
  };

  // Normalize address object.
  const normalizeAddress = (address) => ({
    postalCode: address?.postalCode?.toString() || '',
    city: address?.city || '',
    address: address?.address || '',
    phoneNumber: address?.phoneNumber?.toString() || ''
  });

  // Generate code on mount.
  useEffect(() => {
    generateUniqueCode();
  }, []);

  // Load addresses when payment modal opens.
  useEffect(() => {
    if (!showPaymentModal) return;

    const loadAddresses = async () => {
      const { userID } = getUserContext();

      if (!userID || Number.isNaN(userID) || userID <= 0) {
        setAddressLoadError('A címek betöltéséhez bejelentkezés szükséges.');
        setDeliveryAddressData(EMPTY_ADDRESS);
        setBillingAddressData(EMPTY_ADDRESS);
        setBillingSameAsDelivery(true);
        setBillingAddressList([]);
        setDeliveryAddressList([]);
        setSelectedBillingAddressId(null);
        return;
      }

      setAddressLoadError('');
      setAddressLoading(true);

      try {
        const [shippingRes, billingRes] = await Promise.all([
          axios.get(`http://localhost:5175/api/address/GetAddresses/${userID}/1`),
          axios.get(`http://localhost:5175/api/address/GetAddresses/${userID}/0`)
        ]);

        const shippingAddresses = Array.isArray(shippingRes.data) ? shippingRes.data : [];
        const billingAddresses = Array.isArray(billingRes.data) ? billingRes.data : [];

        setDeliveryAddressList(shippingAddresses);
        setBillingAddressList(billingAddresses);

        if (shippingAddresses.length > 0) {
          const firstShippingAddress = shippingAddresses[0];
          setSelectedDeliveryAddressId(firstShippingAddress.id);
          setDeliveryAddressData(normalizeAddress(firstShippingAddress));
        } else {
          setSelectedDeliveryAddressId(null);
          setDeliveryAddressData(EMPTY_ADDRESS);
        }

        if (billingAddresses.length > 0) {
          const firstBillingAddress = billingAddresses[0];
          setSelectedBillingAddressId(firstBillingAddress.id);
          setBillingAddressData(normalizeAddress(firstBillingAddress));
        } else {
          setSelectedBillingAddressId(null);
          setBillingAddressData(EMPTY_ADDRESS);
        }

        setBillingSameAsDelivery(true);
        setShowBillingAddressForm(false);
        setShowDeliveryAddressForm(false);
      } catch (error) {
        console.error('Hiba a címek betöltésekor:', error);
        setAddressLoadError(getApiErrorMessage(error, 'A címek betöltése sikertelen. A mezők kézzel kitölthetők.'));
        setBillingAddressList([]);
        setDeliveryAddressList([]);
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddresses();
  }, [showPaymentModal]);

  // Generate unique repair code.
  const generateUniqueCode = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const code = `PHNSCT-${datePart}-${randomPart}`;
    setUniqueCode(code);
    return code;
  };

  // Handle form input change.
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

    let processedValue = value;

    if (id === 'phone') {
      processedValue = sanitizePhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : processedValue
    }));

    if (id !== 'atvizsgalas') {
      setRequestFieldErrors(prev => ({ ...prev, [id]: '' }));
    }

    if (id === 'atvizsgalas') {
      setShowAtvizsgalasInfo(checked);
    }
  };

  // Toggle problem selection.
  const handleProblemToggle = (problem) => {
    setRequestFieldErrors(prev => ({ ...prev, selectedProblems: '' }));
    setSelectedProblems(prev => {
      if (prev.includes(problem.value)) {
        return prev.filter(p => p !== problem.value);
      } else {
        return [...prev, problem.value];
      }
    });
  };

  // Get selected problem labels.
  const getSelectedProblemLabels = () => {
    return problemOptions
      .filter(problem => selectedProblems.includes(problem.value))
      .map(problem => problem.label);
  };

  // Format price with dot separator.
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle payment field input.
  const handlePaymentInputChange = (e) => {
    const { id, value } = e.target;
    let processedValue = value;

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

    setPaymentFormData(prev => ({ ...prev, [id]: processedValue }));
  };

  // Handle address field input.
  const handleAddressInputChange = async (type, field, value) => {
    let processedValue = value;

    if (field === 'postalCode') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
      if (processedValue.length === 4) {
        try {
          const data = await getCityFromPostalCode(processedValue);
          if (data && data.telepules) {
            if (type === 'delivery') {
              setDeliveryAddressData(prev => ({ ...prev, postalCode: processedValue, city: data.telepules }));
              if (billingSameAsDelivery) {
                setBillingAddressData(prev => ({ ...prev, postalCode: processedValue, city: data.telepules }));
              }
            } else {
              setBillingAddressData(prev => ({ ...prev, postalCode: processedValue, city: data.telepules }));
              if (billingSameAsDelivery) {
                setDeliveryAddressData(prev => ({ ...prev, postalCode: processedValue, city: data.telepules }));
              }
            }
            return;
          }
        } catch (error) {
          console.log('Irányítószám nem található');
        }
      }
    }

    if (field === 'phoneNumber') {
      processedValue = sanitizePhone(value);
    }

    if (type === 'delivery') {
      setDeliveryAddressData(prev => ({ ...prev, [field]: processedValue }));

      if (billingSameAsDelivery) {
        setBillingAddressData(prev => ({ ...prev, [field]: processedValue }));
      }
    } else {
      setBillingAddressData(prev => ({ ...prev, [field]: processedValue }));

      if (billingSameAsDelivery) {
        setDeliveryAddressData(prev => ({ ...prev, [field]: processedValue }));
      }
    }
  };

  // Sync billing and delivery toggle.
  const toggleBillingSameAsDelivery = (checked) => {
    setBillingSameAsDelivery(checked);

    if (checked) {
      setDeliveryAddressData(billingAddressData);
      setSelectedDeliveryAddressId(selectedBillingAddressId);
      setShowDeliveryAddressForm(showBillingAddressForm);
    }
  };

  // Select billing address.
  const handleSelectBillingAddress = (addressId) => {
    if (addressId === 'new') {
      setShowBillingAddressForm(true);
      setBillingAddressData(EMPTY_ADDRESS);
      setSelectedBillingAddressId(null);
      if (billingSameAsDelivery) {
        setShowDeliveryAddressForm(true);
        setDeliveryAddressData(EMPTY_ADDRESS);
        setSelectedDeliveryAddressId(null);
      }
    } else if (addressId) {
      setShowBillingAddressForm(false);
      setSelectedBillingAddressId(parseInt(addressId, 10));
      const selectedAddress = billingAddressList.find(addr => addr.id === parseInt(addressId, 10));
      if (selectedAddress) {
        const normalized = normalizeAddress(selectedAddress);
        setBillingAddressData(normalized);
        if (billingSameAsDelivery) {
          setShowDeliveryAddressForm(false);
          setSelectedDeliveryAddressId(parseInt(addressId, 10));
          setDeliveryAddressData(normalized);
        }
      }
    } else {
      setShowBillingAddressForm(false);
      setSelectedBillingAddressId(null);
      setBillingAddressData(EMPTY_ADDRESS);
      if (billingSameAsDelivery) {
        setShowDeliveryAddressForm(false);
        setSelectedDeliveryAddressId(null);
        setDeliveryAddressData(EMPTY_ADDRESS);
      }
    }
  };

  // Select delivery address.
  const handleSelectDeliveryAddress = (addressId) => {
    if (addressId === 'new') {
      setShowDeliveryAddressForm(true);
      setDeliveryAddressData(EMPTY_ADDRESS);
      setSelectedDeliveryAddressId(null);
    } else if (addressId) {
      setShowDeliveryAddressForm(false);
      setSelectedDeliveryAddressId(parseInt(addressId, 10));
      const selectedAddress = deliveryAddressList.find(addr => addr.id === parseInt(addressId, 10));
      if (selectedAddress) {
        const normalized = normalizeAddress(selectedAddress);
        setDeliveryAddressData(normalized);

        if (billingSameAsDelivery) {
          setBillingAddressData(normalized);
          setSelectedBillingAddressId(parseInt(addressId, 10));
        }
      }
    } else {
      setShowDeliveryAddressForm(false);
      setSelectedDeliveryAddressId(null);
      setDeliveryAddressData(EMPTY_ADDRESS);
    }
  };

  // Validate payment form fields.
  const validatePaymentForm = () => {
    const errors = {};
    Object.keys(paymentFormData).forEach(key => {
      if (!paymentFormData[key].trim()) {
        errors[key] = "A mező kitöltése kötelező!";
      }
    });

    const addressValidationErrors = {};
    const requiredFields = ['postalCode', 'city', 'address', 'phoneNumber'];

    if (showDeliveryAddressForm) {
      requiredFields.forEach(field => {
        if (!deliveryAddressData[field].toString().trim()) {
          addressValidationErrors[`delivery-${field}`] = 'A mező kitöltése kötelező!';
        }
      });
      if (deliveryAddressData.phoneNumber && !new RegExp(`^\\d{${PHONE_NUMBER_LENGTH}}$`).test(deliveryAddressData.phoneNumber)) {
        addressValidationErrors['delivery-phoneNumber'] = `A telefonszám pontosan ${PHONE_NUMBER_LENGTH} számjegy lehet.`;
      }
    } else if (!selectedDeliveryAddressId) {
      addressValidationErrors['delivery-select'] = 'Válasszon egy szállítási cím!';
    } else if (!new RegExp(`^\\d{${PHONE_NUMBER_LENGTH}}$`).test(deliveryAddressData.phoneNumber || '')) {
      addressValidationErrors['delivery-phoneNumber'] = `A telefonszám pontosan ${PHONE_NUMBER_LENGTH} számjegy lehet.`;
    }

    if (!billingSameAsDelivery) {
      if (showBillingAddressForm) {
        requiredFields.forEach(field => {
          if (!billingAddressData[field].toString().trim()) {
            addressValidationErrors[`billing-${field}`] = 'A mező kitöltése kötelező!';
          }
        });
        if (billingAddressData.phoneNumber && !new RegExp(`^\\d{${PHONE_NUMBER_LENGTH}}$`).test(billingAddressData.phoneNumber)) {
          addressValidationErrors['billing-phoneNumber'] = `A telefonszám pontosan ${PHONE_NUMBER_LENGTH} számjegy lehet.`;
        }
      } else if (!selectedBillingAddressId) {
        addressValidationErrors['billing-select'] = 'Válasszon egy számlázási cím!';
      } else if (!new RegExp(`^\\d{${PHONE_NUMBER_LENGTH}}$`).test(billingAddressData.phoneNumber || '')) {
        addressValidationErrors['billing-phoneNumber'] = `A telefonszám pontosan ${PHONE_NUMBER_LENGTH} számjegy lehet.`;
      }
    }

    setPaymentFormErrors(errors);
    setAddressErrors(addressValidationErrors);

    return Object.keys(errors).length === 0 && Object.keys(addressValidationErrors).length === 0;
  };

  // Open payment modal.
  const openPaymentModal = () => {
    setPaymentFormErrors({});
    setAddressErrors({});
    setAddressLoadError('');

    if (!isAuthenticatedForPayment()) {
      setFormMessage(
        <div className="alert alert-danger">
          A fizetéshez be kell jelentkezni.
        </div>
      );
      return;
    }

    setShowPaymentModal(true);
  };

  // Build service info message.
  const buildServiceInfoMessage = (data) => {
    if (!data) return '';

    const { code, selectedLabels, atvizsgalas } = data;

    if (atvizsgalas) {
      return (
        <div className="alert alert-info">
          Kérésed megkaptuk, és rögzítettük.<br />
          {selectedLabels && <><b>Kiválasztott problémák:</b> {selectedLabels}<br /></>}
          <strong>Kérjük, küldd el telefonod postán a következő címre, vagy hozd be üzletünkbe:</strong><br />
          <b>Cím:</b> Miskolc, Palóczy László utca 3, 3525<br />
          <b>Név:</b> PhoneScout Szerviz<br />
          <b>Telefonszám:</b> +36 30 123 4567<br />
          <b>Email:</b> info@phonescout.hu<br />
          <br />
          <b>Bevizsgálási kódod:</b> <span style={{ fontSize: '1.2em', color: '#17a2b8' }}><strong>{code}</strong></span><br />
          <b>Kérjük, a csomagba mellékeld:</b><br />
          <ul>
            <li>A nevet amit itt megadtál,</li>
            <li>A telefonszámot amit itt megadtál,</li>
            <li>A készüléket a csomagolási feltételeknek megfelelően becsomagolva <Link to="/csomagolasfeltetelek" target="_blank" style={{ color: '#17a2b8', textDecoration: 'underline' }}>ITT</Link>,</li>
            <li>A bevizsgálási kódodat. Az kódod: <strong>{code}</strong></li>
          </ul>
          <b>Ha személyesen jössz be:</b><br />
          <ul>
            <li>Hozd magaddal az E-mailt amit tőlünk kaptál,</li>
            <br />
            <p><strong>VAGY</strong></p>
            <li>Bevizsgálási kódod: <strong>{code}</strong></li>
            <li>Valamilyen elérhetőségét amit megadtál az űrlapon (pl. email, telefonszám)</li>
          </ul>
          <br />
        </div>
      );
    }

    return (
      <div className="alert alert-info">
        Kérésed megkaptuk, és rögzítettük.<br />
        {selectedLabels && <><b>Kiválasztott problémák:</b> {selectedLabels}<br /></>}
        <strong>Kérjük, Küld el telefonod postán a következő címre, vagy hozd be üzletünkbe:</strong><br />
        <b>Cím:</b> Miskolc, Palóczy László utca 3, 3525<br />
        <b>Név:</b> PhoneScout Szerviz<br />
        <b>Telefonszám:</b> +36 30 123 4567<br />
        <b>Email:</b> info@phonescout.hu<br />
        <br />
        <b>Bevizsgálási kódod:</b> <span style={{ fontSize: '1.2em', color: '#17a2b8' }}><strong>{code}</strong></span><br />
        <b>Kérjük, a csomagba mellékeld:</b><br />
        <ul>
          <li>A nevet amit itt megadtál,</li>
          <li>A telefonszámot amit itt megadtál,</li>
          <li>A készüléket a csomagolási feltételeknek megfelelően becsomagolva <Link to="/csomagolasfeltetelek" target="_blank" style={{ color: '#17a2b8', textDecoration: 'underline' }}>ITT</Link>,</li>
          <li>A bevizsgálási kódodat. Az kódod: <strong>{code}</strong></li>
        </ul>
        <b>Ha személyesen jössz be:</b><br />
        <ul>
          <li>Hozd magaddal az E-mailt amit tőlünk kaptál,</li>
          <br />
          <p><strong>VAGY</strong></p>
          <li>Bevizsgálási kódod: <strong>{code}</strong></li>
          <li>Valamilyen elérhetőségét amit megadtál az űrlapon (pl. email, telefonszám)</li>
        </ul>
        <br />
      </div>
    );
  };

  // Close success modal.
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormMessage(buildServiceInfoMessage(repairData));
    setRepairData(null);
  };

  // Submit payment and repair request.
  const handlePayment = async () => {
    if (!validatePaymentForm()) return;

    try {
      const { userID } = getUserContext();

      if (!userID || Number.isNaN(userID) || userID <= 0) {
        setAddressLoadError('A szerviz igényléshez jelentkezz be újra.');
        return;
      }

      const selectedBillingAddress = billingSameAsDelivery ? deliveryAddressData : billingAddressData;
      const selectedLabels = getSelectedProblemLabels().join(', ');
      const currentCode = uniqueCode || generateUniqueCode();

      const repairPayload = {
        repairID: currentCode,
        userID,
        billingPostalCode: parseInt(selectedBillingAddress.postalCode, 10) || 0,
        billingCity: selectedBillingAddress.city,
        billingAddress: selectedBillingAddress.address,
        billingPhoneNumber: parseInt(selectedBillingAddress.phoneNumber, 10) || 0,
        deliveryPostalCode: parseInt(deliveryAddressData.postalCode, 10) || 0,
        deliveryCity: deliveryAddressData.city,
        deliveryAddress: deliveryAddressData.address,
        deliveryPhoneNumber: parseInt(deliveryAddressData.phoneNumber, 10) || 0,
        phoneName: formData.device,
        basePrice: getTotalPrice(),
        repairPrice: 0,
        isPriceAccepted: 0,
        status: 0,
        manufacturerName: formData.device,
        phoneInspection: formData.atvizsgalas ? 1 : 0,
        problemDescription: formData.problem,
        repairDescription: '',
        parts: selectedProblems
      };

      const response = await axios.post("http://localhost:5175/api/Profile/postRepair", repairPayload);

      console.log("Repair request status:", response.status);
      console.log("Repair request response:", response.data);

      if (response.status !== 200 && response.status !== 201) {
        setAddressLoadError('A szerviz igénylés mentése nem sikerült. Kérjük, próbálja újra.');
        return;
      }

      setRepairData({
        code: currentCode,
        selectedLabels,
        atvizsgalas: formData.atvizsgalas
      });

      setShowPaymentModal(false);
      setShowSuccessModal(true);
      setHasSubmittedRepair(true);

      setPaymentFormData({
        cardNumber: '',
        expiry: '',
        cvc: '',
        cardName: ''
      });
    } catch (error) {
      console.error("Error processing repair request:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      setAddressLoadError(getApiErrorMessage(error, 'Hiba történt a szerviz igénylés feldolgozásakor.'));
    }
  };

  // Handle form submit.
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const trimmedDevice = formData.device.trim();
    const trimmedProblem = formData.problem.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fieldErrors = {};
    if (!trimmedName) fieldErrors.name = 'Nem adta meg.';
    if (!trimmedEmail) fieldErrors.email = 'Nem adta meg.';
    if (!phoneDigits) fieldErrors.phone = 'Nem adta meg.';
    if (!trimmedDevice) fieldErrors.device = 'Nem adta meg.';
    if (selectedProblems.length === 0) fieldErrors.selectedProblems = 'Nem adta meg.';
    if (!trimmedProblem) fieldErrors.problem = 'Nem adta meg.';

    if (Object.keys(fieldErrors).length > 0) {
      setRequestFieldErrors(fieldErrors);
      setFormMessage('');
      return;
    }

    setRequestFieldErrors({});

    if (!trimmedName || !trimmedEmail || !phoneDigits || !trimmedDevice || !trimmedProblem) {
      setFormMessage(
        <div className="alert alert-danger">
          Kérjük, töltse ki az összes kötelező mezőt!
        </div>
      );
      return;
    }

    if (trimmedName.length < 2) {
      setFormMessage(<div className="alert alert-danger">A név túl rövid.</div>);
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFormMessage(<div className="alert alert-danger">Kérjük, adjon meg érvényes email címet.</div>);
      return;
    }

    if (phoneDigits.length !== PHONE_NUMBER_LENGTH) {
      setFormMessage(<div className="alert alert-danger">Kérjük, adjon meg érvényes telefonszámot.</div>);
      return;
    }

    if (trimmedDevice.length < 2) {
      setFormMessage(<div className="alert alert-danger">A készülék neve túl rövid.</div>);
      return;
    }

    if (selectedProblems.length === 0) {
      setFormMessage(<div className="alert alert-danger">Kérjük, válasszon legalább egy hibatípust.</div>);
      return;
    }

    if (trimmedProblem.length < 10) {
      setFormMessage(<div className="alert alert-danger">A hiba leírása legyen legalább 10 karakter.</div>);
      return;
    }

    setFormData(prev => ({
      ...prev,
      name: trimmedName,
      email: trimmedEmail,
      phone: phoneDigits,
      device: trimmedDevice,
      problem: trimmedProblem
    }));

    setFormMessage('');
    openPaymentModal();
  };


  // Open chatbot widget.
  const openChatbot = () => {
    window.dispatchEvent(new Event('openChatbot'));
  };

  const faqItems = [
    {
      id: 'faq1',
      question: 'Mennyi idő alatt készül el a szervizelés?',
      answer: 'Általában 3-5 munkanap, de a pontos időt a hiba típusa és az alkatrész elérhetősége befolyásolja.'
    },
    {
      id: 'faq2',
      question: 'Kapok árajánlatot a javítás előtt?',
      answer: 'Igen, minden esetben előzetes árajánlatot küldünk az átvizsgálás után.'
    },
    {
      id: 'faq3',
      question: 'Hogyan követhetem nyomon a szerviz státuszát?',
      answer: 'A bevizsgálási kód segítségével az profil oldalon.'
    }
  ];

  return (
    <div>

      <div className="container mt-3 mb-2 text-end">
        <button id="chatbotBtn" className="btn btn-outline-info" onClick={openChatbot}>
          <i className="fas fa-robot"></i> Chatbot: Segítség a hibához
        </button>
      </div>

      <div className="container my-5">
        <h2>Szervizelés igénylése</h2>
        <form id="szervizForm" className="row g-3" onSubmit={handleSubmit} noValidate>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Név</label>
            <input
              type="text"
              className={`form-control ${requestFieldErrors.name ? 'is-invalid' : ''}`}
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {requestFieldErrors.name && <div className="invalid-feedback d-block">{requestFieldErrors.name}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email cím</label>
            <input
              type="email"
              className={`form-control ${requestFieldErrors.email ? 'is-invalid' : ''}`}
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {requestFieldErrors.email && <div className="invalid-feedback d-block">{requestFieldErrors.email}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Telefonszám</label>
            <input
              type="tel"
              className={`form-control ${requestFieldErrors.phone ? 'is-invalid' : ''}`}
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              maxLength={PHONE_NUMBER_LENGTH}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {requestFieldErrors.phone && <div className="invalid-feedback d-block">{requestFieldErrors.phone}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="device" className="form-label">Hibás készülék</label>
            <input
              type="text"
              className={`form-control ${requestFieldErrors.device ? 'is-invalid' : ''}`}
              id="device"
              value={formData.device}
              onChange={handleInputChange}
              required
            />
            {requestFieldErrors.device && <div className="invalid-feedback d-block">{requestFieldErrors.device}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Mivel van baj?</label>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                type="button"
                id="problemDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {getSelectedProblemLabels().length > 0 ? getSelectedProblemLabels().join(', ') : 'Válassz problémákat...'}
              </button>
              <div className="dropdown-menu p-3" aria-labelledby="problemDropdown" style={{ minWidth: '250px' }}>
                {problemOptions.map(problem => (
                  <div className="form-check" key={problem.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={problem.id}
                      checked={selectedProblems.includes(problem.value)}
                      onChange={() => handleProblemToggle(problem)}
                    />
                    <label className="form-check-label" htmlFor={problem.id}>
                      {problem.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {requestFieldErrors.selectedProblems && <div className="invalid-feedback d-block">{requestFieldErrors.selectedProblems}</div>}
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="atvizsgalas"
                checked={formData.atvizsgalas}
                onChange={handleInputChange}
                style={{ border: '1px solid #000' }}
              />
              <label className="form-check-label" htmlFor="atvizsgalas">
                Átvizsgálás kérése
              </label>
            </div>
          </div>

          {showAtvizsgalasInfo && (
            <div className="col-12" id="atvizsgalasInfo">
              <div className="alert alert-secondary mt-2">
                Az átvizsgálás során szakembereink teljes körűen ellenőrzik a készülék állapotát, feltárják a
                rejtett hibákat, és javaslatot tesznek a javításra vagy cserére. Az átvizsgálás díja fix, és a felhasználó utána kap visszajelzést.<br />
                <strong>Az <i>átvizsgálás</i> díja fix {formatPrice(INSPECTION_FEE)} Ft</strong>
              </div>
            </div>
          )}

          <div className="col-12">
            <label htmlFor="problem" className="form-label">Hiba leírása</label>
            <textarea
              className={`form-control ${requestFieldErrors.problem ? 'is-invalid' : ''}`}
              id="problem"
              rows="3"
              value={formData.problem}
              onChange={handleInputChange}
              required
            ></textarea>
            {requestFieldErrors.problem && <div className="invalid-feedback d-block">{requestFieldErrors.problem}</div>}
          </div>
          <hr />
          <div className="col-4"> <div className="modalTotalPrice">
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Szervizelési díj:</span>
                <span><strong>{formatPrice(REPAIR_PRICE)} Ft</strong></span>
              </div>
              {formData.atvizsgalas && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Átvizsgálás díja:</span>
                  <span><strong>{formatPrice(INSPECTION_FEE)} Ft</strong></span>
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Összesen:</span>
              <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{formatPrice(getTotalPrice())} Ft</span>
            </div><div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e7f3ff', borderRadius: '4px', fontSize: '0.75em', lineHeight: '1.4' }}>
                <p style={{ margin: '0 0 1px 0', fontWeight: 'bold', color: '#0066cc', fontSize: '0.95em' }}>
                  <i className="fas fa-info-circle"></i> Fontos információ:
                </p>
                <p style={{ margin: '0 0 1px 0' }}>
                  A fenti összegek <strong>fix díjak</strong> (átvizsgálási és beküldési költség).
                </p>
                <p style={{ margin: '0 0 1px 0' }}>
                  A <strong>tényleges szervizelési árajánlatot</strong> az átvizsgálás után kapod meg.
                </p>
                <p style={{ margin: '0 0 1px 0' }}>
                   Az árajánlatot a <strong>Profil oldalon</strong> tudod elfogadni vagy elutasítani, ahol kollégánktól részletes információt is kapsz.
                </p>
                <p style={{ margin: '0' }}>
                 <strong>Emailes értesítést</strong> küldünk minden változásról.
                </p>
              </div>
          </div>
          </div>
          <div className="col-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={hasSubmittedRepair}
            >
              {hasSubmittedRepair ? 'Igénylés már elküldve' : 'Igénylés elküldése'}
            </button>
            <div id="formMessage" className="mt-3">
              {formMessage}
            </div>
          </div>
        </form>
      </div>

      <div className="hr">
        <hr size="5" />
      </div>

      <div className="container my-5">
        <h3>Gyakran Ismételt Kérdések</h3>
        <div className="accordion" id="faqAccordion">
          {faqItems.map((faq, index) => (
            <div className="accordion-item" key={faq.id}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <div className="paymentModal" style={{ display: 'flex' }}>
          <div className="modalContent">
            <span className="closeModal" onClick={() => setShowPaymentModal(false)}>&times;</span>
            <h2 className="modalTitle">Szervíz igénylés - Fizetés</h2>
            <div className="modalTotalPrice">
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Szervizelési díj:</span>
                  <span><strong>{formatPrice(REPAIR_PRICE)} Ft</strong></span>
                </div>
                {formData.atvizsgalas && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Átvizsgálás díja:</span>
                    <span><strong>{formatPrice(INSPECTION_FEE)} Ft</strong></span>
                  </div>
                )}
              </div>
              <div style={{ borderTop: '1px solid #ccc', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Összesen:</span>
                <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{formatPrice(getTotalPrice())} Ft</span>
              </div>              
            </div>
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
                  value={paymentFormData.cardNumber}
                  onChange={handlePaymentInputChange}
                  autoFocus
                />
                {paymentFormErrors.cardNumber && <div className="invalid-feedback">{paymentFormErrors.cardNumber}</div>}

                <label>Lejárat:</label>
                <input
                  type="text"
                  id="expiry"
                  maxLength="5"
                  required
                  placeholder="MM/YY"
                  value={paymentFormData.expiry}
                  onChange={handlePaymentInputChange}
                />
                {paymentFormErrors.expiry && <div className="invalid-feedback">{paymentFormErrors.expiry}</div>}

                <label>CVC:</label>
                <input
                  type="text"
                  id="cvc"
                  maxLength="3"
                  required
                  placeholder="123"
                  value={paymentFormData.cvc}
                  onChange={handlePaymentInputChange}
                />
                {paymentFormErrors.cvc && <div className="invalid-feedback">{paymentFormErrors.cvc}</div>}

                <label>Kártyán szereplő név:</label>
                <input
                  type="text"
                  id="cardName"
                  required
                  placeholder="Név"
                  value={paymentFormData.cardName}
                  onChange={handlePaymentInputChange}
                />
                {paymentFormErrors.cardName && <div className="invalid-feedback">{paymentFormErrors.cardName}</div>}
              </form>

              <form className="modalForm" onSubmit={(e) => e.preventDefault()}>
                <h4>Számlázási cím</h4>

                {!showBillingAddressForm ? (
                  <>
                    <label>Válassza ki a számlázási címet:</label>
                    <select
                      value={selectedBillingAddressId || ''}
                      onChange={(e) => handleSelectBillingAddress(e.target.value)}
                      className="modalForm-select"
                    >
                      <option value="">-- Válasszon egy cím</option>
                      {billingAddressList.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.postalCode} {addr.city}, {addr.address}
                        </option>
                      ))}
                      <option value="new">+ Új cím hozzáadása</option>
                    </select>
                    {addressErrors['billing-select'] && <div className="invalid-feedback">{addressErrors['billing-select']}</div>}

                    {selectedBillingAddressId && (
                      <div className="addressDisplayBox">
                        <p><strong>Irányítószám:</strong> {billingAddressData.postalCode}</p>
                        <p><strong>Város:</strong> {billingAddressData.city}</p>
                        <p><strong>Cím:</strong> {billingAddressData.address}</p>
                        <p><strong>Telefonszám:</strong> {billingAddressData.phoneNumber}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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
                      maxLength={PHONE_NUMBER_LENGTH}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    {addressErrors['billing-phoneNumber'] && <div className="invalid-feedback">{addressErrors['billing-phoneNumber']}</div>}

                    <button
                      type="button"
                      className="submitPaymentBtn"
                      style={{ marginTop: '12px', marginRight: '8px' }}
                      onClick={() => setShowBillingAddressForm(false)}
                    >
                      Inkább választok a mentett címek közül
                    </button>
                  </>
                )}

                <div className="addressCheckboxRow">
                  <input
                    id="billingSameAsDelivery"
                    type="checkbox"
                    checked={billingSameAsDelivery}
                    onChange={(e) => toggleBillingSameAsDelivery(e.target.checked)}
                  />
                  <label htmlFor="billingSameAsDelivery">A szállítási cím megegyezik a számlázási címmel</label>
                </div>
              </form>

              {!billingSameAsDelivery && (
                <form className="modalForm" onSubmit={(e) => e.preventDefault()}>
                  <h4>Szállítási cím</h4>

                  {!showDeliveryAddressForm ? (
                    <>
                      <label>Válassza ki a szállítási címet:</label>
                      <select
                        value={selectedDeliveryAddressId || ''}
                        onChange={(e) => handleSelectDeliveryAddress(e.target.value)}
                        className="modalForm-select"
                      >
                        <option value="">-- Válasszon egy címet</option>
                        {deliveryAddressList.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.postalCode} {addr.city}, {addr.address}
                          </option>
                        ))}
                        <option value="new">+ Új cím hozzáadása</option>
                      </select>
                      {addressErrors['delivery-select'] && <div className="invalid-feedback">{addressErrors['delivery-select']}</div>}

                      {selectedDeliveryAddressId && (
                        <div className="addressDisplayBox">
                          <p><strong>Irányítószám:</strong> {deliveryAddressData.postalCode}</p>
                          <p><strong>Város:</strong> {deliveryAddressData.city}</p>
                          <p><strong>Cím:</strong> {deliveryAddressData.address}</p>
                          <p><strong>Telefonszám:</strong> {deliveryAddressData.phoneNumber}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
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
                        maxLength={PHONE_NUMBER_LENGTH}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      {addressErrors['delivery-phoneNumber'] && <div className="invalid-feedback">{addressErrors['delivery-phoneNumber']}</div>}

                      <button
                        type="button"
                        className="submitPaymentBtn"
                        style={{ marginTop: '12px', marginRight: '8px' }}
                        onClick={() => setShowDeliveryAddressForm(false)}
                      >
                        Inkább választok a mentett címek közül
                      </button>
                    </>
                  )}
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
            <h2>Szervíz igénylés sikeres!</h2>
            <p>Köszönjük az igénylést! Kérjük, küldd el telefonod postán, vagy hozd be személyesen az alábbi címre:</p>
            <p>
              <strong>PhoneScout Szerviz</strong><br />
              Miskolc, Palóczy László utca 3, 3525<br />
              +36 30 123 4567<br />
              phonescoutofficial@gmail.com
            </p>
            <p>
              <strong>Bevizsgálási kódod: {uniqueCode}</strong>
            </p>
            <button
              id="closeSuccessModal"
              className="submitPaymentBtn paymentButton"
              style={{ marginTop: '20px' }}
              onClick={handleCloseSuccessModal}
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