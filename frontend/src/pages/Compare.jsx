import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Compare.css";
import axios from 'axios';

export default function Compare() {
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
            ? `${p.phoneResolutionWidth} x ${p.phoneResolutionHeight}` : "-"
        },
        { label: "Kijelző méret", key: "screenSize", format: v => v ? `${v.toFixed(2)}"` : "-" },
        { label: "Kijelző max fényerő", key: "screenMaxBrightness" },
        { label: "Kijelző élesség", key: "screenSharpness" },
        { label: "Kijelző típusa", key: "screenType" }
      ]
    },
    {
      group: "CPU",
      props: [
        { label: "CPU név", key: "cpuName" },
        { label: "Antutu pontszám", key: "phoneAntutu" },
        { label: "CPU max órajel", key: "cpuMaxClockSpeed" },
        { label: "CPU magok száma", key: "cpuCoreNumber" },
        { label: "CPU gyártástechnológia", key: "cpuManufacturingTechnology" }
      ]
    },
    {
      group: "RAM",
      props: [
        { label: "RAM mennyiség", key: "ramAmount", format: v => v ? `${v} GB` : "-" },
        { label: "RAM sebesség", key: "ramSpeed" }
      ]
    },
    {
      group: "Tárhely",
      props: [
        { label: "Tárhely mennyiség", key: "storageAmount", format: v => v ? `${v} GB` : "-" },
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
      const raw = await Promise.all(requests);
      const flattened = raw.flatMap(p => Array.isArray(p) ? p : (p ? [p] : []));
      setPhones(flattened);
    } catch (err) {
      console.error("Hiba az adatok lekérésekor:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhones();
  }, [loadPhones, refreshTrigger]);

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
  const getHighlightClass = (key, value) => {
  if (!selectedFilters.has(key) || phones.length < 2) return "";

  // Speciális kezelés a "Készleten" mezőre
  if (key === "phoneInStore") {
    const values = phones.map(p => p[key]);
    const hasVan = values.includes("van");
    const hasNincs = values.includes("nincs");

    // Ha minden telefon készleten van, vagy mindegyik nincs – ne jelöljön semmit
    if (!hasVan || !hasNincs) return "";

    // Különben: "van" = legjobb (zöld), "nincs" = legrosszabb (narancs)
    if (value === "van") return "highlight-green";
    if (value === "nincs") return "highlight-orange";
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
                <div className="compare-card" key={phone.phoneID}>
                  <div className="compare-card-title">{phone.phoneName}</div>
                  
                  <div className="compare-card-parts">
                    {groupedProps.map((group) => (
                      <React.Fragment key={group.group}>
                        <div className="compare-part-group-title">{group.group}</div>
                        {group.props.map((prop) => {
                          const rawValue = phone[prop.key];
                          const displayValue = prop.format ? prop.format(rawValue, phone) : rawValue;
                          const highlightClass = getHighlightClass(prop.key, rawValue);
                          const isDiff = isDifferentRow(prop.key);

                          return (
                            <div 
                              key={prop.key} 
                              className={`compare-part ${isDiff ? 'border-start border-3 border-primary ps-2' : ''}`}
                            >
                              <span className="compare-part-label">{prop.label}:</span>
                              <span className={`compare-part-value ${highlightClass}`}>
                                {displayValue || "-"}
                              </span>
                            </div>
                          );
                        })}
                      </React.Fragment>
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
    </div>
  );
}