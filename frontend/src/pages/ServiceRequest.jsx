import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ServiceRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    device: '',
    problem: '',
    atvizsgalas: false
  });
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [formMessage, setFormMessage] = useState('');
  const [showAtvizsgalasInfo, setShowAtvizsgalasInfo] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');
  const navigate = useNavigate();

  const problemOptions = [
    { id: 'problemDisplay', value: 'kijelzo', label: 'Kijelző' },
    { id: 'problemBattery', value: 'akku', label: 'Akkumulátor' },
    { id: 'problemSoftware', value: 'szoftver', label: 'Szoftver' },
    { id: 'problemCamera', value: 'kamera', label: 'Kamera' },
    { id: 'problemSound', value: 'hang', label: 'Hang' },
    { id: 'problemOther', value: 'egyeb', label: 'Egyéb' }
  ];

  useEffect(() => {
    generateUniqueCode();
  }, []);

  const generateUniqueCode = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const code = `PHNSCT-${datePart}-${randomPart}`;
    setUniqueCode(code);
    return code;
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));

    if (id === 'atvizsgalas') {
      setShowAtvizsgalasInfo(checked);
    }
  };

  const handleProblemToggle = (problem) => {
    setSelectedProblems(prev => {
      if (prev.includes(problem.value)) {
        return prev.filter(p => p !== problem.value);
      } else {
        return [...prev, problem.value];
      }
    });
  };

  const getSelectedProblemLabels = () => {
    return problemOptions
      .filter(problem => selectedProblems.includes(problem.value))
      .map(problem => problem.label);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.device || !formData.problem) {
      setFormMessage(
        <div className="alert alert-danger">
          Kérjük, töltse ki az összes kötelező mezőt!
        </div>
      );
      return;
    }

    const code = generateUniqueCode();
    const feltetelLink = `<a href="/csomagolasfeltetelek" target="_blank" style="color:#17a2b8; text-decoration:underline;">ITT</a>`;
    const selectedLabels = getSelectedProblemLabels().join(', ');

    if (formData.atvizsgalas) {
      setFormMessage(
        <div className="alert alert-info">
          Kérését megkaptuk, és rögzítettük.<br />
          <b>Ön <strong>Telefon átvizsgálást</strong> kért.</b><br />
          {selectedLabels && <><b>Kiválasztott problémák:</b> {selectedLabels}<br /></>}
          <strong>Kérjük, küldje el telefonját postán a következő címre:</strong><br />
          <b>Cím:</b> Miskolc, Palóczy László utca 3, 3525<br />
          <b>Név:</b> PhoneScout Szerviz<br />
          <b>Telefonszám:</b> +36 30 123 4567<br />
          <b>Email:</b> info@phonescout.hu<br />
          <br />
          <b>Bevizsgálási kódja:</b> <span style={{ fontSize: '1.2em', color: '#17a2b8' }}><strong>{code}</strong></span><br />
          <b>Kérjük, a csomagba mellékelje:</b><br />
          <ul>
            <li>A nevet amit itt megadott,</li>
            <li>A telefonszámot amit itt megadott,</li>
            <li>A készüléket a csomagolási feltételeknek megfelelően becsomagolva <Link to="/csomagolasfeltetelek" target="_blank" style={{ color: '#17a2b8', textDecoration: 'underline' }}>ITT</Link>,</li>
            <li>A bevizsgálási kódját. Az ön kódja: <strong>{code}</strong></li>
          </ul>
          <br />
        </div>
      );
    } else {
      setFormMessage(
        <div className="alert alert-info">
          Kérését megkaptuk, és rögzítettük.<br />
          {selectedLabels && <><b>Kiválasztott problémák:</b> {selectedLabels}<br /></>}
          <strong>Kérjük, küldje el postán a következő címre:</strong><br />
          <b>Cím:</b> Miskolc, Palóczy László utca 3, 3525<br />
          <b>Név:</b> PhoneScout Szerviz<br />
          <b>Telefonszám:</b> +36 30 123 4567<br />
          <b>Email:</b> info@phonescout.hu<br />
          <br />
          <b>Bevizsgálási kódja:</b> <span style={{ fontSize: '1.2em', color: '#17a2b8' }}><strong>{code}</strong></span><br />
          <b>Kérjük, a csomagba mellékelje:</b><br />
          <ul>
            <li>A nevet amit itt megadott,</li>
            <li>A telefonszámot amit itt megadott,</li>
            <li>A készüléket a csomagolási feltételeknek megfelelően becsomagolva <Link to="/csomagolasfeltetelek" target="_blank" style={{ color: '#17a2b8', textDecoration: 'underline' }}>ITT</Link>,</li>
            <li>A bevizsgálási kódját. Az ön kódja: <strong>{code}</strong></li>
          </ul>
          <br />
        </div>
      );
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      device: '',
      problem: '',
      atvizsgalas: false
    });
    setSelectedProblems([]);
    setShowAtvizsgalasInfo(false);
  };

  const openChatbot = () => {
    alert("Chatbot nyitása...");
  };

  const faqItems = [
    {
      id: 'faq1',
      question: 'Mennyi idő alatt készül el a szervizelés?',
      answer: 'Általában 3-5 munkanap, de a pontos időt a hiba típusa és az alkatrész elérhetősége befolyásolja.'
    },
    {
      id: 'faq2',
      question: 'Kapok árajánlatot a javítás előtt?',
      answer: 'Igen, minden esetben előzetes árajánlatot küldünk az átvizsgálás után.'
    },
    {
      id: 'faq3',
      question: 'Hogyan követhetem nyomon a szerviz státuszát?',
      answer: 'A bevizsgálási kód segítségével az online szerviz státusz lekérdező oldalon.'
    }
  ];

  return (
    <div>
      <Navbar />

      <div className="container mt-3 mb-2 text-end">
        <button id="chatbotBtn" className="btn btn-outline-info" onClick={openChatbot}>
          <i className="fas fa-robot"></i> Chatbot: Segítség a hibához
        </button>
      </div>

      <div className="container my-5">
        <h2>Szervizelés igénylése</h2>
        <form id="szervizForm" className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Név</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email cím</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Telefonszám</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              maxLength="11"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="device" className="form-label">Készülék gyártója</label>
            <input
              type="text"
              className="form-control"
              id="device"
              value={formData.device}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mivel van baj?</label>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                type="button"
                id="problemDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {getSelectedProblemLabels().length > 0 ? getSelectedProblemLabels().join(', ') : 'Válassz problémákat...'}
              </button>
              <div className="dropdown-menu p-3" aria-labelledby="problemDropdown" style={{ minWidth: '250px' }}>
                {problemOptions.map(problem => (
                  <div className="form-check" key={problem.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={problem.id}
                      checked={selectedProblems.includes(problem.value)}
                      onChange={() => handleProblemToggle(problem)}
                    />
                    <label className="form-check-label" htmlFor={problem.id}>
                      {problem.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="atvizsgalas"
                checked={formData.atvizsgalas}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="atvizsgalas">
                Átvizsgálás kérése
              </label>
            </div>
          </div>

          {showAtvizsgalasInfo && (
            <div className="col-12" id="atvizsgalasInfo">
              <div className="alert alert-secondary mt-2">
                Az átvizsgálás során szakembereink teljes körűen ellenőrzik a készülék állapotát, feltárják a
                rejtett hibákat, és javaslatot tesznek a javításra vagy cserére. Az átvizsgálás díja a vizsgálat
                eredményétől függően kerül megállapításra.
              </div>
            </div>
          )}

          <div className="col-12">
            <label htmlFor="problem" className="form-label">Hiba leírása</label>
            <textarea
              className="form-control"
              id="problem"
              rows="3"
              value={formData.problem}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <hr />
          <h3>Számlázási cím</h3>
          <div className="col-md-1">
            <label htmlFor="zipcode" className="form-label">Irányítószám</label>
            <input
              type="text"
              className="form-control"
              id="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
              }}
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="city" className="form-label">Város</label>
            <input
              type="text"
              className="form-control"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="address" className="form-label">Cím (utca, házszám)</label>
            <input
              type="text"
              className="form-control"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-4"> </div>
          <div className="col-4">
            <button type="submit" className="btn btn-primary">Igénylés elküldése</button>
          </div>

          <div id="formMessage" className="mt-3">
            {formMessage}
          </div>
        </form>
      </div>

      <div className="hr">
        <hr size="5" />
      </div>

      <div className="container my-5">
        <h3>Gyakran Ismételt Kérdések</h3>
        <div className="accordion" id="faqAccordion">
          {faqItems.map((faq, index) => (
            <div className="accordion-item" key={faq.id}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}