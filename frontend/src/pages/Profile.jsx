import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';

import InputText from '../components/InputText';
import { getCityFromPostalCode } from '../utils/postalCodeUtils';

// Render profile page.
const Profile = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userData, setUserData] = useState({ userFullName: '', userEmail: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [userID, setUserID] = useState(null);
  const savedEmail = localStorage.getItem('email');

  // Load user data.
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedName = localStorage.getItem('fullname');
        setUserData(prev => ({ ...prev, userFullName: savedName, userEmail: savedEmail }));

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

  // Refresh addresses.
  useEffect(() => {
    if (userID) {
      refreshAddresses();
    }
  }, [userID]); // eslint-disable-line react-hooks/exhaustive-deps

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "#ccc" });
  const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addressStatusMessage, setAddressStatusMessage] = useState({ text: "", isError: false });

  const MAX_PHONE_LENGTH = 11;

  // Sanitize phone value.
  const sanitizePhone = (val) => {
    if (!val) return '';
    let s = val.replace(/\D/g, '');
    if (s.length > MAX_PHONE_LENGTH) s = s.slice(0, MAX_PHONE_LENGTH);
    return s;
  };

  // Format date time.
  const formatDateTime = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const [phones, setPhones] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [activeRepair, setActiveRepair] = useState(null);
  const [showEditRequestForm, setShowEditRequestForm] = useState(false);
  const [editRequestText, setEditRequestText] = useState('');
  const [editRequestMessage, setEditRequestMessage] = useState({ text: '', isError: false });
  const [offerActionMessage, setOfferActionMessage] = useState({ text: '', isError: false });
  const [showActionConfirmModal, setShowActionConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [waitingForServiceUpdate, setWaitingForServiceUpdate] = useState({});

  const [showRepairPaymentModal, setShowRepairPaymentModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
  const [paymentFormErrors, setPaymentFormErrors] = useState({});
  const [, setPaymentDeliveryAddressData] = useState({ postalCode: '', city: '', address: '', phoneNumber: '' });
  const [paymentBillingAddressData, setPaymentBillingAddressData] = useState({ postalCode: '', city: '', address: '', phoneNumber: '' });
  const [, setPaymentBillingSameAsDelivery] = useState(true);
  const [, setPaymentAddressErrors] = useState({});
  const [paymentAddressLoading] = useState(false);
  const [paymentAddressLoadError] = useState('');
  const [paymentBillingAddressList] = useState([]);
  const [paymentDeliveryAddressList] = useState([]);
  const [, setPaymentSelectedBillingAddressId] = useState(null);
  const [, setPaymentSelectedDeliveryAddressId] = useState(null);
  const [, setPaymentShowBillingAddressForm] = useState(false);
  const [, setPaymentShowDeliveryAddressForm] = useState(false);

  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');

  // Check payment auth.
  const isAuthenticatedForPayment = () => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('jwtToken') || localStorage.getItem('token');
    return Boolean(token) && userID && !Number.isNaN(Number(userID)) && Number(userID) > 0;
  };

  // Load service requests.
  useEffect(() => {
    const loadServiceRequests = async () => {
      try {
        const numericUserId = Number(userID);
        if (!userID || Number.isNaN(numericUserId) || numericUserId <= 0) {
          return;
        }

        const response = await axios.get(`http://localhost:5175/api/Profile/GetRepair/${numericUserId}`);
        if (Array.isArray(response.data)) {
          const withId = response.data.map(r => ({ ...r, userID: numericUserId }));

          setWaitingForServiceUpdate(prev => {
            const next = { ...prev };
            withId.forEach((repair) => {
              if (!(repair.repairID in prev)) return;

              const previousServiceDescription = (prev[repair.repairID] || '').trim();
              const currentServiceDescription = (repair.repairDescription || '').trim();

              if (currentServiceDescription && currentServiceDescription !== previousServiceDescription) {
                delete next[repair.repairID];
              }
            });
            return next;
          });

          setServiceRequests(withId);
        }
      } catch (error) {
        console.error('Hiba a szervízrendelések betöltésekor:', error);
      }
    };

    loadServiceRequests();

    const refreshHandler = () => {
      loadServiceRequests();
    };
    window.addEventListener('repairUpdated', refreshHandler);
    return () => window.removeEventListener('repairUpdated', refreshHandler);
  }, [userID]);

  // Open offer modal.
  const openPriceModal = (repair) => {
    setActiveRepair(repair);
    setShowEditRequestForm(false);
    setEditRequestText('');
    setEditRequestMessage({ text: '', isError: false });
    setOfferActionMessage({ text: '', isError: false });
    setShowPriceModal(true);
  };

  // Close offer modal.
  const closePriceModal = () => {
    setActiveRepair(null);
    setShowPriceModal(false);
    setShowActionConfirmModal(false);
    setPendingAction(null);
    setShowEditRequestForm(false);
    setEditRequestText('');
    setEditRequestMessage({ text: '', isError: false });
    setOfferActionMessage({ text: '', isError: false });
  };

  // Normalize payment address.
  const normalizePaymentAddress = (address) => ({
    postalCode: address?.postalCode?.toString() || '',
    city: address?.city || '',
    address: address?.address || '',
    phoneNumber: address?.phoneNumber?.toString() || ''
  });

  // Update payment input.
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

  // eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
  const toggleBillingSameAsDeliveryPayment = (checked) => {
    setPaymentBillingSameAsDelivery(checked);
    if (checked) {
      setPaymentShowDeliveryAddressForm(false);
      setPaymentSelectedDeliveryAddressId(null);
      setPaymentDeliveryAddressData({ postalCode: '', city: '', address: '', phoneNumber: '' });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handlePaymentAddressInputChange = (type, field, value) => {
    let processed = value;
    if (field === 'postalCode') {
      processed = value.replace(/\D/g, '').slice(0, 4);
    }
    if (field === 'phoneNumber') {
      processed = value.replace(/\D/g, '').slice(0, MAX_PHONE_LENGTH);
    }

    if (type === 'billing') {
      setPaymentBillingAddressData(prev => ({ ...prev, [field]: processed }));
    } else {
      setPaymentDeliveryAddressData(prev => ({ ...prev, [field]: processed }));
    }
  };

  // Validate payment form.
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

  // Fill payment addresses.
  useEffect(() => {
    if (!showRepairPaymentModal || !activeRepair) return;

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

  // Process repair payment.
  const handleRepairPayment = async () => {
    if (!validatePaymentForm() || !activeRepair) return;
    try {
      const payload = {
        ...activeRepair,
        userID: activeRepair.userID || userID,
        isPriceAccepted: 1
      };
      await axios.put(
        `http://localhost:5175/api/Profile/updateRepair/${activeRepair.repairID}`,
        payload
      );
      setServiceRequests(prev => prev.map(r => r.repairID === activeRepair.repairID ? { ...r, isPriceAccepted: 1 } : r));
      window.dispatchEvent(new Event('repairUpdated'));
      setPaymentSuccessMessage('Fizetés sikeres!');
      setTimeout(() => {
        setShowRepairPaymentModal(false);
        setActiveRepair(null);
        setPaymentSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error('Hiba fizetés után:', err);
    }
  };

  // Request offer accept.
  const handleAcceptOffer = () => {
    setPendingAction('accept');
    setShowActionConfirmModal(true);
  };

  // Continue accept flow.
  const proceedAcceptOffer = () => {
    if (!activeRepair) return;
    if (!isAuthenticatedForPayment()) {
      setOfferActionMessage({ text: 'A fizetéshez be kell jelentkezni.', isError: true });
      return;
    }

    setOfferActionMessage({ text: '', isError: false });
    setShowPriceModal(false);
    setPaymentFormData({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
    setPaymentFormErrors({});
    setPaymentAddressErrors({});
    setShowRepairPaymentModal(true);
  };

  // Request offer decline.
  const handleDeclineOffer = () => {
    setPendingAction('decline');
    setShowActionConfirmModal(true);
  };

  // Confirm offer decline.
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
      setServiceRequests(prev => prev.map(r => r.repairID === activeRepair.repairID ? { ...r, isPriceAccepted: 2 } : r));
      closePriceModal();
    } catch (err) {
      console.error('Árajánlat elutasítása hiba:', err);
      closePriceModal();
    }
  };

  // Toggle edit form.
  const toggleEditRequestForm = () => {
    setShowEditRequestForm(prev => !prev);
    setEditRequestMessage({ text: '', isError: false });
    setEditRequestText('');
  };

  // Cancel edit request.
  const cancelEditRequest = () => {
    setShowEditRequestForm(false);
    setEditRequestText('');
    setEditRequestMessage({ text: '', isError: false });
  };

  // Queue edit request.
  const handleSubmitEditRequest = async () => {
    const trimmedDescription = editRequestText.trim();
    if (!trimmedDescription) {
      setEditRequestMessage({ text: 'A módosítás leírása nem lehet üres.', isError: true });
      return;
    }

    setPendingAction('edit');
    setShowActionConfirmModal(true);
  };

  // Submit edit request.
  const submitEditRequest = async () => {
    if (!activeRepair) return;

    const trimmedDescription = editRequestText.trim();
    if (!trimmedDescription) {
      setEditRequestMessage({ text: 'A módosítás leírása nem lehet üres.', isError: true });
      return;
    }

    try {
      const previousServiceDescription = (activeRepair.repairDescription || '').trim();
      const baseDescription = (activeRepair.problemDescription || '').trim();
      const nowText = formatDateTime();

      let mergedDescription = baseDescription;

      if (previousServiceDescription) {
        mergedDescription = mergedDescription
          ? `${mergedDescription}\n\n---------------\n\nSzerviz frissítés:\n${previousServiceDescription}`
          : `Szerviz frissítés:\n${previousServiceDescription}`;
      }

      mergedDescription = mergedDescription
        ? `${mergedDescription}\n\n---------------\n\n${nowText} - Módosítás:\n${trimmedDescription}`
        : `${nowText} - Módosítás:\n${trimmedDescription}`;

      const payload = {
        ...activeRepair,
        userID: activeRepair.userID || userID,
        problemDescription: mergedDescription,
        repairDescription: '',
        repairPrice: 0,
        isPriceAccepted: 0
      };

      await axios.put(
        `http://localhost:5175/api/Profile/updateRepair/${activeRepair.repairID}`,
        payload
      );

      const updatedRepair = {
        ...activeRepair,
        problemDescription: mergedDescription,
        repairDescription: '',
        repairPrice: 0,
        isPriceAccepted: 0
      };

      setActiveRepair(updatedRepair);
      setServiceRequests(prev =>
        prev.map(r => (r.repairID === activeRepair.repairID ? updatedRepair : r))
      );
      setWaitingForServiceUpdate(prev => ({ ...prev, [activeRepair.repairID]: previousServiceDescription }));

      closePriceModal();
      setShowEditSuccessModal(true);
      setTimeout(() => {
        setShowEditSuccessModal(false);
      }, 5000);
      window.dispatchEvent(new Event('repairUpdated'));
    } catch (error) {
      console.error('Hiba a módosítási kérés küldésekor:', error);
      setEditRequestMessage({ text: 'Nem sikerült elküldeni a módosítási kérést.', isError: true });
    }
  };

  // Confirm pending action.
  const handleConfirmPendingAction = async () => {
    const action = pendingAction;
    setShowActionConfirmModal(false);
    setPendingAction(null);

    if (action === 'accept') {
      proceedAcceptOffer();
      return;
    }

    if (action === 'decline') {
      await confirmDecline();
      return;
    }

    if (action === 'edit') {
      await submitEditRequest();
    }
  };

  // Resolve confirm text.
  const getPendingActionConfirmText = () => {
    switch (pendingAction) {
      case 'accept':
        return 'Biztosan el szeretnéd fogadni az árajánlatot?';
      case 'decline':
        return "Biztosan el szeretnéd utasítani az árajánlatot? A készüléket visszakükldjük a számodra, és a szállítást utólag kell fizetned.";
      case 'edit':
        return 'Biztosan elküldöd a módosítási kérést?';
      default:
        return 'Biztosan folytatod?';
    }
  };

  // Load orders.
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const numericUserId = Number(userID);
        if (!userID || Number.isNaN(numericUserId) || numericUserId <= 0) {
          return;
        }

        const response = await axios.get(`http://localhost:5175/api/Profile/GetOrder/${numericUserId}`);
        if (Array.isArray(response.data)) {
          setPhones(response.data);
        }
      } catch (error) {
        console.error('Hiba a rendelések betöltésekor:', error);
      }
    };

    loadOrders();
  }, [userID]);

  // Map status text.
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

  // Check repair description.
  const hasServiceDescription = (repair) => {
    const text = repair?.repairDescription;
    return typeof text === 'string' && text.trim().length > 0;
  };

  // Check waiting state.
  const isWaitingForServiceResponse = (repair) => {
    if (!repair?.repairID) return false;
    return Object.prototype.hasOwnProperty.call(waitingForServiceUpdate, repair.repairID);
  };

  // Check offer visibility.
  const canShowOffer = (repair) => hasServiceDescription(repair) && !isWaitingForServiceResponse(repair);

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    postalCode: '',
    city: '',
    address: '',
    phoneNumber: ''
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [editingBillingId, setEditingBillingId] = useState(null);
  const [newAddressType, setNewAddressType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  // Submit profile form.
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Save profile changes.
  const confirmSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5175/api/Profile/UpdateUser/${savedEmail}`,
        {
          userFullName: userData.userFullName,
          userEmail: userData.userEmail
        }
      );

      if (response.status === 200) {
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
      console.error('Hiba:', error.response?.data || error.message);
      alert('Hiba történt a mentés során!');
    }
  };

  // Generate salt.
  function GenerateSalt(SaltLength) {
    const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let salt = "";

    for (let i = 0; i < SaltLength; i++) {
      const randomIndex = Math.floor(Math.random() * karakterek.length);
      salt += karakterek[randomIndex];
    }

    return salt;
  }

  // Evaluate password strength.
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

  // Change account password.
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: "", isError: false });

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

  // Hash password value.
  const hashPassword = async (password, salt) => {
    const combinedPassword = password + salt;
    const msgBuffer = new TextEncoder().encode(combinedPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Save address changes.
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
      const sanitizedPhoneNumber = sanitizePhone(address.phoneNumber);

      if (!/^\d{11}$/.test(sanitizedPhoneNumber)) {
        setAddressStatusMessage({ text: "A telefonszám pontosan 11 számjegy lehet!", isError: true });
        return;
      }

      const response = await axios.put(
        `http://localhost:5175/api/address/PutAddress/${address.id}`,
        {
          postalCode: address.postalCode,
          city: address.city,
          address: address.address,
          phoneNumber: sanitizedPhoneNumber,
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

  // Add new address.
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setAddressStatusMessage({ text: "", isError: false });

    try {
      if (!userID) {
        setAddressStatusMessage({ text: "Bejelentkezés szükséges!", isError: true });
        return;
      }

      const addressType = newAddress.type === 'shipping' ? 1 : 0;
      const sanitizedPhoneNumber = sanitizePhone(newAddress.phoneNumber);

      if (!/^\d{11}$/.test(sanitizedPhoneNumber)) {
        setAddressStatusMessage({ text: "A telefonszám pontosan 11 számjegy lehet!", isError: true });
        return;
      }

      const response = await axios.post(
        `http://localhost:5175/api/address/PostAddress`,
        {
          postalCode: newAddress.postalCode,
          city: newAddress.city,
          address: newAddress.address,
          phoneNumber: sanitizedPhoneNumber,
          addressType: addressType,
          userID: parseInt(userID)
        }
      );

      if (response.status === 200) {
        setAddressStatusMessage({ text: "Új cím sikeresen hozzáadva!", isError: false });
        await refreshAddresses();
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

  // Open delete dialog.
  const deleteAddress = (id) => {
    setDeleteAddressId(id);
    setShowDeleteModal(true);
  };

  // Delete selected address.
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

  // Update profile input.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  // Update address input.
  const handleAddressInputChange = async (e, type, idx, field) => {
    let { value } = e.target;
    if (field === 'phoneNumber') {
      value = sanitizePhone(value);
    }

    if (field === 'postalCode') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length === 4) {
        try {
          const data = await getCityFromPostalCode(value);
          if (data && data.telepules) {
            if (type === 'shipping') {
              const updated = shippingAddresses.map((addr, i) =>
                i === idx ? { ...addr, postalCode: value, city: data.telepules } : addr
              );
              setShippingAddresses(updated);
            } else {
              const updated = billingAddresses.map((addr, i) =>
                i === idx ? { ...addr, postalCode: value, city: data.telepules } : addr
              );
              setBillingAddresses(updated);
            }
            return;
          }
        } catch (error) {
          console.log('Irányítószám nem található');
        }
      }
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

  // Update new address input.
  const handleNewAddressChange = async (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'phoneNumber') {
      v = sanitizePhone(value);
    }

    if (name === 'postalCode') {
      v = value.replace(/\D/g, '').slice(0, 4);
      if (v.length === 4) {
        try {
          const data = await getCityFromPostalCode(v);
          if (data && data.telepules) {
            setNewAddress({ ...newAddress, postalCode: v, city: data.telepules });
            return;
          }
        } catch (error) {
          console.log('Irányítószám nem található');
        }
      }
    }

    setNewAddress({ ...newAddress, [name]: v });
  };

  // Refresh address lists.
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
      setEditingShippingId(null);
      setEditingBillingId(null);
    } catch (err) {
      console.error('Hiba a címek frissítésekor', err);
    }
  };

  // Copy address entry.
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
      <header className="profile-header">
        <h1>Profilom</h1>
        <p>Itt kezelheted személyes adataidat és címeidet</p>
      </header>

      <div className="profile-content">
        <div className="profile-sidebar">
          <ul>
            <li><a href="#profile">Profil adatok</a></li>
            <li><a href="#shipping">Szállítási címek</a></li>
            <li><a href="#billing">Számlázási címek</a></li>
            <li><a href="#orders">Rendeléseim</a></li>
            <li><a href="#service-requests">Szerviz kérések</a></li>
          </ul>
        </div>

        <main className="profile-main">
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
                    backgroundColor: statusMessage.isError ? "#ffe6e6" : "#e6fffa",
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
                            onClick={() => {
                              setEditingShippingId(null);
                              refreshAddresses();
                            }}
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
                            onClick={() => {
                              setEditingBillingId(null);
                              refreshAddresses();
                            }}
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
                      <p><strong>Azonosító: <br /> </strong> {request.repairID}</p>
                      <p><strong>Eszköz:</strong> {request.manufacturerName}</p>
                      <p><strong>Város:</strong> {request.billingCity}</p>
                      <p><strong>Cím:</strong> {request.billingAddress}</p>
                      <p><strong>Telefonszám:</strong> {request.billingPhoneNumber}</p>
                      <p className="service-request-multiline"><strong>Hiba leírása:</strong> {request.problemDescription}</p>
                      <p className="service-request-multiline"><strong>Szerviz leírása:</strong> {request.repairDescription ? request.repairDescription : 'Még nincs szerviz visszajelzés.'}</p>
                      <p><strong>Ár:</strong> {canShowOffer(request) ? `${request.repairPrice.toLocaleString()} Ft` : '0 Ft'}</p>
                      {request.isPriceAccepted === 1 && <p className="text-success"><strong>Árajánlat elfogadva</strong></p>}
                      {request.isPriceAccepted === 2 && <p className="text-danger"><strong>Árajánlat elutasítva</strong></p>}
                    </div>
                    {request.isPriceAccepted === 0 && canShowOffer(request) && (
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

          {showPriceModal && activeRepair && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content profile-modal-content-lg">
                <button className="profile-modal-close" onClick={closePriceModal} aria-label="Bezárás">&times;</button>
                <div className="profile-modal-header">
                  <h3 className="profile-modal-title">Árajánlat</h3>
                </div>
                <div className="profile-modal-body">
                  <p>Árajánlat összege: <strong>{canShowOffer(activeRepair) ? `${activeRepair.repairPrice.toLocaleString()} Ft` : '0 Ft'}</strong></p>
                  <p><strong>Te leírásod:</strong></p>
                  <p className="repair-description-preview">
                    {activeRepair.problemDescription ? activeRepair.problemDescription : 'Nincs megadva.'}
                  </p>
                  <p><strong>Szerviz leírása:</strong></p>
                  <p className="repair-description-preview">
                    {activeRepair.repairDescription ? activeRepair.repairDescription : 'Még nincs szerviz visszajelzés.'}
                  </p>
                </div>
                <div className="profile-modal-actions">
                  <button onClick={handleAcceptOffer} className="profile-modal-btn-confirm" disabled={showEditRequestForm}>Elfogadás</button>
                  <button onClick={handleDeclineOffer} className="btn-cancel" disabled={showEditRequestForm}>Elutasítás</button>
                  {!showEditRequestForm && (
                    <button onClick={toggleEditRequestForm} className="profile-modal btn-copy">
                      Szerviz módosítása
                    </button>
                  )}
                  <button onClick={closePriceModal} className="profile-modal-btn-cancel" disabled={showEditRequestForm}>Vissza</button>
                </div>
                {offerActionMessage.text && (
                  <p className={offerActionMessage.isError ? 'text-danger' : 'text-success'}>
                    <strong>{offerActionMessage.text}</strong>
                  </p>
                )}
                {showEditRequestForm && (
                  <div className="repair-edit-container">
                    <label htmlFor="edit-repair-request"><strong>Írd le, mit szeretnél módosítani:</strong></label>
                    <textarea
                      id="edit-repair-request"
                      className="repair-edit-textarea"
                      rows={4}
                      value={editRequestText}
                      onChange={(e) => setEditRequestText(e.target.value)}
                      placeholder="Pl.: Kérem csak a kijelző cseréjére adjatok ajánlatot..."
                    />
                    <div className="repair-edit-actions">
                      <button onClick={handleSubmitEditRequest} className="profile-modal-btn-confirm">Küldés</button>
                      <button onClick={cancelEditRequest} className="btn-cancel">Mégse</button>
                    </div>
                    {editRequestMessage.text && (
                      <p className={editRequestMessage.isError ? 'text-danger' : 'text-success'}>
                        <strong>{editRequestMessage.text}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {showActionConfirmModal && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                <div className="profile-modal-header">
                  <h3 className="profile-modal-title">Megerősítés</h3>
                </div>
                <div className="profile-modal-body">
                  <p className="profile-modal-text">{getPendingActionConfirmText()}</p>
                </div>
                <div className="profile-modal-actions">
                  <button onClick={handleConfirmPendingAction} className="profile-modal-btn-confirm">Igen</button>
                  <button onClick={() => { setShowActionConfirmModal(false); setPendingAction(null); }} className="profile-modal-btn-cancel">Nem</button>
                </div>
              </div>
            </div>
          )}

          {showEditSuccessModal && (
            <div className="profile-modal-overlay">
              <div className="profile-modal-content">
                <div className="profile-modal-header">
                  <h3 className="profile-modal-title">Sikeres küldés</h3>
                </div>
                <div className="profile-modal-body">
                  <p className="profile-modal-text">A módosítási kérés sikeresen elküldve. Az ablak 5 másodperc múlva bezárul.</p>
                </div>
              </div>
            </div>
          )}

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
                {paymentSuccessMessage && (
                  <div style={{ color: '#28a745', textAlign: 'center', marginBottom: '12px', fontWeight: 'bold', fontSize: '16px' }}>
                    ✓ {paymentSuccessMessage}
                  </div>
                )}
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



