import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../components/Navbar';



//fetch('http://localhost:5292/phonePage/2').then(response => response.json()).then(data => console.log(data)) //ID-T KISZEDNI A / MÖGÜL HA VAN


const Profile = () => {
  // Felhasználó adatok

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userData, setUserData] = useState({ userFullName: '', userEmail: '' });

  useEffect(() => {
    const savedName = localStorage.getItem('fullname');
    const savedEmail = localStorage.getItem('email');
    setUserData({ userFullName: savedName, userEmail: savedEmail });
  }, []);



  const [phones, setPhones] = useState([
    {
      phoneName: 'Samsung Galaxy S23',
      amount: 1,
      price: 349999,
      status: 'feldolgozás alatt',
      ramStorage: '8/256',
      color: 'fekete'
    },
    {
      phoneName: 'iPhone 14 Pro',
      amount: 2,
      price: 589999,
      status: 'kiszállítva',
      ramStorage: '6/256',
      color: 'lila'
    }
  ]);
  const [serviceRequests, setServiceRequests] = useState([
    {
      name: "Kovács János",
      useremail: "kovacs.janos@example.com",
      phonenumber: "+36 30 123 4567",
      zippostalcosde: "1117",
      city: "Budapest",
      street: "Fehérvári út",
      housenumber: "45",
      phonemanufacturer: "Samsung Galaxy S21",
      whatswrong: "kijelző",
      inspection: true,
      status: "feldolgozás alatt",
      description: "A kijelző megrepedt, az érintés csak részben működik."
    },
    {
      name: "Nagy Eszter",
      useremail: "nagy.eszter@example.com",
      phonenumber: "+36 20 987 6543",
      zippostalcosde: "4025",
      city: "Debrecen",
      street: "Piac utca",
      housenumber: "12",
      phonemanufacturer: "iPhone 12",
      whatswrong: "akkumulátor",
      inspection: false,
      status: "átvételre kész",
      description: "Az akkumulátor gyorsan merül, egy napot sem bír ki."
    },
    {
      name: "Szabó Péter",
      useremail: "szabo.peter@example.com",
      phonenumber: "+36 70 555 1122",
      zippostalcosde: "7621",
      city: "Pécs",
      street: "Király utca",
      housenumber: "8",
      phonemanufacturer: "Xiaomi Redmi Note 11",
      whatswrong: "töltőcsatlakozó",
      inspection: true,
      status: "kész",
      description: "A telefon csak bizonyos szögben tölt, a kábel lötyög."
    }
  ]);

  // Szállítási címek
  const [shippingAddresses, setShippingAddresses] = useState([
    {
      id: 1,
      name: 'Otthoni cím',
      country: 'Magyarország',
      zipCode: '1052',
      city: 'Budapest',
      street: 'Kossuth Lajos utca 12.',
      isPrimary: true
    },
    {
      id: 2,
      name: 'Munkahelyi cím',
      country: 'Magyarország',
      zipCode: '1077',
      city: 'Budapest',
      street: 'Rákóczi út 45.',
      isPrimary: false
    },
    {
      id: 3,
      name: 'Szülői ház',
      country: 'Magyarország',
      zipCode: '4024',
      city: 'Debrecen',
      street: 'Petőfi Sándor utca 8.',
      isPrimary: false
    }
  ]);

  // Számlázási címek
  const [billingAddresses, setBillingAddresses] = useState([
    {
      id: 1,
      name: 'Fő számlázási cím',
      country: 'Magyarország',
      zipCode: '1052',
      city: 'Budapest',
      street: 'Kossuth Lajos utca 12.',
      taxNumber: '12345678-1-42',
      isPrimary: true
    },
    {
      id: 2,
      name: 'Céges számlázás',
      country: 'Magyarország',
      zipCode: '1132',
      city: 'Budapest',
      street: 'Váci út 67.',
      taxNumber: '87654321-2-31',
      isPrimary: false
    }
  ]);

  // Új cím form
  const [newAddress, setNewAddress] = useState({
    type: 'shipping',
    name: '',
    country: 'Magyarország',
    zipCode: '',
    city: '',
    street: '',
    taxNumber: ''
  });

  // Módosítás státuszok
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [editingBillingId, setEditingBillingId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

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
      const response = await fetch(`http://localhost:5175/api/Profile/UpdateUser/${userData.userEmail.replace('@', '%40')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Mentés Local Storage-ba is
        localStorage.setItem('fullName', userData.userFullName);
        localStorage.setItem('email', userData.userEmail);

        setEditingProfile(false);
        setShowConfirmModal(false);
        alert('Sikeres mentés!');
      }
    } catch (error) {
      console.error('Hiba a mentés során:', error);
    }
  };

  // Jelszó változtatás
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (userData.newPassword !== userData.confirmPassword) {
      alert('A két jelszó nem egyezik!');
      return;
    }
    console.log('Jelszó változtatás:', userData.newPassword);
    setUserData({ ...userData, currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Jelszó sikeresen megváltoztatva!');
  };

  // Szállítási cím mentése
  const handleShippingSubmit = (e, id) => {
    e.preventDefault();
    // Itt lenne az API hívás
    setEditingShippingId(null);
    alert('Szállítási cím frissítve!');
  };

  // Számlázási cím mentése
  const handleBillingSubmit = (e, id) => {
    e.preventDefault();
    // Itt lenne az API hívás
    setEditingBillingId(null);
    alert('Számlázási cím frissítve!');
  };

  // Új cím hozzáadása
  const handleAddNewAddress = (e) => {
    e.preventDefault();

    if (newAddress.type === 'shipping' && shippingAddresses.length >= 3) {
      alert('Maximum 3 szállítási címet adhatsz meg!');
      return;
    }

    if (newAddress.type === 'billing' && billingAddresses.length >= 3) {
      alert('Maximum 3 számlázási címet adhatsz meg!');
      return;
    }

    const newId = Date.now();
    const addressToAdd = {
      id: newId,
      name: newAddress.name,
      country: newAddress.country,
      zipCode: newAddress.zipCode,
      city: newAddress.city,
      street: newAddress.street,
      isPrimary: false
    };

    if (newAddress.type === 'shipping') {
      setShippingAddresses([...shippingAddresses, addressToAdd]);
    } else {
      addressToAdd.taxNumber = newAddress.taxNumber;
      setBillingAddresses([...billingAddresses, addressToAdd]);
    }

    // Form reset
    setNewAddress({
      type: 'shipping',
      name: '',
      country: 'Magyarország',
      zipCode: '',
      city: '',
      street: '',
      taxNumber: ''
    });
    setShowNewAddressForm(false);
    alert('Új cím sikeresen hozzáadva!');
  };

  // Elsődleges cím beállítása
  const setPrimaryAddress = (type, id) => {
    if (type === 'shipping') {
      const updated = shippingAddresses.map(addr => ({
        ...addr,
        isPrimary: addr.id === id
      }));
      setShippingAddresses(updated);
    } else {
      const updated = billingAddresses.map(addr => ({
        ...addr,
        isPrimary: addr.id === id
      }));
      setBillingAddresses(updated);
    }
    alert('Elsődleges cím beállítva!');
  };

  // Cím törlése
  const deleteAddress = (type, id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a címet?')) {
      if (type === 'shipping') {
        const updated = shippingAddresses.filter(addr => addr.id !== id);
        setShippingAddresses(updated);
      } else {
        const updated = billingAddresses.filter(addr => addr.id !== id);
        setBillingAddresses(updated);
      }
      alert('Cím sikeresen törölve!');
    }
  };

  // Input változások kezelése
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAddressInputChange = (e, type, id, field) => {
    const { value } = e.target;

    if (type === 'shipping') {
      const updated = shippingAddresses.map(addr =>
        addr.id === id ? { ...addr, [field]: value } : addr
      );
      setShippingAddresses(updated);
    } else {
      const updated = billingAddresses.map(addr =>
        addr.id === id ? { ...addr, [field]: value } : addr
      );
      setBillingAddresses(updated);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  return (

    <div className="profile-container">
      <Navbar />
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
                  <input
                    type="text"
                    value={userData.userFullName}
                    onChange={(e) => setUserData({ ...userData, userFullName: e.target.value })}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Email cím</label>
                  <input
                    type="email"
                    value={userData.userEmail}
                    onChange={(e) => setUserData({ ...userData, userEmail: e.target.value })}
                    disabled={!editingProfile}
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


            {/* Jelszó változtatás */}
            <div className="password-section">
              <h3>Jelszó változtatás</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Jelenlegi jelszó</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Új jelszó</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Új jelszó megerősítése</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
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
              <h2>Szállítási címek</h2>
              {shippingAddresses.length < 3 && (
                <button
                  className="btn-add"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  + Új cím
                </button>
              )}
            </div>

            <div className="addresses-grid">
              {shippingAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`address-card ${address.isPrimary ? 'primary' : ''}`}
                >
                  <div className="address-header">
                    <h3>{address.name}</h3>
                    {address.isPrimary && (
                      <span className="badge-primary">Elsődleges</span>
                    )}
                  </div>

                  {editingShippingId === address.id ? (
                    <form onSubmit={(e) => handleShippingSubmit(e, address.id)}>
                      <div className="form-group">
                        <label>Cím megnevezése</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => handleAddressInputChange(e, 'shipping', address.id, 'name')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Irányítószám</label>
                        <input
                          type="text"
                          value={address.zipCode}
                          onChange={(e) => handleAddressInputChange(e, 'shipping', address.id, 'zipCode')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Város</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => handleAddressInputChange(e, 'shipping', address.id, 'city')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Utca, házszám</label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) => handleAddressInputChange(e, 'shipping', address.id, 'street')}
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
                        <p><strong>Ország:</strong> {address.country}</p>
                        <p><strong>Irányítószám:</strong> {address.zipCode}</p>
                        <p><strong>Város:</strong> {address.city}</p>
                        <p><strong>Cím:</strong> {address.street}</p>
                      </div>
                      <div className="address-actions">
                        {!address.isPrimary && (
                          <button
                            className="btn-set-primary"
                            onClick={() => setPrimaryAddress('shipping', address.id)}
                          >
                            Elsődlegessé teszem
                          </button>
                        )}
                        <button
                          className="btn-edit"
                          onClick={() => setEditingShippingId(address.id)}
                        >
                          Szerkesztés
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteAddress('shipping', address.id)}
                        >
                          Törlés
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3. Számlázási címek szakasz */}
          <section id="billing" className="profile-section">
            <div className="section-header">
              <h2>Számlázási címek</h2>
              {billingAddresses.length < 3 && (
                <button
                  className="btn-add"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  + Új cím
                </button>
              )}
            </div>

            <div className="addresses-grid">
              {billingAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`address-card ${address.isPrimary ? 'primary' : ''}`}
                >
                  <div className="address-header">
                    <h3>{address.name}</h3>
                    {address.isPrimary && (
                      <span className="badge-primary">Elsődleges</span>
                    )}
                  </div>

                  {editingBillingId === address.id ? (
                    <form onSubmit={(e) => handleBillingSubmit(e, address.id)}>
                      <div className="form-group">
                        <label>Cím megnevezése</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => handleAddressInputChange(e, 'billing', address.id, 'name')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Irányítószám</label>
                        <input
                          type="text"
                          value={address.zipCode}
                          onChange={(e) => handleAddressInputChange(e, 'billing', address.id, 'zipCode')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Város</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => handleAddressInputChange(e, 'billing', address.id, 'city')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Utca, házszám</label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) => handleAddressInputChange(e, 'billing', address.id, 'street')}
                        />
                      </div>
                      <div className="form-group">
                        <label>Adószám</label>
                        <input
                          type="text"
                          value={address.taxNumber}
                          onChange={(e) => handleAddressInputChange(e, 'billing', address.id, 'taxNumber')}
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
                        <p><strong>Ország:</strong> {address.country}</p>
                        <p><strong>Irányítószám:</strong> {address.zipCode}</p>
                        <p><strong>Város:</strong> {address.city}</p>
                        <p><strong>Cím:</strong> {address.street}</p>
                        <p><strong>Adószám:</strong> {address.taxNumber}</p>
                      </div>
                      <div className="address-actions">
                        {!address.isPrimary && (
                          <button
                            className="btn-set-primary"
                            onClick={() => setPrimaryAddress('billing', address.id)}
                          >
                            Elsődlegessé teszem
                          </button>
                        )}
                        <button
                          className="btn-edit"
                          onClick={() => setEditingBillingId(address.id)}
                        >
                          Szerkesztés
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteAddress('billing', address.id)}
                        >
                          Törlés
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Megrendelések */}
          <section id="orders" className="profile-section">
            <div className="section-header">
              <h2>Megrendelések</h2>
            </div>

            <div className="orders-grid">
              {phones.map((phone, index) => (
                <div key={index} className="order-card">
                  <div className="order-header">
                    <h3>{phone.phoneName}</h3>
                    <span className={`order-status status-${phone.status.replace(/\s/g, '-')}`}>
                      {phone.status}
                    </span>
                  </div>

                  <div className="order-details">
                    <p><strong>Darabszám:</strong> {phone.amount} db</p>
                    <p><strong>Ár:</strong> {phone.price.toLocaleString()} Ft</p>
                    <p><strong>Memória:</strong> {phone.ramStorage}</p>
                    <p><strong>Szín:</strong> {phone.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>



          {/*Szerviz kérések */}
          <section id="service-requests" className="profile-section">
            <div className="section-header ">
              <h2>Szervizeltetések</h2>
            </div>
            <div>
              {serviceRequests.map((request, index) => (
                <div key={index} className="service-request-card">
                  <div className="service-request-header">
                    <h3>{request.phonemanufacturer}</h3>
                    <span className={`service-request-status status-${request.status.replace(/\s/g, '-')}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="service-request-details">
                    <p><strong>Felhasználó:</strong> {request.name}</p>
                    <p><strong>Email:</strong> {request.useremail}</p>
                    <p><strong>Telefon:</strong> {request.phonenumber}</p>
                    <p><strong>Cím:</strong> {request.zippostalcosde}, {request.city}, {request.street} {request.housenumber}</p>
                    <p><strong>Hiba:</strong> {request.whatswrong}</p>
                    <p><strong>Vizsgálat:</strong> {request.inspection ? "igen" : "nem"}</p>
                    <p><strong>Leírás:</strong> {request.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>


        </main>
      </div>

      {/* Új cím hozzáadása modal */}
      {showNewAddressForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Új cím hozzáadása</h2>
              <button
                className="modal-close"
                onClick={() => setShowNewAddressForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddNewAddress}>
              <div className="form-group">
                <label>Cím típusa</label>
                <select
                  name="type"
                  value={newAddress.type}
                  onChange={handleNewAddressChange}
                >
                  <option value="shipping">Szállítási cím</option>
                  <option value="billing">Számlázási cím</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cím megnevezése (pl: Otthoni cím, Munkahelyi cím)</label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleNewAddressChange}
                  placeholder="Cím megnevezése"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ország</label>
                <select
                  name="country"
                  value={newAddress.country}
                  onChange={handleNewAddressChange}
                >
                  <option value="Magyarország">Magyarország</option>
                  <option value="Románia">Románia</option>
                  <option value="Szlovákia">Szlovákia</option>
                  <option value="Ausztria">Ausztria</option>
                </select>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Irányítószám</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={newAddress.zipCode}
                    onChange={handleNewAddressChange}
                    placeholder="1052"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Város</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder="Budapest"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Utca, házszám</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                  placeholder="Kossuth Lajos utca 12."
                  required
                />
              </div>

              {newAddress.type === 'billing' && (
                <div className="form-group">
                  <label>Adószám (opcionális)</label>
                  <input
                    type="text"
                    name="taxNumber"
                    value={newAddress.taxNumber}
                    onChange={handleNewAddressChange}
                    placeholder="12345678-1-42"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Cím hozzáadása
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowNewAddressForm(false)}
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;