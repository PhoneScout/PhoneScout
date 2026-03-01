import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Compare.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Compare() {
  const navigate = useNavigate();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(new Set());
  const [openGroups, setOpenGroups] = useState({});
  const scrollContainerRef = useRef(null);

  // Modal állapotok
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allPhones, setAllPhones] = useState([]);
  const [loadingAllPhones, setLoadingAllPhones] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [phoneImages, setPhoneImages] = useState({});
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantPhone, setVariantPhone] = useState(null);
  const [variantLoading, setVariantLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);
  const [selectedPairIdx, setSelectedPairIdx] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [colorError, setColorError] = useState(false);
  const [pairError, setPairError] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Csoportosított tulajdonságok
  const groupedProps = [
    {
      group: "Általános",
      props: [
        { label: "Ár", key: "phonePrice", format: v => v ? `${v} Ft` : "-" },
        { label: "Készleten", key: "phoneInStore" }
      ]
    },
    {
      group: "Kijelző",
      props: [
        {
          label: "Felbontás",
          key: "phoneResolution",
          format: (_, p) => (p.phoneResolutionWidth && p.phoneResolutionHeight) 
            ? `${p.phoneResolutionWidth} x ${p.phoneResolutionHeight} px` : "-"
        },
        { label: "Kijelző méret", key: "screenSize", format: v => v ? `${v.toFixed(2)}"` : "-" },
        { label: "Kijelző max fényerő", key: "screenMaxBrightness", format: v => v ? `${v} nit` : "-" },
        { label: "Kijelző élesség", key: "screenSharpness", format: v => v ? `${v} ppi` : "-" },
        { label: "Kijelző típusa", key: "screenType" }
      ]
    },
    {
      group: "CPU",
      props: [
        { label: "CPU név", key: "cpuName" },
        { label: "Antutu pontszám", key: "phoneAntutu", format: v => v ? `${v} pont` : "-" },
        { label: "CPU max órajel", key: "cpuMaxClockSpeed", format: v => v ? `${v} MHz` : "-" },
        { label: "CPU magok száma", key: "cpuCoreNumber", format: v => v ? `${v} mag` : "-" },
        { label: "Gyártástechnológia", key: "cpuManufacturingTechnology", format: v => v ? `${v} nm` : "-" }
      ]
    },
    {
      group: "RAM",
      props: [
        { label: "Min. RAM", key: "ramAmount", format: v => v ? `${v} GB` : "-" },
        { label: "RAM sebesség", key: "ramSpeed" }
      ]
    },
    {
      group: "Tárhely",
      props: [
        { label: "Min. tárhely", key: "storageAmount", format: v => v ? `${v} GB` : "-" },
        { label: "Tárhely sebesség", key: "storageSpeed" }
      ]
    },
    {
      group: "Akkumulátor",
      props: [
        { label: "Akkumulátor kapacitás", key: "batteryCapacity", format: v => v ? `${v} mAh` : "-" },
        { label: "Max töltés (vezetékes)", key: "batteryMaxChargingWired", format: v => v ? `${v} W` : "-" },
        { label: "Max töltés (vezetéknélküli)", key: "batteryMaxChargingWireless", format: v => v ? `${v} W` : "-" }
      ]
    },
    {
      group: "Szenzorok",
      props: [
        { label: "Ujjlenyomat helye", key: "sensorsFingerprintPlace" },
        { label: "Ujjlenyomat típusa", key: "sensorsFingerprintType" },
        { label: "Vízállóság", key: "waterproofType" }
      ]
    }
  ];

  const nonNumericProps = [
    "screenType", "cpuName", "sensorsFingerprintPlace", "sensorsFingerprintType", "waterproofType", "phoneResolution"
  ];

  const logicalValueKeys = ["phoneInStore"];

  // Összes telefon betöltése (modálhoz)
  useEffect(() => {
    const fetchAllPhones = async () => {
      setLoadingAllPhones(true);
      try {
        const res = await axios.get("http://localhost:5175/allPhonesName");
        if (res.status === 200) {
          setAllPhones(res.data);
        }
      } catch (err) {
        console.error("Hiba az összes telefon lekérésekor:", err);
      } finally {
        setLoadingAllPhones(false);
      }
    };
    fetchAllPhones();
  }, []);

  // Összehasonlító telefonok betöltése
  const loadPhones = useCallback(async () => {
    const compareIds = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    if (!compareIds.length) {
      setPhones([]);
      setLoading(false);
      return;
    }

    try {
      const requests = compareIds.map(id =>
        axios.get(`http://localhost:5175/comparePage/${id}`)
      );
      const responses = await Promise.all(requests);
      const phones = responses.map(res => {
        // Az axios response .data mezőjéből vesszük ki az adatokat
        let data = Array.isArray(res.data) ? res.data[0] : res.data;
        
        // Ha van ramStorage tömb, kivonjuk a minimum RAM és minimum tárhely adatokat
        if (data && data.ramStorage && Array.isArray(data.ramStorage) && data.ramStorage.length > 0) {
          const ramValues = data.ramStorage
            .map(pair => Number(pair.ramAmount))
            .filter(value => !Number.isNaN(value));

          const storageValues = data.ramStorage
            .map(pair => Number(pair.storageAmount))
            .filter(value => !Number.isNaN(value));

          if (ramValues.length > 0) {
            data.ramAmount = Math.min(...ramValues);
          }

          if (storageValues.length > 0) {
            data.storageAmount = Math.min(...storageValues);
          }
        }
        
        return data;
      }).filter(p => p); // Nullok/undefined szűrése
      setPhones(phones);
    } catch (err) {
      console.error("Hiba az adatok lekérésekor:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhones();
  }, [loadPhones, refreshTrigger]);

  useEffect(() => {
    const loadPhoneImage = async (phoneID) => {
      try {
        const response = await axios.get(
          `http://localhost:5175/api/blob/GetIndex/${phoneID}`,
          { responseType: 'blob' }
        );

        if (response.status !== 200) {
          return;
        }

        const url = URL.createObjectURL(response.data);
        setPhoneImages(prev => ({ ...prev, [phoneID]: url }));
      } catch {
        // nincs kép vagy nem elérhető
      }
    };

    phones.forEach((phone) => {
      if (phone?.phoneID && !phoneImages[phone.phoneID]) {
        loadPhoneImage(phone.phoneID);
      }
    });
  }, [phones, phoneImages]);

  // Görgetés
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Szűrők kezelése
  const toggleFilter = (key) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(key)) newFilters.delete(key);
    else newFilters.add(key);
    setSelectedFilters(newFilters);
  };

  const toggleGroup = (idx) => {
    setOpenGroups(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Kiemelés
  const normalizeLogicalValue = (value) => {
    if (value === 1 || value === true) return "van";
    if (value === 0 || value === false) return "nincs";

    if (typeof value === "string") {
      const lowered = value.trim().toLowerCase();
      if (["1", "igen", "true", "van", "raktáron", "raktaron"].includes(lowered)) return "van";
      if (["0", "nem", "false", "nincs", "nincs raktáron", "nincs raktaron"].includes(lowered)) return "nincs";
    }

    return "-";
  };

  const getDisplayValue = (key, rawValue, phone, formatter) => {
    if (logicalValueKeys.includes(key)) {
      return normalizeLogicalValue(rawValue) === "van" ? "Van" : "Nincs";
    }

    if (formatter) {
      return formatter(rawValue, phone);
    }

    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return "-";
    }

    return rawValue;
  };

  const getHighlightClass = (key, value) => {
  if (!selectedFilters.has(key) || phones.length < 2) return "";

  // Speciális kezelés a "Készleten" mezőre
  if (logicalValueKeys.includes(key)) {
    const values = phones.map(p => normalizeLogicalValue(p[key]));
    const hasVan = values.includes("van");
    const hasNincs = values.includes("nincs");

    // Ha minden telefon készleten van, vagy mindegyik nincs – ne jelöljön semmit
    if (!hasVan || !hasNincs) return "";

    // Különben: "van" = legjobb (zöld), "nincs" = legrosszabb (narancs)
    const normalizedCurrent = normalizeLogicalValue(value);
    if (normalizedCurrent === "van") return "highlight-green";
    if (normalizedCurrent === "nincs") return "highlight-orange";
    return "";
  }

  // Eredeti numerikus logika minden más mezőre
  const numericValues = phones
    .map(p => parseFloat(p[key]))
    .filter(v => !isNaN(v));

  if (numericValues.length < 2) return "";

  const max = Math.max(...numericValues);
  const min = Math.min(...numericValues);
  const current = parseFloat(value);

  if (current === max && max !== min) return "highlight-green";
  if (current === min && max !== min) return "highlight-orange";
  return "";
};

  // Különbség vizsgálat
  const isDifferentRow = (key) => {
    if (!highlightDifferences || phones.length < 2) return false;
    const firstValue = phones[0][key];
    return phones.some(p => p[key] !== firstValue);
  };

  // Hozzáadás / eltávolítás
  const handleAddPhone = (phoneId) => {
    const compareIds = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    if (!compareIds.includes(phoneId)) {
      compareIds.push(phoneId);
      localStorage.setItem("comparePhones", JSON.stringify(compareIds));
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleRemovePhone = (phoneId) => {
    let compareIds = JSON.parse(localStorage.getItem("comparePhones") || "[]");
    compareIds = compareIds.filter(id => String(id) !== String(phoneId));
    localStorage.setItem("comparePhones", JSON.stringify(compareIds));
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCardNavigation = (phoneId) => {
    localStorage.setItem("selectedPhone", String(phoneId));
    navigate(`/telefon/${phoneId}`);
  };

  const handleCartButtonClick = (e, phoneId) => {
    e.stopPropagation();
    handleCardNavigation(phoneId);
  };

  useEffect(() => {
    const basePrice = variantPhone?.phonePrice || 0;
    if (selectedPairIdx !== null && basePrice) {
      const priceMultiplier = 1 + (selectedPairIdx * 0.1);
      setCalculatedPrice(Math.round(basePrice * priceMultiplier));
    } else {
      setCalculatedPrice(basePrice);
    }
  }, [selectedPairIdx, variantPhone]);

  const addToCartWithVariants = (e) => {
    e.stopPropagation();

    if (!variantPhone) return;

    let hasErrors = false;

    if (!selectedColor) {
      setColorError(true);
      hasErrors = true;
    } else {
      setColorError(false);
    }

    if (!selectedPair || selectedPairIdx === null) {
      setPairError(true);
      hasErrors = true;
    } else {
      setPairError(false);
    }

    if (hasErrors || selectedQty < 1) return;

    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItems = Array.isArray(raw)
      ? raw
      : Object.entries(raw).map(([id, qty]) => ({
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

    const cartItem = {
      phoneID: variantPhone.phoneID,
      quantity: selectedQty,
      colorName: selectedColor.colorName,
      colorHex: selectedColor.colorHex,
      ramAmount: selectedPair.ramAmount,
      storageAmount: selectedPair.storageAmount,
      storageIndex: selectedPairIdx,
      phoneName: variantPhone.phoneName ?? "",
      phonePrice: variantPhone.phonePrice ?? 0
    };

    const matchIndex = cartItems.findIndex(
      (item) =>
        item.phoneID === cartItem.phoneID &&
        item.colorHex === cartItem.colorHex &&
        Number(item.ramAmount) === Number(cartItem.ramAmount) &&
        Number(item.storageAmount) === Number(cartItem.storageAmount)
    );

    if (matchIndex >= 0) {
      cartItems[matchIndex].quantity = (cartItems[matchIndex].quantity || 0) + 1;
    } else {
      cartItems.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    setShowVariantModal(false);
  };

  const filteredAllPhones = allPhones.filter(phone =>
    phone.phoneName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => {
    setShowModal(false);
    setSearchTerm("");
  };

  if (loading) return <p className="text-center mt-5">Betöltés...</p>;

  if (!phones.length) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="h4">Nincs kiválasztott telefon az összehasonlításhoz.</h2>
        <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
          Telefon hozzáadása
        </button>

        {/* Modál akkor is megnyitható, ha üres a lista */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Telefon hozzáadása / eltávolítása</h3>
                <button className="modal-close-btn" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Keresés névre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {loadingAllPhones ? (
                  <p>Telefonok betöltése...</p>
                ) : filteredAllPhones.length === 0 ? (
                  <p>Nincs találat.</p>
                ) : (
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Név</th>
                        <th style={{ width: "180px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAllPhones.map(phone => {
                        const compareIds = JSON.parse(localStorage.getItem("comparePhones") || "[]");
                        const isAdded = compareIds.some(id => String(id) === String(phone.phoneID));
                        return (
                          <tr key={phone.phoneID}>
                            <td>{phone.phoneName}</td>
                            <td>
                              {isAdded ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-danger me-1"
                                    onClick={() => handleRemovePhone(phone.phoneID)}
                                  >
                                    Eltávolítás
                                  </button>
                                  <span className="text-success">✓ Hozzáadva</span>
                                </>
                              ) : (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleAddPhone(phone.phoneID)}
                                >
                                  Hozzáadás
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Bezárás
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="container py-4 position-relative">
        <div className="row">
          {/* BAL OLDALI SZŰRŐPANEL */}
          <div className="col-md-3">
            <div id="filterPanel">
              <div className="filter-option mb-4">
                <input 
                  type="checkbox" 
                  id="highlightDiff"
                  className="filter-checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                />
                <label htmlFor="highlightDiff" className="ms-2" style={{cursor: 'pointer'}}>
                  Különbségek kiemelése
                </label>
              </div>

              <div className="filter-title h5 mb-3">Kiemelés szűrő</div>
              
              {groupedProps.map((group, idx) => (
                <div key={idx} className="filter-group-dropdown">
                  <button 
                    type="button" 
                    className="filter-group-toggle"
                    onClick={() => toggleGroup(idx)}
                  >
                    {group.group} 
                    <span className="dropdown-arrow">{openGroups[idx] ? "▲" : "▼"}</span>
                  </button>
                  <div className={`filter-group-content ${openGroups[idx] ? "open" : ""}`}>
                    {group.props.map(prop => {
                      const isDisabled = nonNumericProps.includes(prop.key);
                      return (
                        <div key={prop.key} className="filter-option">
                          <input 
                            type="checkbox" 
                            className="filter-checkbox"
                            id={`check-${prop.key}`}
                            disabled={isDisabled}
                            checked={selectedFilters.has(prop.key)}
                            onChange={() => toggleFilter(prop.key)}
                          />
                          <label 
                            htmlFor={`check-${prop.key}`}
                            className={`ms-2 ${isDisabled ? 'text-muted' : ''}`}
                            style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}
                            title={isDisabled ? "Nem összehasonlítható adat" : ""}
                          >
                            {prop.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JOBB OLDALI TARTALOM */}
          <div className="col-md-9 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 mb-0">Telefonok összehasonlítása</h1>
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => setShowModal(true)}
                >
                  + Telefon hozzáadása
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    localStorage.removeItem("comparePhones");
                    setRefreshTrigger(prev => prev + 1);
                  }}
                >
                  Összehasonlítás törlése
                </button>
              </div>
            </div>

            {/* Nyilak */}
            <button className="scroll-arrow left-arrow" onClick={() => scroll("left")}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button className="scroll-arrow right-arrow" onClick={() => scroll("right")}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>

            {/* Kártyák sora */}
            <div 
              className="compare-cards-row scrollable-row" 
              id="compareResult" 
              ref={scrollContainerRef}
            >
              {phones.map((phone) => (
                <div className="compare-card" key={phone.phoneID} onClick={() => handleCardNavigation(phone.phoneID)}>
                  <button
                    className="compare-card-remove-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhone(phone.phoneID);
                    }}
                    title="Eltávolítás az összehasonlításból"
                  >
                    ×
                  </button>

                  <div className="compare-card-header">
                    <div className="compare-card-image-wrap">
                      <img
                        className="compare-card-image"
                        src={phoneImages[phone.phoneID] || "/images/placeholder.png"}
                        alt={phone.phoneName}
                      />
                      <div className="compare-card-price">{phone.phonePrice ? `${phone.phonePrice} Ft` : "-"}</div>
                      <div className={`compare-card-stock ${normalizeLogicalValue(phone.phoneInStore) === "van" ? "compare-card-stock--true" : "compare-card-stock--false"}`}>
                        {normalizeLogicalValue(phone.phoneInStore) === "van" ? "Raktáron" : "Nincs raktáron"}
                      </div>
                    </div>

                    <div className="compare-card-title-row">
                      <div className="compare-card-title" title={phone.phoneName}>{phone.phoneName}</div>
                      <div className="compare-card-actions">
                        <button
                          type="button"
                          className="compare-card-action-btn"
                          title="Kosárba"
                          onClick={(e) => handleCartButtonClick(e, phone.phoneID)}
                        >
                          <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="compare-card-parts">
                    {groupedProps.map((group) => (
                      <div className="compare-group-block" key={group.group}>
                        <div className="compare-part-group-title">{group.group}</div>
                        {group.props.map((prop) => {
                          const rawValue = phone[prop.key];
                          const displayValue = getDisplayValue(prop.key, rawValue, phone, prop.format);
                          const highlightClass = getHighlightClass(prop.key, rawValue);
                          const isDiff = isDifferentRow(prop.key);

                          return (
                            <div 
                              key={prop.key} 
                              className={`compare-part ${isDiff ? 'border-start border-3 border-primary ps-2' : ''}`}
                              title={String(displayValue || "-")}
                            >
                              <span className="compare-part-label">{prop.label}:</span>
                              <span className={`compare-part-value ${highlightClass}`}>
                                {displayValue || "-"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODÁLIS ABLAK (csak ha showModal true és már van telefon a listában) */}
      {showModal && phones.length > 0 && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Telefon hozzáadása / eltávolítása</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Keresés névre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {loadingAllPhones ? (
                <p>Telefonok betöltése...</p>
              ) : filteredAllPhones.length === 0 ? (
                <p>Nincs találat.</p>
              ) : (
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Név</th>
                      <th style={{ width: "180px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllPhones.map(phone => {
                      const compareIds = JSON.parse(localStorage.getItem("comparePhones") || "[]");
                      const isAdded = compareIds.some(id => String(id) === String(phone.phoneID));
                      return (
                        <tr key={phone.phoneID}>
                          <td>{phone.phoneName}</td>
                          <td>
                            {isAdded ? (
                              <>
                                <button
                                  className="btn btn-sm btn-danger me-1"
                                  onClick={() => handleRemovePhone(phone.phoneID)}
                                >
                                  Eltávolítás
                                </button>
                                <span className="text-success">✓ Hozzáadva</span>
                              </>
                            ) : (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleAddPhone(phone.phoneID)}
                              >
                                Hozzáadás
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {showVariantModal && (
        <div className="compareVariantModalOverlay" onClick={() => setShowVariantModal(false)}>
          <div className="compareVariantModal" onClick={(e) => e.stopPropagation()}>
            {variantLoading || !variantPhone ? (
              <p>Variánsok betöltése...</p>
            ) : (
              <>
                <h3>Válassz színt és RAM/Storage verziót</h3>

                <div className="compareVariantSection">
                  <div className="compareVariantTitle">Szín</div>
                  <div className="compareColorOptions">
                    {(variantPhone.colors || []).map((c, idx) => (
                      <button
                        key={`${c.colorHex}-${idx}`}
                        className={`compareColorCircle ${selectedColor?.colorHex === c.colorHex ? "compareColorCircle--selected" : ""}`}
                        style={{ backgroundColor: c.colorHex }}
                        title={c.colorName}
                        onClick={() => {
                          setSelectedColor(c);
                          setColorError(false);
                        }}
                        type="button"
                      />
                    ))}
                  </div>
                  {selectedColor && (
                    <div className="compareVariantLabel">{selectedColor.colorName}</div>
                  )}
                  {colorError && (
                    <div className="compareVariantError">Kérjük, válasszon ki egy színt!</div>
                  )}
                </div>

                <div className="compareVariantSection">
                  <div className="compareVariantTitle">RAM / Storage</div>
                  <div className="comparePairOptions">
                    {(variantPhone.ramStoragePairs || []).map((p, idx) => (
                      <button
                        key={`${p.ramAmount}-${p.storageAmount}-${idx}`}
                        className={`comparePairButton ${selectedPairIdx === idx ? "comparePairButton--selected" : ""}`}
                        onClick={() => {
                          setSelectedPair(p);
                          setSelectedPairIdx(idx);
                          setPairError(false);
                        }}
                        type="button"
                      >
                        {p.ramAmount} GB / {p.storageAmount} GB
                      </button>
                    ))}
                  </div>
                  {pairError && (
                    <div className="compareVariantError">Kérjük, válasszon ki egy RAM/Storage verziót!</div>
                  )}
                </div>

                <div className="compareVariantSection">
                  <div className="compareVariantTitle">Mennyiség</div>
                  <div className="comparePairOptions">
                    <button
                      className="comparePairButton"
                      type="button"
                      onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="compareQuantityNumber">{selectedQty}</span>
                    <button
                      className="comparePairButton"
                      type="button"
                      onClick={() => setSelectedQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="compareVariantSection">
                  <div className="compareVariantTitle">Ár</div>
                  <div className="compareVariantLabel" style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#666' }}>
                    {calculatedPrice?.toLocaleString()} Ft / db
                  </div>
                  <div className="compareVariantLabel" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#68F145', marginTop: '8px' }}>
                    {(calculatedPrice * selectedQty)?.toLocaleString()} Ft
                  </div>
                </div>

                <div className="compareVariantActions">
                  <button className="compareVariantCancel" onClick={() => setShowVariantModal(false)} type="button">
                    Mégse
                  </button>
                  <button
                    className="compareVariantConfirm"
                    onClick={addToCartWithVariants}
                    type="button"
                  >
                    Kosárba
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}