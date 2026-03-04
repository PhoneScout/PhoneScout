import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { UNSAFE_useScrollRestoration, useNavigate } from 'react-router';
import InputText from '../components/InputText';


//fetch('http://localhost:5292/phonePage/2').then(response => response.json()).then(data => console.log(data)) //ID-T KISZEDNI A / MÖGÜL HA VAN


const Profile = () => {
  // Felhasználó adatok

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userData, setUserData] = useState({ userFullName: '', userEmail: '' });
  const [userID, setUserID] = useState(null);
  const savedEmail = localStorage.getItem('email');
  
  // UserID betöltése az email alapján
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedName = localStorage.getItem('fullname');
        setUserData({ userFullName: savedName, userEmail: savedEmail });

        if (savedEmail) {
          const response = await axios.get(`http://localhost:5175/api/Registration/GetId/${encodeURIComponent(savedEmail)}`);
          if (response.data) {
            setUserID(response.data);
            localStorage.setItem('userid', response.data);
          }
        }
      } catch (error) {
        console.error('Hiba a user adatok betöltésekor:', error);
      }
    };

    loadUserData();
  }, [savedEmail]);

  // Címek betöltése az API-ből (újrahasznosítjuk a refreshAddresses segédfüggvényt)
  useEffect(() => {
    if (userID) {
      refreshAddresses();
    }
  }, [userID]);

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "#ccc" });
  const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addressStatusMessage, setAddressStatusMessage] = useState({ text: "", isError: false });

  const MAX_PHONE_LENGTH = 15;

  // helper to remove plus and enforce length
  const sanitizePhone = (val) => {
    if (!val) return val;
    let s = val.replace(/[+]/g, '');
    if (s.length > MAX_PHONE_LENGTH) s = s.slice(0, MAX_PHONE_LENGTH);
    return s;
  };

  const [phones, setPhones] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const navigate = useNavigate();
  // price offer modal state
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [activeRepair, setActiveRepair] = useState(null);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  // payment modal for repair offer
  const [showRepairPaymentModal, setShowRepairPaymentModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
  const [paymentFormErrors, setPaymentFormErrors] = useState({});
  const [paymentDeliveryAddressData, setPaymentDeliveryAddressData] = useState({ postalCode: '', city: '', address: '', phoneNumber: '' });
  const [paymentBillingAddressData, setPaymentBillingAddressData] = useState({ postalCode: '', city: '', address: '', phoneNumber: '' });
  const [paymentBillingSameAsDelivery, setPaymentBillingSameAsDelivery] = useState(true);
  const [paymentAddressErrors, setPaymentAddressErrors] = useState({});
  const [paymentAddressLoading, setPaymentAddressLoading] = useState(false);
  const [paymentAddressLoadError, setPaymentAddressLoadError] = useState('');
  const [paymentBillingAddressList, setPaymentBillingAddressList] = useState([]);
  const [paymentDeliveryAddressList, setPaymentDeliveryAddressList] = useState([]);
  const [paymentSelectedBillingAddressId, setPaymentSelectedBillingAddressId] = useState(null);
  const [paymentSelectedDeliveryAddressId, setPaymentSelectedDeliveryAddressId] = useState(null);
  const [paymentShowBillingAddressForm, setPaymentShowBillingAddressForm] = useState(false);
  const [paymentShowDeliveryAddressForm, setPaymentShowDeliveryAddressForm] = useState(false);


  // Szervízrendelések betöltése az API-ből
  useEffect(() => {
    const loadServiceRequests = async () => {
      try {
        if (!userID) {
          console.error('UserID nem elérhető');
          return;
        }

        const response = await axios.get(`http://localhost:5175/api/Profile/GetRepair/${userID}`);
        if (Array.isArray(response.data)) {
          // backend omits userID so inject it manually
          const withId = response.data.map(r => ({ ...r, userID }));
          setServiceRequests(withId);
        }
      } catch (error) {
        console.error('Hiba a szervízrendelések betöltésekor:', error);
      }
    };

    loadServiceRequests();

    // listen for external updates (e.g. after payment in cart)
    const refreshHandler = () => {
      loadServiceRequests();
    };
    window.addEventListener('repairUpdated', refreshHandler);
    return () => window.removeEventListener('repairUpdated', refreshHandler);
  }, [userID]);

  // helper to open offer modal
  const openPriceModal = (repair) => {
    setActiveRepair(repair);
    setShowPriceModal(true);
  };

  const closePriceModal = () => {
    setActiveRepair(null);
    setShowPriceModal(false);
    setShowDeclineConfirm(false);
  };

  // helpers for payment modal
  const normalizePaymentAddress = (address) => ({
    postalCode: address?.postalCode?.toString() || '',
    city: address?.city || '',
    address: address?.address || '',
    phoneNumber: address?.phoneNumber?.toString() || ''
  });

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

  const handleSelectBillingAddressPayment = (id) => {
    if (id === 'new') {
      setPaymentShowBillingAddressForm(true);
      setPaymentSelectedBillingAddressId(null);
      setPaymentBillingAddressData({ postalCode: '', city: '', address: '', phoneNumber: '' });
      return;
    }
    const selected = paymentBillingAddressList.find(addr => addr.id === parseInt(id, 10));
    if (selected) {
      setPaymentBillingAddressData(normalizePaymentAddress(selected));
      setPaymentSelectedBillingAddressId(selected.id);
    }
  };

  const handleSelectDeliveryAddressPayment = (id) => {
    if (id === 'new') {
      setPaymentShowDeliveryAddressForm(true);
      setPaymentSelectedDeliveryAddressId(null);
      setPaymentDeliveryAddressData({ postalCode: '', city: '', address: '', phoneNumber: '' });
      return;
    }
    const selected = paymentDeliveryAddressList.find(addr => addr.id === parseInt(id, 10));
    if (selected) {
      setPaymentDeliveryAddressData(normalizePaymentAddress(selected));
      setPaymentSelectedDeliveryAddressId(selected.id);
    }
  };

  const toggleBillingSameAsDeliveryPayment = (checked) => {
    setPaymentBillingSameAsDelivery(checked);
    if (checked) {
      setPaymentShowDeliveryAddressForm(false);
      setPaymentSelectedDeliveryAddressId(null);
      setPaymentDeliveryAddressData({ postalCode: '', city: '', address: '', phoneNumber: '' });
    }
  };

  const handlePaymentAddressInputChange = (type, field, value) => {
    let processed = value;
    if (field === 'postalCode') {
      processed = value.replace(/\D/g, '').slice(0, 4);
    }
    if (field === 'phoneNumber') {
      processed = value.replace(/\D/g, '').slice(0, 15);
    }

    if (type === 'billing') {
      setPaymentBillingAddressData(prev => ({ ...prev, [field]: processed }));
    } else {
      setPaymentDeliveryAddressData(prev => ({ ...prev, [field]: processed }));
    }
  };

  const validatePaymentForm = () => {
    const errors = {};
    Object.keys(paymentFormData).forEach(key => {
      if (!paymentFormData[key].trim()) {
        errors[key] = "A mező kitöltése kötelező!";
      }
    });

    setPaymentFormErrors(errors);
    setPaymentAddressErrors({});

    return Object.keys(errors).length === 0;
  };

  // Az activeRepair-ből már megvannak a cím adatok, szóval közvetlenül azokat használjuk
  useEffect(() => {
    if (!showRepairPaymentModal || !activeRepair) return;

    // Az activeRepair-ből direkten inicializáljuk a szállítási és számlázási adatokat
    const deliveryData = {
      postalCode: activeRepair.deliveryPostalCode?.toString() || '',
      city: activeRepair.deliveryCity || '',
      address: activeRepair.deliveryAddress || '',
      phoneNumber: activeRepair.deliveryPhoneNumber?.toString() || ''
    };

    const billingData = {
      postalCode: activeRepair.billingPostalCode?.toString() || '',
      city: activeRepair.billingCity || '',
      address: activeRepair.billingAddress || '',
      phoneNumber: activeRepair.billingPhoneNumber?.toString() || ''
    };

    setPaymentDeliveryAddressData(deliveryData);
    setPaymentBillingAddressData(billingData);
    setPaymentBillingSameAsDelivery(true);
    setPaymentShowBillingAddressForm(false);
    setPaymentShowDeliveryAddressForm(false);
  }, [showRepairPaymentModal, activeRepair]);

  const handleRepairPayment = async () => {
    if (!validatePaymentForm() || !activeRepair) return;
    try {
      // construct dto similar to activeRepair but ensure userID and accept status
      const payload = {
        ...activeRepair,
        userID: activeRepair.userID || userID,
        isPriceAccepted: 1
      };
      await axios.put(
        `http://localhost:5175/api/Profile/updateRepair/${activeRepair.repairID}`,
        payload
      );
      // update local list and notify
      setServiceRequests(prev => prev.map(r => r.repairID === activeRepair.repairID ? { ...r, isPriceAccepted: 1 } : r));
      window.dispatchEvent(new Event('repairUpdated'));
      setShowRepairPaymentModal(false);
      setActiveRepair(null);
    } catch (err) {
      console.error('Hiba fizetés után:', err);
      alert('Hiba történt a fizetés feldolgozásakor.');
    }
  };


  const handleAcceptOffer = () => {
    if (!activeRepair) return;
    // Közvetlenül a fizetési modalra lépünk az activeRepair már szerzett cím adatokkal
    setShowPriceModal(false);
    // reset payment form state
    setPaymentFormData({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
    setPaymentFormErrors({});
    setPaymentAddressErrors({});
    // A modal megnyitása triggerezni fog egy useEffect-et amely az activeRepair-ből tölti fel a cím adatokat
    setShowRepairPaymentModal(true);
  };

  const handleDeclineOffer = () => {
    setShowDeclineConfirm(true);
  };

  const confirmDecline = async () => {
    if (!activeRepair) return;
    try {
      const payload = {
        ...activeRepair,
        userID: activeRepair.userID || userID,
        isPriceAccepted: 2
      };
      await axios.put(
        `http://localhost:5175/api/Profile/updateRepair/${activeRepair.repairID}`,
        payload
      );
      // update local list so button disappears
      setServiceRequests(prev => prev.map(r => r.repairID === activeRepair.repairID ? { ...r, isPriceAccepted: 2 } : r));
    } catch (err) {
      console.error('Árajánlat elutasítása hiba:', err);
    }
    closePriceModal();
  };

  // Rendelések betöltése az API-ből
  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!userID) {
          console.error('UserID nem elérhető');
          return;
        }

        const response = await axios.get(`http://localhost:5175/api/Profile/GetOrder/${userID}`);
        if (Array.isArray(response.data)) {
          setPhones(response.data);
        }
      } catch (error) {
        console.error('Hiba a rendelések betöltésekor:', error);
      }
    };

    loadOrders();
  }, [userID]);

  // Státusz konvertálása szövegre
  const getStatusText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return 'feldolgozás alatt';
      case 1:
        return 'feldolgozva';
      case 2:
        return 'átvételre kész';
      case 3:
        return 'teljesítve';
      default:
        return 'ismeretlen';
    }
  };

  // Szállítási címek
  const [shippingAddresses, setShippingAddresses] = useState([]);
  
  // Számlázási címek
  const [billingAddresses, setBillingAddresses] = useState([]);

  // Új cím form
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    postalCode: '',
    city: '',
    address: '',
    phoneNumber: ''
  });

  // Módosítás státuszok
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [editingBillingId, setEditingBillingId] = useState(null);
  const [newAddressType, setNewAddressType] = useState(null); // 'shipping' vagy 'billing'

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  // function GetProfile(){
  //   fetch("")
  // }

  // Profil adatok mentése
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    try {
      console.log(userData)
      const response = await axios.put(
        `http://localhost:5175/api/Profile/UpdateUser/${savedEmail}`,
        {
          userFullName: userData.userFullName,
          userEmail: userData.userEmail
        }
      );

      if (response.status === 200) {
        // Itt is figyelj a konzisztens elnevezésre:
        localStorage.setItem('fullname', userData.userFullName);
        localStorage.setItem('email', userData.userEmail);
        window.dispatchEvent(new Event('userProfileUpdated'));

        setEditingProfile(false);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      }
    } catch (error) {
      // Axios hiba esetén itt nézd meg, mit mond a szerver:
      console.error('Hiba:', error.response?.data || error.message);
      alert('Hiba történt a mentés során!');
    }
  };

  //Salt generator
  function GenerateSalt(SaltLength) {
    const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let salt = "";

    for (let i = 0; i < SaltLength; i++) {
      const randomIndex = Math.floor(Math.random() * karakterek.length);
      salt += karakterek[randomIndex];
    }

    return salt;
  }

  const checkPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (!value) {
      setPasswordStrength({ score: 0, label: "", color: "#ccc" });
    } else if (score <= 2) {
      setPasswordStrength({ score, label: "Gyenge", color: "red" });
    } else if (score <= 4) {
      setPasswordStrength({ score, label: "Közepes", color: "orange" });
    } else {
      setPasswordStrength({ score, label: "Erős", color: "green" });
    }
  };

  // Jelszó változtatás
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", isError: false }); // Előző üzenet törlése

    if (userData.newPassword !== userData.confirmPassword) {
      setStatusMessage({ text: "Az új jelszó és a megerősítés nem egyezik!", isError: true });
      return;
    }

    if (userData.currentPassword && userData.newPassword && userData.currentPassword === userData.newPassword) {
      setStatusMessage({ text: "Az új jelszó nem lehet ugyanaz, mint a régi.", isError: true });
      return;
    }

    if (passwordStrength.score < 5) {
      setStatusMessage({ text: "A jelszó nem elég erős! Használjon kisbetűt, nagybetűt, számot és speciális karaktert!", isError: true });
      return;
    }

    try {
      const saltResponse = await axios.get(`http://localhost:5175/api/Login/GetSalt/${encodeURIComponent(userData.userEmail)}`);
      if (saltResponse.status !== 200) throw new Error("Nem sikerült lekérni a saltot.");
      const currentDbSalt = await saltResponse.data;

      const oldHashed = await hashPassword(userData.currentPassword, currentDbSalt);

      const newSalt = GenerateSalt(64);
      const newHashed = await hashPassword(userData.newPassword, newSalt);

      const response = await axios.put("http://localhost:5175/api/Registration/ChangePassword", {
        email: userData.userEmail,
        oldPassword: oldHashed,
        newPassword: newHashed,
        salt: newSalt
      });

      if (response.status === 200) {
        setStatusMessage({ text: "Sikeres jelszó módosítás!", isError: false });

        setUserData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
          
        }));
        
        setPasswordStrength({ score: 0, label: "", color: "#ccc" });
      } else {
        const errorMsg = await response.data;
        setStatusMessage({ text: "Hiba: " + errorMsg, isError: true });
      }
    } catch (error) {
      console.error("Hiba történt:", error);
      setStatusMessage({ text: "Hálózati hiba történt!", isError: true });
    }
  };

  const hashPassword = async (password, salt) => {
    const combinedPassword = password + salt;
    const msgBuffer = new TextEncoder().encode(combinedPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };


  // Szállítási cím mentése
  // generic save function for both address types
  const saveAddress = async (type, idx, e) => {
    if (e) e.preventDefault();
    setAddressStatusMessage({ text: "", isError: false });

    try {
      if (!userID) {
        setAddressStatusMessage({ text: "Bejelentkezés szükséges!", isError: true });
        return;
      }

      const list = type === 'shipping' ? shippingAddresses : billingAddresses;
      if (!list[idx]) return;
      const address = list[idx];

      const response = await axios.put(
        `http://localhost:5175/api/address/PutAddress/${address.id}`,
        {
          postalCode: address.postalCode,
          city: address.city,
          address: address.address,
          phoneNumber: address.phoneNumber,
          addressType: type === 'shipping' ? 1 : 0,
          userID: parseInt(userID)
        }
      );

      if (response.status === 200) {
        setAddressStatusMessage({ text: "Cím sikeresen frissítve!", isError: false });
        if (type === 'shipping') setEditingShippingId(null);
        else setEditingBillingId(null);
        setTimeout(() => setAddressStatusMessage({ text: "", isError: false }), 3000);
      }
    } catch (error) {
      const errorMsg = error.response?.data || 'Hiba történt a mentés során!';
      setAddressStatusMessage({ text: errorMsg, isError: true });
    }
  };

  // Számlázási cím mentése handled by saveAddress helper

  // Új cím hozzáadása
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setAddressStatusMessage({ text: "", isError: false });

    try {
      if (!userID) {
        setAddressStatusMessage({ text: "Bejelentkezés szükséges!", isError: true });
        return;
      }

      const addressType = newAddress.type === 'shipping' ? 1 : 0;

      const response = await axios.post(
        `http://localhost:5175/api/address/PostAddress`,
        {
          postalCode: newAddress.postalCode,
          city: newAddress.city,
          address: newAddress.address,
          phoneNumber: newAddress.phoneNumber,
          addressType: addressType,
          userID: parseInt(userID)
        }
      );

      if (response.status === 200) {
        setAddressStatusMessage({ text: "Új cím sikeresen hozzáadva!", isError: false });
        await refreshAddresses();
        // Form reset
        setNewAddress({
          type: newAddress.type,
          postalCode: '',
          city: '',
          address: '',
          phoneNumber: ''
        });
        setNewAddressType(null);
      }
    } catch (error) {
      const errorMsg = error.response?.data || 'Hiba történt a cím hozzáadásakor!';
      setAddressStatusMessage({ text: errorMsg, isError: true });
    }
  };

  // Cím törlésének megerősítése (id alapján)
  const deleteAddress = (id) => {
    setDeleteAddressId(id);
    setShowDeleteModal(true);
  };

  // Valós törlés az API-n keresztül
  const confirmDeleteAddress = async () => {
    setAddressStatusMessage({ text: "", isError: false });

    try {
      if (!userID) {
        setAddressStatusMessage({ text: "Bejelentkezés szükséges!", isError: true });
        return;
      }

      const response = await axios.delete(
        `http://localhost:5175/api/address/DeleteAddress/${deleteAddressId}`
      );

      if (response.status === 200) {
        setAddressStatusMessage({ text: "Cím sikeresen törölve!", isError: false });
        // refresh addresses
        await refreshAddresses();
      }

      setShowDeleteModal(false);
      setDeleteAddressId(null);
    } catch (error) {
      const errorMsg = error.response?.data || 'Hiba történt a törlés során!';
      setAddressStatusMessage({ text: errorMsg, isError: true });
      setShowDeleteModal(false);
    }
  };

  // Input változások kezelése
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const handleAddressInputChange = (e, type, idx, field) => {
    let { value } = e.target;
    if (field === 'phoneNumber') {
      value = sanitizePhone(value);
    }

    if (type === 'shipping') {
      const updated = shippingAddresses.map((addr, i) =>
        i === idx ? { ...addr, [field]: value } : addr
      );
      setShippingAddresses(updated);
    } else {
      const updated = billingAddresses.map((addr, i) =>
        i === idx ? { ...addr, [field]: value } : addr
      );
      setBillingAddresses(updated);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'phoneNumber') {
      v = sanitizePhone(value);
    }
    setNewAddress({ ...newAddress, [name]: v });
  };

  const refreshAddresses = async () => {
    if (!userID) return;
    try {
      const shippingRes = await axios.get(`http://localhost:5175/api/address/GetAddresses/${userID}/1`);
      if (Array.isArray(shippingRes.data)) {
        setShippingAddresses(shippingRes.data);
      }
      const billingRes = await axios.get(`http://localhost:5175/api/address/GetAddresses/${userID}/0`);
      if (Array.isArray(billingRes.data)) {
        setBillingAddresses(billingRes.data);
      }
      // clear any editing state when data refreshes
      setEditingShippingId(null);
      setEditingBillingId(null);
    } catch (err) {
      console.error('Hiba a címek frissítésekor', err);
    }
  };

  const copyAddress = async (fromType, idx) => {
    const sourceList = fromType === 'shipping' ? shippingAddresses : billingAddresses;
    const targetType = fromType === 'shipping' ? 'billing' : 'shipping';
    const targetList = targetType === 'shipping' ? shippingAddresses : billingAddresses;

    if (targetList.length >= 3) {
      setAddressStatusMessage({ text: 'A céloldalon már 3 cím szerepel.', isError: true });
      return;
    }

    const source = sourceList[idx];
    if (!source) return;

    const payload = {
      postalCode: source.postalCode,
      city: source.city,
      address: source.address,
      phoneNumber: source.phoneNumber,
      addressType: targetType === 'shipping' ? 1 : 0,
      userID: parseInt(userID),
    };

    try {
      const res = await axios.post(`http://localhost:5175/api/address/PostAddress`, payload);
      if (res.status === 200) {
        setAddressStatusMessage({ text: 'Cím másolva!', isError: false });
        await refreshAddresses();
      }
    } catch (err) {
      const msg = err.response?.data || 'Hiba a másolás során';
      setAddressStatusMessage({ text: msg, isError: true });
    }
  };

  const passwordsDoNotMatch =
    !!userData.newPassword &&
    !!userData.confirmPassword &&
    userData.newPassword !== userData.confirmPassword;

  return (
    <div className="profile-container">
      {/* Fejléc */}
      <header className="profile-header">
        <h1>Profilom</h1>
        <p>Itt kezelheted személyes adataidat és címeidet</p>
      </header>

      <div className="profile-content">
        {/* Bal oldali navigáció */}
        <div className="profile-sidebar">
          <ul>
            <li><a href="#profile">Profil adatok</a></li>
            <li><a href="#shipping">Szállítási címek</a></li>
            <li><a href="#billing">Számlázási címek</a></li>
            <li><a href="#orders">Rendeléseim</a></li>
            <li><a href="#service-requests">Szerviz kérések</a></li>
          </ul>
        </div>

        {/* Fő tartalom */}
        <main className="profile-main">
          {/* 1. Profil adatok szakasz */}
          <section id="profile" className="profile-section">
            <div className="section-header">
              <h2>Profil adatok</h2>
              {!editingProfile ? (
                <button className="btn-edit" onClick={() => setEditingProfile(true)}>
                  Szerkesztés
                </button>
              ) : (
                <button className="btn-cancel" onClick={() => setEditingProfile(false)}>
                  Mégse
                </button>
              )}
            </div>

            {/* Profil szekció - az általad kért összevont mezőkkel */}
            <form onSubmit={handleProfileSubmit}>
              <div className="form-stack">
                <div className="form-group">
                  <label>Név</label>
                  <InputText
                    type="text"
                    value={userData.userFullName}
                    onChange={(e) => setUserData({ ...userData, userFullName: e.target.value })}
                    disabled={!editingProfile}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email cím</label>
                  <InputText
                    type="email"
                    value={userData.userEmail}
                    onChange={(e) => setUserData({ ...userData, userEmail: e.target.value })}
                    disabled={!editingProfile}
                    required
                  />
                </div>
              </div>
              {editingProfile && <button type="submit" className="btn-save">Mentés</button>}
            </form>

            {showConfirmModal && (
              <div className="profile-modal-overlay">
                <div className="profile-modal-content">
                  <div className="profile-modal-header">
                    <h3 className="profile-modal-title">Megerősítés</h3>
                  </div>
                  <div className="profile-modal-body">
                    <p className="profile-modal-text">Biztosan menteni szeretnéd a módosításokat?</p>
                  </div>
                  <div className="profile-modal-actions">
                    <button onClick={() => setShowConfirmModal(false)} className="profile-modal-btn-cancel">
                      Mégse
                    </button>
                    <button onClick={confirmSave} className="profile-modal-btn-confirm">
                      Igen, mentés
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showSuccessModal && (
              <div className="profile-modal-overlay">
                <div className="profile-modal-content">
                  <div className="profile-modal-body">
                    <h3>Sikeres mentés</h3>
                  </div>
                </div>
              </div>
            )}


            {/* Jelszó változtatás */}
            <div className="password-section">
              <h3>Jelszó változtatás</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Jelenlegi jelszó</label>
                    <InputText
                      type="password"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Új jelszó</label>
                    <InputText
                      type="password"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                    />

                    {/* Itt jelenik meg az erősségjelző, ha már elkezdtek gépelni */}
                    {userData.newPassword && (
                      <div className="password-strength-container">
                        <div style={{ background: "#eee", height: "6px", borderRadius: "4px", marginTop: "6px", width: "100%" }}>
                          <div style={{
                            width: `${passwordStrength.score * 20}%`,
                            height: "100%",
                            background: passwordStrength.color,
                            borderRadius: "4px",
                            transition: "0.3s"
                          }} />
                        </div>
                        <small style={{ color: passwordStrength.color, display: "block", marginTop: "4px" }}>
                          {passwordStrength.label}
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Új jelszó megerősítése</label>
                    <InputText
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    {passwordsDoNotMatch && (
                      <small style={{ color: "#ff4d4d", display: "block", marginTop: "6px" }}>
                        Az új jelszó és a megerősítés nem egyezik.
                      </small>
                    )}
                  </div>
                </div>
                {statusMessage.text && (
                  <div style={{
                    color: statusMessage.isError ? "#ff4d4d" : "#2ecc71",
                    textAlign: "center",
                    padding: "10px",
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor: statusMessage.isError ? "#ffe6e6" : "#e6fffa", // Halvány háttér a jobb olvashatóságért
                    borderRadius: "4px"
                  }}>
                    {statusMessage.text}
                  </div>
                )}
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    Jelszó változtatása
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* 2. Szállítási címek szakasz */}
          <section id="shipping" className="profile-section">
            <div className="section-header">
              <h2>Szállítási cím</h2>
              {shippingAddresses.length < 3 && !newAddressType && (
                <button
                  className="btn-add"
                  onClick={() => {
                    setNewAddress({ type: 'shipping', postalCode: '', city: '', address: '', phoneNumber: '' });
                    setNewAddressType('shipping');
                  }}
                >
                  + Új cím
                </button>
              )}
            </div>

            {shippingAddresses.length > 0 ? (
              <div className="addresses-grid">
                {shippingAddresses.map((address, idx) => (
                  <div key={address.id || idx} className="address-card">
                    {editingShippingId === idx ? (
                      <form onSubmit={(e) => saveAddress('shipping', idx, e)}>
                        <div className="form-group">
                          <label>Irányítószám</label>
                          <InputText
                            type="text"
                            value={address.postalCode || ''}
                            onChange={(e) => handleAddressInputChange(e, 'shipping', idx, 'postalCode')}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Város</label>
                          <InputText
                            type="text"
                            value={address.city || ''}
                            onChange={(e) => handleAddressInputChange(e, 'shipping', idx, 'city')}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Utca, házszám</label>
                          <InputText
                            type="text"
                            value={address.address || ''}
                            onChange={(e) => handleAddressInputChange(e, 'shipping', idx, 'address')}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Telefonszám</label>
                          <InputText
                            type="tel"
                            value={address.phoneNumber || ''}
                            onChange={(e) => handleAddressInputChange(e, 'shipping', idx, 'phoneNumber')}
                            maxLength={MAX_PHONE_LENGTH}
                          />
                        </div>
                        <div className="address-actions">
                          <button type="submit" className="btn-save">Mentés</button>
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setEditingShippingId(null)}
                          >
                            Mégse
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="address-details">
                          <p><strong>Irányítószám:</strong> {address.postalCode}</p>
                          <p><strong>Város:</strong> {address.city}</p>
                          <p><strong>Cím:</strong> {address.address}</p>
                          <p><strong>Telefonszám:</strong> {address.phoneNumber}</p>
                        </div>
                        <div className="address-actions">
                          <button
                            className="btn-edit"
                            onClick={() => setEditingShippingId(idx)}
                          >
                            Szerkesztés
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteAddress(address.id)}
                          >
                            Törlés
                          </button>
                          <button
                            className="btn-copy"
                            onClick={() => copyAddress('shipping', idx)}
                            disabled={billingAddresses.length >= 3}
                          >
                            Másolás számlázáshoz
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Nincs szállítási cím megadva.</p>
            )}

            {addressStatusMessage.text && (
              <div style={{
                color: addressStatusMessage.isError ? "#ff4d4d" : "#2ecc71",
                textAlign: "center",
                padding: "10px",
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: addressStatusMessage.isError ? "#ffe6e6" : "#e6fffa",
                borderRadius: "4px"
              }}>
                {addressStatusMessage.text}
              </div>
            )}

            {newAddressType === 'shipping' && (
              <div className="address-card" style={{ marginTop: '20px' }}>
                <h4>Új szállítási cím</h4>
                <form onSubmit={handleAddNewAddress}>
                  <div className="form-group">
                    <label>Irányítószám</label>
                    <InputText
                      type="text"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleNewAddressChange}
                      placeholder="1052"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Város</label>
                    <InputText
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      placeholder="Budapest"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Utca, házszám</label>
                    <InputText
                      type="text"
                      name="address"
                      value={newAddress.address}
                      onChange={handleNewAddressChange}
                      placeholder="Kossuth Lajos utca 12."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefonszám</label>
                    <InputText
                      type="tel"
                      name="phoneNumber"
                      value={newAddress.phoneNumber}
                      onChange={handleNewAddressChange}
                      placeholder="36 30 123 4567"
                      required
                      maxLength={MAX_PHONE_LENGTH}
                    />
                  </div>
                  <div className="address-actions">
                    <button type="submit" className="btn-save">
                      Cím hozzáadása
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setNewAddressType(null);
                        setNewAddress({ type: 'shipping', postalCode: '', city: '', address: '', phoneNumber: '' });
                      }}
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
          <section id="billing" className="profile-section">
            <div className="section-header">
              <h2>Számlázási cím</h2>
              {billingAddresses.length < 3 && !newAddressType && (
                <button
                  className="btn-add"
                  onClick={() => {
                    setNewAddress({ type: 'billing', postalCode: '', city: '', address: '', phoneNumber: '' });
                    setNewAddressType('billing');
                  }}
                >
                  + Új cím
                </button>
              )}
            </div>

            {billingAddresses.length > 0 ? (
              <div className="addresses-grid">
                {billingAddresses.map((address, idx) => (
                  <div key={address.id || idx} className="address-card">
                    {editingBillingId === idx ? (
                      <form onSubmit={(e) => saveAddress('billing', idx, e)}>
                        <div className="form-group">
                          <label>Irányítószám</label>
                          <InputText
                            type="text"
                            value={address.postalCode || ''}
                            onChange={(e) => handleAddressInputChange(e, 'billing', idx, 'postalCode')}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Város</label>
                          <InputText
                            type="text"
                            value={address.city || ''}
                            onChange={(e) => handleAddressInputChange(e, 'billing', idx, 'city')}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Utca, házszám</label>
                          <InputText
                            type="text"
                            value={address.address || ''}
                            onChange={(e) => handleAddressInputChange(e, 'billing', idx, 'address')}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Telefonszám</label>
                          <InputText
                            type="tel"
                            value={address.phoneNumber || ''}
                            onChange={(e) => handleAddressInputChange(e, 'billing', idx, 'phoneNumber')}
                            maxLength={MAX_PHONE_LENGTH}
                          />
                        </div>
                        <div className="address-actions">
                          <button type="submit" className="btn-save">Mentés</button>
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setEditingBillingId(null)}
                          >
                            Mégse
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="address-details">
                          <p><strong>Irányítószám:</strong> {address.postalCode}</p>
                          <p><strong>Város:</strong> {address.city}</p>
                          <p><strong>Cím:</strong> {address.address}</p>
                          <p><strong>Telefonszám:</strong> {address.phoneNumber}</p>
                        </div>
                        <div className="address-actions">
                          <button
                            className="btn-edit"
                            onClick={() => setEditingBillingId(idx)}
                          >
                            Szerkesztés
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteAddress(address.id)}
                          >
                            Törlés
                          </button>
                          <button
                            className="btn-copy"
                            onClick={() => copyAddress('billing', idx)}
                            disabled={shippingAddresses.length >= 3}
                          >
                            Másolás szállításhoz
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Nincs számlázási cím megadva.</p>
            )}

            {addressStatusMessage.text && (
              <div style={{
                color: addressStatusMessage.isError ? "#ff4d4d" : "#2ecc71",
                textAlign: "center",
                padding: "10px",
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: addressStatusMessage.isError ? "#ffe6e6" : "#e6fffa",
                borderRadius: "4px"
              }}>
                {addressStatusMessage.text}
              </div>
            )}

            {newAddressType === 'billing' && (
              <div className="address-card" style={{ marginTop: '20px' }}>
                <h4>Új számlázási cím</h4>
                <form onSubmit={handleAddNewAddress}>
                  <div className="form-group">
                    <label>Irányítószám</label>
                    <InputText
                      type="text"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleNewAddressChange}
                      placeholder="1052"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Város</label>
                    <InputText
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      placeholder="Budapest"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Utca, házszám</label>
                    <InputText
                      type="text"
                      name="address"
                      value={newAddress.address}
                      onChange={handleNewAddressChange}
                      placeholder="Kossuth Lajos utca 12."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefonszám</label>
                    <InputText
                      type="tel"
                      name="phoneNumber"
                      value={newAddress.phoneNumber}
                      onChange={handleNewAddressChange}
                      placeholder="36 30 123 4567"
                      required
                      maxLength={MAX_PHONE_LENGTH}
                    />
                  </div>
                  <div className="address-actions">
                    <button type="submit" className="btn-save">
                      Cím hozzáadása
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setNewAddressType(null);
                        setNewAddress({ type: 'billing', postalCode: '', city: '', address: '', phoneNumber: '' });
                      }}
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
          <section id="orders" className="profile-section">
            <div className="section-header">
              <h2>Megrendelések</h2>
            </div>

            <div className="orders-grid">
              {phones.map((phone, index) => (
                <div key={index} className="order-card">
                  <div className="order-header">
                    <h3>{phone.phoneName}</h3>
                    <span className={`order-status status-${getStatusText(phone.status).replace(/\s/g, '-')}`}>
                      {getStatusText(phone.status)}
                    </span>
                  </div>

                  <div className="order-details">
                    <p><strong>Darabszám:</strong> {phone.amount} db</p>
                    <p><strong>Ár:</strong> {phone.price.toLocaleString()} Ft</p>
                    <p><strong>RAM/Tárhely:</strong> {phone.phoneRam}/{phone.phoneStorage}</p>
                    <p><strong>Szín:</strong> {phone.phoneColorName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>



          {/*Szerviz kérések */}
          <section id="service-requests" className="profile-section">
            <div className="section-header">
              <h2>Szervizeltetések</h2>
            </div>

            <div className="orders-grid">
              {serviceRequests.length > 0 ? (
                serviceRequests.map((request, index) => (
                  <div key={index} className="service-request-card">
                    <div className="service-request-header">
                      <h3>{request.phoneName}</h3>
                      <span className={`service-request-status status-${getStatusText(request.status).replace(/\s/g, '-')}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <div className="service-request-details">
                      {console.log('Szervizkérés részletei:', request)}
                      <p><strong>Gyártó:</strong> {request.manufacturerName}</p>
                      <p><strong>Város:</strong> {request.billingCity}</p>
                      <p><strong>Cím:</strong> {request.billingAddress}</p>
                      <p><strong>Telefonszám:</strong> {request.billingPhoneNumber}</p>
                      <p><strong>Hiba leírása:</strong> {request.problemDescription}</p>
                      <p><strong>Vizsgálat:</strong> {request.phoneInspection ? "érdekelne" : "nem érdekelne"}</p>
                      <p><strong>Ár:</strong> {request.repairPrice ? request.repairPrice.toLocaleString() + ' Ft' : 'Árajánlat függőben'}</p>
                      {request.isPriceAccepted === 1 && <p className="text-success"><strong>Árajánlat elfogadva</strong></p>}
                      {request.isPriceAccepted === 2 && <p className="text-danger"><strong>Árajánlat elutasítva</strong></p>}
                    </div>
                    {request.isPriceAccepted === 0 && (
                      <div className="service-request-actions">
                        <button
                          className="btn-view-offer"
                          onClick={() => openPriceModal(request)}
                        >
                          Árajánlat megtekintése
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted">Nincs szervizeltetési kérés.</p>
              )}
            </div>
          </section>

          {/* árajánlat megtekintése modal */}
          {showPriceModal && activeRepair && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                <div className="profile-modal-header">
                  <h3 className="profile-modal-title">Árajánlat</h3>
                </div>
                <div className="profile-modal-body">
                  <p>Árajánlat összege: <strong>{activeRepair.repairPrice.toLocaleString()} Ft</strong></p>
                </div>
                <div className="profile-modal-actions">
                  <button onClick={handleAcceptOffer} className="profile-modal-btn-confirm">Elfogadás</button>
                  <button onClick={handleDeclineOffer} className="btn-cancel">Elutasítás</button>
                  <button onClick={closePriceModal} className="profile-modal-btn-cancel">Vissza</button>
                </div>
              </div>
            </div>
          )}

          {/* elutasítás megerősítő modal */}
          {showDeclineConfirm && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                <div className="profile-modal-header">
                  <h3 className="profile-modal-title">Árajánlat elutasítása</h3>
                </div>
                <div className="profile-modal-body">
                  <p className="profile-modal-text">Biztosan el szeretnéd utasítani az árajánlatot?</p>
                </div>
                <div className="profile-modal-actions">
                  <button onClick={confirmDecline} className="btn-cancel">Igen</button>
                  <button onClick={() => setShowDeclineConfirm(false)} className="profile-modal-btn-cancel">Nem</button>
                </div>
              </div>
            </div>
          )}

          {/* fizetes modal az arajanlatlozahoz */}
          {showRepairPaymentModal && activeRepair && (
            <div className="paymentModal" style={{ display: 'flex' }}>
              <div className="modalContent">
                <span className="closeModal" onClick={() => setShowRepairPaymentModal(false)}>&times;</span>
                <h2 className="modalTitle">Fizetés</h2>
                <div className="modalTotalPrice">
                  Végösszeg: <strong>{activeRepair.repairPrice.toLocaleString()}</strong> Ft
                </div>
                {paymentAddressLoadError && <div className="error-message">{paymentAddressLoadError}</div>}
                {paymentAddressLoading && <div className="addressInfoText">Címadatok betöltése...</div>}
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
                    <h4>Számlázási cím (automatikus)</h4>
                    <div className="addressDisplayBox">
                      <p><strong>Irányítószám:</strong> {paymentBillingAddressData.postalCode}</p>
                      <p><strong>Város:</strong> {paymentBillingAddressData.city}</p>
                      <p><strong>Cím:</strong> {paymentBillingAddressData.address}</p>
                      <p><strong>Telefonszám:</strong> {paymentBillingAddressData.phoneNumber}</p>
                    </div>
                  </form>
                </div>
                <button
                  id="submitPayment"
                  className="submitPaymentBtn paymentButton"
                  type="button"
                  onClick={handleRepairPayment}
                >
                  Fizetés leadása
                </button>
              </div>
            </div>
          )}
          {/* Cím törlés megerősítő modal */}
          {showDeleteModal && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                <div className="profile-modal-header">
                  <h3 className="profile-modal-title">Megerősítés</h3>
                </div>
                <div className="profile-modal-body">
                  <p className="profile-modal-text">Biztosan szeretnéd törölni ezt a címet?</p>
                </div>
                <div className="profile-modal-actions">
                  <button 
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteAddressId(null);
                    }} 
                    className="profile-modal-btn-cancel"
                  >
                    Mégse
                  </button>
                  <button 
                    onClick={confirmDeleteAddress}
                    className="profile-modal-btn-confirm"
                  >
                    Igen, törlés
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;



