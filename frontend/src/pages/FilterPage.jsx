import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FilterPage.css';

export default function FilterPage() {
  const [filters, setFilters] = useState({
    manufacturerName: '',
    cpuName: '',
    phoneAntutu: '',
    cpuMaxClockSpeed: '',
    cpuCoreNumber: '',
    screenSizeMin: '',
    screenSizeMax: '',
    screenRefreshRateMin: '',
    screenRefreshRateMax: '',
    screenMaxBrightness: '',
    ramAmount: '',
    storageAmount: '',
    batteryCapacity: '',
    phoneWeightMin: '',
    phoneWeightMax: ''
  });

  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const allPhonesURL = "http://localhost:5175/api/filterPage/GetAllPhones";
  const filterApiUrl = "http://localhost:5175/api/filterPage/GetFilteredPhones";

  useEffect(() => {
    getPhoneDatas();
  }, []);

  const getPhoneDatas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(allPhonesURL);
      const data = await response.json();
      setPhones(data);
      setFilteredPhones(data);
    } catch (error) {
      console.error("Hiba a telefonadatok betöltésekor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const applyFilters = async () => {
    const filterData = {
      phoneID: 0,
      manufacturerName: filters.manufacturerName || "",
      phoneName: "",
      phoneReleaseDate: null,
      cpuName: filters.cpuName || "",
      phoneAntutu: parseInt(filters.phoneAntutu) || 0,
      cpuMaxClockSpeed: parseFloat(filters.cpuMaxClockSpeed) || 0,
      cpuCoreNumber: parseInt(filters.cpuCoreNumber) || 0,
      screenSizeMin: parseFloat(filters.screenSizeMin) || 0,
      screenSizeMax: parseFloat(filters.screenSizeMax) || 0,
      screenRefreshRateMin: parseInt(filters.screenRefreshRateMin) || 0,
      screenRefreshRateMax: parseInt(filters.screenRefreshRateMax) || 0,
      screenMaxBrightness: parseInt(filters.screenMaxBrightness) || 0,
      connectionMaxWifi: 0,
      connectionMaxBluetooth: 0,
      connectionMaxMobileNetwork: 0,
      connectionDualSim: "",
      connectionESim: "",
      connectionNfc: "",
      ramAmount: parseInt(filters.ramAmount) || 0,
      storageAmount: parseInt(filters.storageAmount) || 0,
      batteryCapacity: parseInt(filters.batteryCapacity) || 0,
      batteryMaxChargingWired: 0,
      batteryMaxChargingWireless: 0,
      phoneWeightMin: parseInt(filters.phoneWeightMin) || 0,
      phoneWeightMax: parseInt(filters.phoneWeightMax) || 0,
      waterproofType: ""
    };

    try {
      const resp = await fetch(filterApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterData)
      });

      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

      const text = await resp.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch (e) {
        const arrStart = text.indexOf("[");
        const objStart = text.indexOf("{");
        let start = -1, end = -1;

        if (arrStart !== -1) {
          start = arrStart;
          end = text.lastIndexOf("]");
        } else if (objStart !== -1) {
          start = objStart;
          end = text.lastIndexOf("}");
        }

        if (start !== -1 && end !== -1 && end > start) {
          const jsonPart = text.substring(start, end + 1);
          try {
            data = JSON.parse(jsonPart);
          } catch (e2) {
            console.error("Nem sikerült parse-olni a kinyert JSON részt:", e2);
            data = [];
          }
        } else {
          data = [];
        }
      }

      let result = [];
      if (Array.isArray(data)) {
        result = data;
      } else if (data && Array.isArray(data.result)) {
        result = data.result;
      } else if (data && Array.isArray(data.phones)) {
        result = data.phones;
      } else {
        result = data ? [data] : [];
      }

      setFilteredPhones(result);
    } catch (error) {
      console.error("Hiba a backend szűrés során:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      manufacturerName: '',
      cpuName: '',
      phoneAntutu: '',
      cpuMaxClockSpeed: '',
      cpuCoreNumber: '',
      screenSizeMin: '',
      screenSizeMax: '',
      screenRefreshRateMin: '',
      screenRefreshRateMax: '',
      screenMaxBrightness: '',
      ramAmount: '',
      storageAmount: '',
      batteryCapacity: '',
      phoneWeightMin: '',
      phoneWeightMax: ''
    });
    setFilteredPhones(phones);
  };

  const handlePhoneClick = (phone) => {
    localStorage.setItem("selectedPhone", phone.phoneID);
    navigate(`/telefonoldal/${phone.phoneID}`);
  };

  const handleAddToCart = (phone, e) => {
    e.stopPropagation();

    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[phone.phoneID] = (cart[phone.phoneID] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Animation would be handled by a separate animation component
  };

  const handleAddToCompare = (phone, e) => {
    e.stopPropagation();

    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    if (!comparePhones.includes(phone.phoneID)) {
      comparePhones.push(phone.phoneID);
      localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
    }
  };

  const displayPhoneCards = () => {
    if (isLoading) {
      return (
        <div className="col-12 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
          <p>Telefonok betöltése...</p>
        </div>
      );
    }

    if (!filteredPhones || filteredPhones.length === 0) {
      return (
        <div className="col-12 text-center">
          <h3>Nincs találat a megadott szűrési feltételek alapján</h3>
          <p>Próbálj meg más szűrőket használni</p>
        </div>
      );
    }

    return filteredPhones.map((phone) => (
      <div
        key={phone.phoneID}
        className="phoneRow"
        onClick={() => handlePhoneClick(phone)}
        style={{ cursor: 'pointer' }}
      >
        <div className="phoneImage">
          <img
            src={phone.imageUrl || '/Images/image 3.png'}
            alt={phone.phoneName}
            loading="lazy"
          />
          <div className={`stock-bubble ${phone.phoneInStore === "van" ? "phonestockTrue" : "phonestockFalse"}`}>
            {phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron"}
          </div>
          <div className="price-bubble">{phone.phonePrice} Ft</div>
        </div>
        <div className="phoneDetails">
          <h3 style={{ margin: 0, fontSize: "1.2em" }}>{phone.phoneName}</h3>
        </div>
        <div className="cardButtons">
          <div
            className="button"
            onClick={(e) => handleAddToCompare(phone, e)}
            title="Összehasonlításba"
          >
            <img
              src="/Images/compare-removebg-preview 1.png"
              alt="Összehasonlítás"
              loading="lazy"
            />
          </div>
          <div
            className="button"
            onClick={(e) => handleAddToCart(phone, e)}
            title="Kosárba"
          >
            <img
              src="/Images/cart-removebg-preview 1.png"
              alt="Kosár"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <div className="row">
          <div className="col-3">
            <div id="filterPanel">

              <h3 className="mb-3">Szűrők</h3>
              <hr />
              <button className="filter-button " onClick={applyFilters}>
                <i className="bi-check-lg"></i>
              </button>
              <button className="filter-button filter-reset" onClick={resetFilters}>
                <i className="bi-trash"></i>
              </button>
              <hr />
              <div className="filter-section">
                <h4>Gyártó</h4>
                <input
                  type="text"
                  id="manufacturerName"
                  className="filter-input"
                  placeholder="Gyártó neve"
                  value={filters.manufacturerName}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Processzor</h4>
                <input
                  type="text"
                  id="cpuName"
                  className="filter-input"
                  placeholder="Processzor neve"
                  value={filters.cpuName}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Antutu pontszám</h4>
                <input
                  type="number"
                  id="phoneAntutu"
                  className="filter-input"
                  placeholder="Minimum pontszám"
                  value={filters.phoneAntutu}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Processzor órajel (GHz)</h4>
                <input
                  type="number"
                  step="0.1"
                  id="cpuMaxClockSpeed"
                  className="filter-input"
                  placeholder="Minimum órajel"
                  value={filters.cpuMaxClockSpeed}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Processzor magok száma</h4>
                <input
                  type="number"
                  id="cpuCoreNumber"
                  className="filter-input"
                  placeholder="Minimum magok száma"
                  value={filters.cpuCoreNumber}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Képernyő méret (hüvelyk)</h4>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      step="0.1"
                      id="screenSizeMin"
                      className="filter-input"
                      placeholder="Min"
                      value={filters.screenSizeMin}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      step="0.1"
                      id="screenSizeMax"
                      className="filter-input"
                      placeholder="Max"
                      value={filters.screenSizeMax}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h4>Képernyő frissítési gyakoriság (Hz)</h4>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      id="screenRefreshRateMin"
                      className="filter-input"
                      placeholder="Min"
                      value={filters.screenRefreshRateMin}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      id="screenRefreshRateMax"
                      className="filter-input"
                      placeholder="Max"
                      value={filters.screenRefreshRateMax}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h4>Képernyő fényerő (nits)</h4>
                <input
                  type="number"
                  id="screenMaxBrightness"
                  className="filter-input"
                  placeholder="Minimum fényerő"
                  value={filters.screenMaxBrightness}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>RAM (GB)</h4>
                <input
                  type="number"
                  id="ramAmount"
                  className="filter-input"
                  placeholder="Minimum RAM"
                  value={filters.ramAmount}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Tárhely (GB)</h4>
                <input
                  type="number"
                  id="storageAmount"
                  className="filter-input"
                  placeholder="Minimum tárhely"
                  value={filters.storageAmount}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Akkumulátor kapacitás (mAh)</h4>
                <input
                  type="number"
                  id="batteryCapacity"
                  className="filter-input"
                  placeholder="Minimum kapacitás"
                  value={filters.batteryCapacity}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-section">
                <h4>Súly (g)</h4>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      id="phoneWeightMin"
                      className="filter-input"
                      placeholder="Min"
                      value={filters.phoneWeightMin}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      id="phoneWeightMax"
                      className="filter-input"
                      placeholder="Max"
                      value={filters.phoneWeightMax}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <hr />
              <button className="filter-button " onClick={applyFilters}>
                <i className="bi-check-lg"></i>
              </button>
              <button className="filter-button filter-reset" onClick={resetFilters}>
                <i className="bi-trash"></i>
              </button>
              <hr />

            </div>
          </div>

          <div className="col-9">
            <div id="contentRow">
              {displayPhoneCards()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}