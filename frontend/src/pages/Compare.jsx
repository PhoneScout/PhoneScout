import React, { useEffect, useState, useRef } from "react";
import "./Compare.css";

export default function Compare() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(new Set());
  const [openGroups, setOpenGroups] = useState({});
  const scrollContainerRef = useRef(null);

  // 1. Csoportosított tulajdonságok definíciója (a régi JS-ed alapján)
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
      group: "Kamerák",
      props: [
        { label: "Kamerák nevei", key: "cameraNames" },
        { label: "Kamerák felbontása", key: "cameraResolutions" },
        { label: "Kamera típusok", key: "cameraTypes" }
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
    "cameraNames", "screenType", "cpuName", "cameraTypes", 
    "sensorsFingerprintPlace", "sensorsFingerprintType", "waterproofType", "phoneResolution"
  ];

  // 2. Adatok betöltése
  useEffect(() => {
    const loadPhones = async () => {
      const compareIds = JSON.parse(localStorage.getItem("comparePhones") || "[]");
      if (!compareIds.length) {
        setPhones([]);
        setLoading(false);
        return;
      }

      try {
        const requests = compareIds.map(id =>
          fetch(`http://localhost:5175/comparePage/${id}`).then(res => res.ok ? res.json() : null)
        );
        const raw = await Promise.all(requests);
        const flattened = raw.flatMap(p => Array.isArray(p) ? p : (p ? [p] : []));
        setPhones(flattened);
      } catch (err) {
        console.error("Hiba az adatok lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPhones();
  }, []);

  // 3. Görgetés vezérlése
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // 4. Szűrők kezelése
  const toggleFilter = (key) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(key)) newFilters.delete(key);
    else newFilters.add(key);
    setSelectedFilters(newFilters);
  };

  const toggleGroup = (idx) => {
    setOpenGroups(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 5. Kiemelés logika (Zöld/Narancs)
  const getHighlightClass = (key, value) => {
    if (!selectedFilters.has(key) || phones.length < 2) return "";
    
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

  // 6. Különbség vizsgálat (Félkövér kiemeléshez)
  const isDifferentRow = (key) => {
    if (!highlightDifferences || phones.length < 2) return false;
    const firstValue = phones[0][key];
    return phones.some(p => p[key] !== firstValue);
  };

  if (loading) return <p className="text-center mt-5">Betöltés...</p>;

  if (!phones.length) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="h4">Nincs kiválasztott telefon az összehasonlításhoz.</h2>
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

          {/* JOBB OLDALI TARTALOM (Telefonok) */}
          <div className="col-md-9 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 mb-0">Telefonok összehasonlítása</h1>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => { localStorage.removeItem("comparePhones"); window.location.reload(); }}
              >
                Összehasonlítás törlése
              </button>
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
    </div>
  );
}
