import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './PhonePage.css';
import axios from 'axios';

export default function PhonePage() {
  const { phoneId } = useParams();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRamIdx, setSelectedRamIdx] = useState(0);
  const [selectedCameraIdx, setSelectedCameraIdx] = useState(0);
  const timeoutsRef = useRef([]);

  const svgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5175/phonePage/${phoneId}`)
      .then(response => {
        setPhone(response.data);
        if (response.data.colors?.length > 0) setSelectedColor(response.data.colors[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Hiba:", err);
        setLoading(false);
      });
  }, [phoneId]);

  // SVG interakciók
  useEffect(() => {
    if (!phone || !svgRef.current) return;
    const svgObj = svgRef.current;

    const setupSvg = () => {
      const svgDoc = svgObj.contentDocument;
      if (!svgDoc) return;

      const mappings = [
        { id: "ram/tárhely", className: "ram_storage_table" },
        { id: "akkumulátoréstöltés", className: "akkumulator_table" },
        { id: "csatlakoztathatóság", className: "csatlakozo_table" },
        { id: "cpu", className: "cpu_table" },
        { id: "kamera", className: "camera_table" },
        { id: "hangszóró", className: "speaker_table" }
      ];

      mappings.forEach(map => {
        const element = svgDoc.getElementById(map.id);
        if (element) {
          element.style.cursor = "pointer";

          element.onmouseenter = () => {
            element.style.fill = "#38ec38dc";
            document.querySelectorAll(`.${map.className}`).forEach(row => {
              row.style.backgroundColor = "#38ec38bd";
            });
          };

          element.onmouseleave = () => {
            element.style.fill = "";
            document.querySelectorAll(`.${map.className}`).forEach(row => {
              row.style.backgroundColor = "";
            });
          };

          element.onclick = () => {
            // Kiválasztjuk a megfelelő osztályú sorokat (kivéve az üres elválasztó sorokat)
            const rows = document.querySelectorAll(`.${map.className}:not(.more_rows)`);

            // Minden sorban a td-kre rakjuk a flash osztályt
            rows.forEach(row => {
              row.querySelectorAll('td').forEach(td => td.classList.add('flash-highlight'));
            });

            const timeoutId = setTimeout(() => {
              rows.forEach(row => {
                row.querySelectorAll('td').forEach(td => td.classList.remove('flash-highlight'));
              });
              timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId);
            }, 800); //villanás

            timeoutsRef.current.push(timeoutId);

            // Görgetés az első ilyen sorhoz (általában a fejléc)
            if (rows.length > 0) {
              rows[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
          };
        }
      });
    };

    svgObj.addEventListener("load", setupSvg);

    // Cleanup: timeouts és event listener eltávolítása
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      svgObj.removeEventListener("load", setupSvg);
    };
  }, [phone]);

  if (loading) return <div className="text-center mt-5"><h3>Betöltés...</h3></div>;
  if (!phone) return <div className="text-center mt-5"><h3>Készülék nem található.</h3></div>;

  return (
    <div>
      <div className="container-fluid px-3 px-md-5">

        {/* FELSŐ SZEKCIÓ: 3 OSZLOPOS ELRENDEZÉS */}
        <div className="row mt-4 align-items-start gy-4">

          {/* 1. OSZLOP: KÉP / CAROUSEL */}
          <div className="col-12 col-md-4">
            <div className="carouselDiv">
              <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner text-center">
                  <div className="carousel-item active">
                    <img src="../Images/RedMagicTesztTelefonElolHatulKep.jpg" className="img-fluid" alt="Telefon elöl" style={{ maxHeight: '450px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. OSZLOP: SPECIFIKÁCIÓ KIVÁLASZTÁSA */}
          <div className="col-12 col-md-4 colorAndVersionPicker text-center text-md-start">
            <div className="szinValaszto mt-0">
              <h4>Szín kiválasztása:</h4>
              <div className="color-picker justify-content-center justify-content-md-start">
                {phone.colors.map((c, i) => (
                  <button
                    key={i}
                    className="color-option"
                    style={{
                      backgroundColor: c.colorHex,
                      boxShadow: selectedColor?.colorName === c.colorName ? `0 0 15px ${c.colorHex}` : 'none',
                      border: selectedColor?.colorName === c.colorName ? '3px solid black' : '1px solid black'
                    }}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="ramTárhelyPicker">
              <h4>RAM/Tárhely:</h4>
              <div className="ramTárhelyOptionPicker d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                {phone.ramStoragePairs.map((pair, i) => (
                  <button
                    key={i}
                    className="ramTárhelyOption btn"
                    style={{
                      border: selectedRamIdx === i ? '2px solid black' : '1px solid black',
                      backgroundColor: selectedRamIdx === i ? '#f0f0f0' : 'white'
                    }}
                    onClick={() => setSelectedRamIdx(i)}
                  >
                    {pair.ramAmount}GB / {pair.storageAmount >= 1024 ? '1TB' : pair.storageAmount + 'GB'}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="moreInfoAboutPhone mt-4 mx-auto mx-md-0"
              onClick={() => {
                const title = document.getElementById('title');

                // Görgetés
                title.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });

                // Villanó effekt
                title.classList.add('title-highlight');
                setTimeout(() => {
                  title.classList.remove('title-highlight');
                }, 1000);
              }}
            >
              <strong>További információk</strong>
            </div>
          </div>

          {/* 3. OSZLOP: MEGRENDELŐS FELÜLET */}
          <div className="col-12 col-md-4">
            <div className="phoneDataBox mx-auto">
              <div className="phoneName">{phone.phoneName}</div>
              <div className="phoneStock" style={{ color: phone.phoneInStore === "van" ? "#68F145" : "red" }}>
                {phone.phoneInStore === "van" ? "Raktáron" : "Nincs raktáron"}
              </div>
              <div className="price">{phone.phonePrice?.toLocaleString()} Ft</div>
              <button className="phoneSiteButton phoneSiteCartButton mt-3">Kosárba rakom</button>
              <button className="phoneSiteButton phoneSiteCompareButton mt-2">Összehasonlítás</button>
            </div>
          </div>
        </div>

        {/* ALSÓ RÉSZ: RÉSZLETES TÁBLÁZAT ÉS INTERAKTÍV SVG */}
        <div className="row mt-5 align-items-start gy-5">
          <div className="col-12 col-lg-1"></div>
          <div className="col-12 col-lg-7">
            <div className="table-responsive">
              <table className="table" id="phoneTable">
                <thead>
                  <tr>
                    <th colSpan="2" className="first_row py-3">
                      <strong className="h4" id='title'>{phone.phoneName} részletes specifikációja</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* CPU SZAKASZ */}
                  <tr className="cpu_table first_row"><td colSpan="2"><strong>CPU / Processzor</strong></td></tr>
                  <tr className="cpu_table"><td>Név / Típus</td><td>{phone.cpuName}</td></tr>
                  <tr className="cpu_table"><td>Magok / Órajel</td><td>{phone.cpuCores} mag / {phone.cpuClock} GHz</td></tr>
                  <tr className="cpu_table"><td>Technológia / Antutu</td><td>{phone.cpuTech} nm / {phone.phoneAntutu?.toLocaleString()} pont</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/* KIJELZŐ SZAKASZ */}
                  <tr className="kijelzo_table first_row"><td colSpan="2"><strong>Kijelző</strong></td></tr>
                  <tr className="kijelzo_table"><td>Panel típusa</td><td>{phone.screenType}</td></tr>
                  <tr className="kijelzo_table"><td>Felbontás</td><td>{phone.phoneResolutionHeight} x {phone.phoneResolutionWidth} px ({phone.screenSharpness} ppi)</td></tr>
                  <tr className="kijelzo_table"><td>Méret / Frissítés</td><td>{phone.screenSize}” / {phone.screenRefreshRate} Hz</td></tr>
                  <tr className="kijelzo_table"><td>Fényerő (Max)</td><td>{phone.screenMaxBrightness} nit</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/* KAMERA SZAKASZ - DINAMIKUS VÁLASZTÓVAL */}
                  <tr className="camera_table first_row">
                    <td><strong>Kamerák</strong></td>
                    <td className="d-flex gap-1 flex-wrap">
                      {phone.cameras.map((cam, idx) => (
                        <button
                          key={idx}
                          className={`btn btn-sm ${selectedCameraIdx === idx ? 'btn-dark' : 'btn-outline-dark'}`}
                          onClick={() => setSelectedCameraIdx(idx)}
                        >
                          {idx + 1}. {cam.cameraType.split(' ')[0]}
                        </button>
                      ))}
                    </td>
                  </tr>
                  <tr className="camera_table"><td>Típus</td><td>{phone.cameras[selectedCameraIdx].cameraType}</td></tr>
                  <tr className="camera_table"><td>Szenzor név</td><td>{phone.cameras[selectedCameraIdx].cameraName || "Nincs adat"}</td></tr>
                  <tr className="camera_table"><td>Felbontás / Rekesz</td><td>{phone.cameras[selectedCameraIdx].cameraResolution} MP / {phone.cameras[selectedCameraIdx].cameraAperture}</td></tr>
                  <tr className="camera_table"><td>Fókusztávolság / OIS</td><td>{phone.cameras[selectedCameraIdx].cameraFocalLength}mm / {phone.cameras[selectedCameraIdx].cameraOis}</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/* CSATLAKOZTATHATÓSÁG SZAKASZ */}
                  <tr className="csatlakozo_table first_row"><td colSpan="2"><strong>Csatlakoztathatóság</strong></td></tr>
                  <tr className="csatlakozo_table"><td>Wi-Fi / Bluetooth</td><td>Wifi {phone.connectionMaxWifi} / BT {phone.connectionMaxBluetooth}</td></tr>
                  <tr className="csatlakozo_table"><td>Mobilhálózat</td><td>{phone.connectionMaxMobileNetwork}. generáció</td></tr>
                  <tr className="csatlakozo_table"><td>SIM / eSIM / NFC</td><td>{phone.connectionDualSim} / {phone.connectionEsim} / {phone.connectionNfc}</td></tr>
                  <tr className="csatlakozo_table"><td>Jack csatlakozó</td><td>{phone.connectionJack}</td></tr>
                  <tr className="csatlakozo_table"><td>Infraport</td><td>{phone.sensorsInfrared}</td></tr>
                  <tr className="csatlakozo_table"><td>Ujjlenyomat</td><td>{phone.fingerprintType} ({phone.fingerprintPlace})</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/* RAM / TÁRHELY SZAKASZ */}
                  <tr className="ram_storage_table first_row"><td colSpan="2"><strong>RAM / Tárhely</strong></td></tr>
                  <tr className="ram_storage_table"><td>RAM sebesség</td><td>{phone.ramSpeed}</td></tr>
                  <tr className="ram_storage_table"><td>Tárhely sebesség</td><td>{phone.storageSpeed}</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/* AKKUMULÁTOR ÉS KÜLSŐ SZAKASZ */}
                  <tr className="akkumulator_table first_row"><td colSpan="2"><strong>Akkumulátor és Külső</strong></td></tr>
                  <tr className="akkumulator_table"><td>Akkumulátor kapacitása</td><td>{phone.batteryCapacity} mAh</td></tr>
                  <tr className="akkumulator_table"><td>Akkumulátor típusa</td><td>{phone.batteryType}</td></tr>
                  <tr className="akkumulator_table"><td>Vezetékes töltés</td><td>{phone.batteryMaxChargingWired} W</td></tr>
                  <tr className="akkumulator_table"><td>Vezeték nélküli töltés</td><td>{phone.batteryMaxChargingWireless} W</td></tr>
                  <tr className="akkumulator_table"><td>Töltő csatlakozó</td><td>{phone.chargerType}</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/*Test/Ház/Külső*/}
                  <tr className="test_table first_row"><td colSpan="2"><strong>Test/Ház/Külső</strong></td></tr>
                  <tr className="test_table"><td>Vízállóság</td><td>{phone.waterproofType}</td></tr>
                  <tr className="test_table"><td>Hátlap</td><td>{phone.backMaterial}</td></tr>
                  <tr className="test_table"><td>Magasság</td><td>{phone.caseHeight}mm</td></tr>
                  <tr className="test_table"><td>Szélesség</td><td>{phone.caseWidth}mm</td></tr>
                  <tr className="test_table"><td>Mélység</td><td>{phone.caseThickness}mm</td></tr>
                  <tr className="test_table"><td>Súly</td><td>{phone.phoneWeight}g</td></tr>

                  <tr className="more_rows"><td colSpan="2"></td></tr>

                  {/* HANGSZÓRÓ SZAKASZ */}
                  <tr className="speaker_table first_row"><td colSpan="2"><strong>Hangszóró</strong></td></tr>
                  <tr className="speaker_table"><td>Hangszóró típusa</td><td>{phone.speakerType}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SVG OLDALSÁV */}
          <div className="col-12 col-lg-4 d-none d-lg-block">
            <div className="svg-container sticky-top">
              <object id="mySvg" ref={svgRef} data="/images/telefon-svg.svg" type="image/svg+xml" style={{ width: '100%', minWidth: '300px' }}></object>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
