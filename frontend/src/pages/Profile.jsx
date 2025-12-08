import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../components/Navbar';

const Profile = () => {
  // Felhasználó adatok
  const [userData, setUserData] = useState({
    firstName: 'János',
    lastName: 'Kovács',
    email: 'janos.kovacs@example.com',
    phone: '+36 30 123 4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  // Profil adatok mentése
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Itt lenne az API hívás
    console.log('Profil adatok mentve:', userData);
    setEditingProfile(false);
    alert('Profil adatok frissítve!');
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
        <nav className="profile-sidebar">
          <ul>
            <li><a href="#profile" className="active">Profil adatok</a></li>
            <li><a href="#shipping">Szállítási címek</a></li>
            <li><a href="#billing">Számlázási címek</a></li>
            <li><a href="#orders">Rendeléseim</a></li>
            <li><a href="#favorites">Kedvenceim</a></li>
            <li><a href="#settings">Beállítások</a></li>
          </ul>
        </nav>

        {/* Fő tartalom */}
        <main className="profile-main">
          {/* 1. Profil adatok szakasz */}
          <section id="profile" className="profile-section">
            <div className="section-header">
              <h2>Profil adatok</h2>
              {!editingProfile ? (
                <button
                  className="btn-edit"
                  onClick={() => setEditingProfile(true)}
                >
                  Szerkesztés
                </button>
              ) : (
                <button
                  className="btn-cancel"
                  onClick={() => setEditingProfile(false)}
                >
                  Mégse
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Vezetéknév</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Keresztnév</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Email cím</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Telefonszám</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!editingProfile}
                  />
                </div>
              </div>

              {editingProfile && (
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    Mentés
                  </button>
                </div>
              )}
            </form>

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
              <h2>Szlállítási címek</h2>
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