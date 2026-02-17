import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FilterPage.css';
import PhoneCard from '../components/PhoneCard';
import axios from 'axios';

export default function FilterPage() {
  const [filters, setFilters] = useState({
    manufacturerNames: [],
    cpuNames: [],
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
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false);
  const [showCpuDropdown, setShowCpuDropdown] = useState(false);
  
  const navigate = useNavigate();
  const allPhonesURL = "http://localhost:5175/api/filterPage/GetAllPhones";
  const filterApiUrl = "http://localhost:5175/api/filterPage/GetFilteredPhones";
  const filterDatasURL = "http://localhost:5175/api/filterPage/GetDatasForFilters";

  useEffect(() => {
    getPhoneDatas();
    getFilterDatas();
  }, []);

  const getPhoneDatas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(allPhonesURL);
      const data = response.data;
      setPhones(data);
      setFilteredPhones(data);
    } catch (error) {
      console.error("Hiba a telefonadatok betöltésekor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterDatas = async () => {
    try {
      const response = await axios.get(filterDatasURL);
      const data = response.data;
      setFilterData(data);
      console.log("Szűrő adatok:", data);
    } catch (error) {
      console.error("Hiba a szűrő adatok betöltésekor:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleManufacturerChange = (manufacturer) => {
    setFilters(prev => {
      const current = [...prev.manufacturerNames];
      const index = current.indexOf(manufacturer);
      
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(manufacturer);
      }
      
      return {
        ...prev,
        manufacturerNames: current
      };
    });
  };

  const handleCpuChange = (cpu) => {
    setFilters(prev => {
      const current = [...prev.cpuNames];
      const index = current.indexOf(cpu);
      
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(cpu);
      }
      
      return {
        ...prev,
        cpuNames: current
      };
    });
  };

  const handleSliderChange = (field, value, isMin = true) => {
    setFilters(prev => ({
      ...prev,
      [isMin ? `${field}Min` : `${field}Max`]: value
    }));
  };

  const handleSingleSliderChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const parseNumber = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const applyFilters = async () => {
    setIsLoading(true);
    
    const filterRequestData = {
      phoneID: 0,
      manufacturerNames: filters.manufacturerNames,
      phoneReleaseDate: 0,
      cpuNames: filters.cpuNames,
      phoneAntutu: parseNumber(filters.phoneAntutu),
      cpuMaxClockSpeed: parseNumber(filters.cpuMaxClockSpeed),
      cpuCoreNumber: parseNumber(filters.cpuCoreNumber),
      screenSizeMin: parseNumber(filters.screenSizeMin) || (filterData?.minScreenSize || 0),
      screenSizeMax: parseNumber(filters.screenSizeMax) || (filterData?.maxScreenSize || 10),
      screenRefreshRateMin: parseNumber(filters.screenRefreshRateMin) || (filterData?.minScreenRefreshRate || 0),
      screenRefreshRateMax: parseNumber(filters.screenRefreshRateMax) || (filterData?.maxScreenRefreshRate || 240),
      screenMaxBrightness: parseNumber(filters.screenMaxBrightness),
      ramAmount: parseNumber(filters.ramAmount),
      storageAmount: parseNumber(filters.storageAmount),
      batteryCapacity: parseNumber(filters.batteryCapacity),
      phoneWeightMin: parseNumber(filters.phoneWeightMin) || (filterData?.minPhoneWeight || 0),
      phoneWeightMax: parseNumber(filters.phoneWeightMax) || (filterData?.maxPhoneWeight || 300)
    };

    console.log("Küldött adatok:", JSON.stringify(filterRequestData, null, 2));

    try {
      const resp = await axios.post(filterApiUrl,filterRequestData);

      if (resp.status !== 200) {
        const errorText = await resp.data;
        console.error("Backend hiba:", errorText);
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      console.log("Sikeres válasz:", data);
      
      if (Array.isArray(data)) {
        setFilteredPhones(data);
      } else {
        setFilteredPhones([]);
      }
      
    } catch (error) {
      console.error("Hiba a szűrés során:", error);
      localFilter();
    } finally {
      setIsLoading(false);
    }
  };

  const localFilter = () => {
    const filtered = phones.filter(phone => {
      // Gyártó szűrés
      if (filters.manufacturerNames.length > 0 && phone.manufacturerName) {
        if (!filters.manufacturerNames.includes(phone.manufacturerName)) {
          return false;
        }
      }

      // CPU szűrés
      if (filters.cpuNames.length > 0 && phone.cpuName) {
        if (!filters.cpuNames.includes(phone.cpuName)) {
          return false;
        }
      }

      // Egyéb szűrők
      if (filters.phoneAntutu && phone.phoneAntutu) {
        if (phone.phoneAntutu < parseNumber(filters.phoneAntutu)) return false;
      }

      if (filters.cpuMaxClockSpeed && phone.cpuMaxClockSpeed) {
        if (phone.cpuMaxClockSpeed < parseNumber(filters.cpuMaxClockSpeed)) return false;
      }

      if (filters.cpuCoreNumber && phone.cpuCoreNumber) {
        if (phone.cpuCoreNumber < parseNumber(filters.cpuCoreNumber)) return false;
      }

      if (phone.screenSize) {
        if (filters.screenSizeMin && phone.screenSize < parseNumber(filters.screenSizeMin)) return false;
        if (filters.screenSizeMax && phone.screenSize > parseNumber(filters.screenSizeMax)) return false;
      }

      if (phone.screenRefreshRate) {
        if (filters.screenRefreshRateMin && phone.screenRefreshRate < parseNumber(filters.screenRefreshRateMin)) return false;
        if (filters.screenRefreshRateMax && phone.screenRefreshRate > parseNumber(filters.screenRefreshRateMax)) return false;
      }

      if (filters.screenMaxBrightness && phone.screenMaxBrightness) {
        if (phone.screenMaxBrightness < parseNumber(filters.screenMaxBrightness)) return false;
      }

      if (filters.ramAmount && phone.ramAmount) {
        if (phone.ramAmount < parseNumber(filters.ramAmount)) return false;
      }

      if (filters.storageAmount && phone.storageAmount) {
        if (phone.storageAmount < parseNumber(filters.storageAmount)) return false;
      }

      if (filters.batteryCapacity && phone.batteryCapacity) {
        if (phone.batteryCapacity < parseNumber(filters.batteryCapacity)) return false;
      }

      if (phone.phoneWeight) {
        if (filters.phoneWeightMin && phone.phoneWeight < parseNumber(filters.phoneWeightMin)) return false;
        if (filters.phoneWeightMax && phone.phoneWeight > parseNumber(filters.phoneWeightMax)) return false;
      }

      return true;
    });

    setFilteredPhones(filtered);
  };

  const resetFilters = () => {
    setFilters({
      manufacturerNames: [],
      cpuNames: [],
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
    if (phone && phone.phoneID) {
      localStorage.setItem("selectedPhone", phone.phoneID);
      navigate(`/telefonoldal/${phone.phoneID}`);
    }
  };

  const handleAddToCart = (phone, e) => {
    e.stopPropagation();
    if (!phone || !phone.phoneID) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    cart[phone.phoneID] = (cart[phone.phoneID] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${phone.phoneName} hozzáadva a kosárhoz!`);
  };

  const handleAddToCompare = (phone, e) => {
    e.stopPropagation();
    if (!phone || !phone.phoneID) return;

    let comparePhones = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    if (!comparePhones.includes(phone.phoneID)) {
      if (comparePhones.length >= 4) {
        alert("Maximum 4 telefont lehet összehasonlítani!");
        return;
      }
      comparePhones.push(phone.phoneID);
      localStorage.setItem("comparePhones", JSON.stringify(comparePhones));
      alert(`${phone.phoneName} hozzáadva az összehasonlításhoz!`);
    }
  };

  const renderCheckboxDropdown = (title, items, selectedItems, onChange, show, setShow) => {
    return (
      <div className="filter-section mt-3">
        <h5>{title}</h5>
        <div className="dropdown">
          <button
            className="form-control text-start dropdown-toggle"
            type="button"
            onClick={() => setShow(!show)}
            disabled={isLoading}
          >
            {selectedItems.length > 0 
              ? `${selectedItems.length} kiválasztva` 
              : `Válassz ${title.toLowerCase()}...`}
          </button>
          {show && (
            <div 
              className="dropdown-menu show p-3" 
              style={{width: '100%', maxHeight: '300px', overflowY: 'auto'}}
            >
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <div className="form-check" key={index}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`${title}-${index}`}
                      checked={selectedItems.includes(item)}
                      onChange={() => onChange(item)}
                    />
                    <label className="form-check-label" htmlFor={`${title}-${index}`}>
                      {item}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-muted">Nincsenek adatok</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRangeSlider = (title, field, min, max, step = 1) => {
    if (!filterData || min === undefined || max === undefined) return null;
    
    return (
      <div className="filter-section mt-3">
        <h5>{title}</h5>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <input
              type="number"
              id={`${field}Min`}
              className="form-control"
              placeholder="Min"
              value={filters[`${field}Min`] || min}
              onChange={handleFilterChange}
              disabled={isLoading}
              min={min}
              max={max}
              step={step}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              id={`${field}Max`}
              className="form-control"
              placeholder="Max"
              value={filters[`${field}Max`] || max}
              onChange={handleFilterChange}
              disabled={isLoading}
              min={min}
              max={max}
              step={step}
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Min: {filters[`${field}Min`] || min}</label>
            <input
              type="range"
              className="form-range"
              min={min}
              max={max}
              step={step}
              value={filters[`${field}Min`] || min}
              onChange={(e) => handleSliderChange(field, e.target.value, true)}
              disabled={isLoading}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Max: {filters[`${field}Max`] || max}</label>
            <input
              type="range"
              className="form-range"
              min={min}
              max={max}
              step={step}
              value={filters[`${field}Max`] || max}
              onChange={(e) => handleSliderChange(field, e.target.value, false)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSingleSlider = (title, field, min, max, step = 1) => {
    if (!filterData || min === undefined || max === undefined) return null;
    
    return (
      <div className="filter-section mt-3">
        <h5>{title}</h5>
        <div className="mb-2">
          <input
            type="number"
            id={field}
            className="form-control"
            placeholder={`Minimum ${title.toLowerCase()}`}
            value={filters[field] || min}
            onChange={handleFilterChange}
            disabled={isLoading}
            min={min}
            max={max}
            step={step}
          />
        </div>
        <div>
          <label className="form-label">Érték: {filters[field] || min}</label>
          <input
            type="range"
            className="form-range"
            min={min}
            max={max}
            step={step}
            value={filters[field] || min}
            onChange={(e) => handleSingleSliderChange(field, e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  };

  const displayPhoneCards = () => {
    if (isLoading) {
      return (
        <div className="col-12 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
          <p>Szűrés folyamatban...</p>
        </div>
      );
    }

    if (!filteredPhones || filteredPhones.length === 0) {
      return (
        <div className="col-12 text-center">
          <h3>Nincs találat a megadott szűrési feltételek alapján</h3>
          <p>Próbálj meg más szűrőket használni</p>
          <button className="btn btn-primary mt-3" onClick={resetFilters}>
            Szűrők visszaállítása
          </button>
        </div>
      );
    }

    return filteredPhones.map((phone) => (
      
        <PhoneCard
          phoneId={phone.phoneID}
          phoneName={phone.phoneName}
          phoneInStore={phone.phoneInStore}
          phonePrice={phone.phonePrice}
        />
    ));
  };

  return (
    <div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-3">
            <div id="filterPanel">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Szűrők</h3>
                <div>
                  <button 
                    className="btn btn-success btn-sm me-2" 
                    onClick={applyFilters}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    ) : (
                      <i className="bi-check-lg"></i>
                    )}
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={resetFilters}
                    disabled={isLoading}
                  >
                    <i className="bi-trash"></i>
                  </button>
                </div>
              </div>
              
              <hr />
              
              {renderCheckboxDropdown(
                "Gyártó",
                filterData?.manufacturerNames || [],
                filters.manufacturerNames,
                handleManufacturerChange,
                showManufacturerDropdown,
                setShowManufacturerDropdown
              )}

              {renderCheckboxDropdown(
                "Processzor",
                filterData?.cpuNames || [],
                filters.cpuNames,
                handleCpuChange,
                showCpuDropdown,
                setShowCpuDropdown
              )}

              {renderSingleSlider(
                "Antutu pontszám",
                "phoneAntutu",
                filterData?.minAntutu || 0,
                filterData?.maxAntutu || 1000000,
                1000
              )}

              {renderSingleSlider(
                "Processzor órajel (GHz)",
                "cpuMaxClockSpeed",
                filterData?.minCpuMaxClockSpeed || 0,
                filterData?.maxCpuMaxClockSpeed || 5,
                0.1
              )}

              {renderSingleSlider(
                "Processzor magok száma",
                "cpuCoreNumber",
                filterData?.minCpuCoreNumber || 0,
                filterData?.maxCpuCoreNumber || 16,
                1
              )}

              {renderRangeSlider(
                "Képernyő méret (hüvelyk)",
                "screenSize",
                filterData?.minScreenSize || 4,
                filterData?.maxScreenSize || 10,
                0.1
              )}

              {renderRangeSlider(
                "Képernyő frissítési gyakoriság (Hz)",
                "screenRefreshRate",
                filterData?.minScreenRefreshRate || 30,
                filterData?.maxScreenRefreshRate || 240,
                10
              )}

              {renderSingleSlider(
                "Képernyő fényerő (nits)",
                "screenMaxBrightness",
                filterData?.minScreenMaxBrightness || 0,
                filterData?.maxScreenMaxBrightness || 2500,
                50
              )}

              {renderSingleSlider(
                "RAM (GB)",
                "ramAmount",
                filterData?.minRamAmount || 0,
                filterData?.maxRamAmount || 32,
                1
              )}

              {renderSingleSlider(
                "Tárhely (GB)",
                "storageAmount",
                filterData?.minStorageAmount || 0,
                filterData?.maxStorageAmount || 1024,
                16
              )}

              {renderSingleSlider(
                "Akkumulátor kapacitás (mAh)",
                "batteryCapacity",
                filterData?.minBatteryCapacity || 0,
                filterData?.maxBatteryCapacity || 10000,
                100
              )}

              {renderRangeSlider(
                "Súly (g)",
                "phoneWeight",
                filterData?.minPhoneWeight || 0,
                filterData?.maxPhoneWeight || 300,
                10
              )}

              <hr />
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={applyFilters}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Szűrés...
                    </>
                  ) : (
                    <>
                      <i className="bi-check-lg me-2"></i>
                      Szűrés alkalmazása
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={resetFilters}
                  disabled={isLoading}
                >
                  <i className="bi-trash me-2"></i>
                  Szűrők törlése
                </button>
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Találatok: {filteredPhones.length} termék</h4>
              <div className="text-muted">
                {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
              </div>
            </div>
            
            <div id="contentRowFilter" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {displayPhoneCards()}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}