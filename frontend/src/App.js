import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import Home from './pages/Home';
import { Routes, Route, useLocation } from 'react-router-dom';
import FilterPage from './pages/FilterPage';
import Service from './pages/Service';
import Cart from './pages/Cart';
import Compare from './pages/Compare';
import PhonePage from './pages/PhonePage';
import Profile from './pages/Profile';
import ServiceRequest from './pages/ServiceRequest';
import LoginRegister from './pages/LoginRegister';
import RegistrationConfirm from './pages/RegistrationConfirm';
import KepTeszt from './pages/KepTeszt';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Contacts from './pages/Contacts';
import Shop from './pages/Shop';
import PackagingTerms from './pages/PackagingTerms';
import ChatbotWidget from './components/ChatbotWidget';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';
import ScrollToTopButton from './components/ScrollToTopButton';



function App() {

  const location = useLocation();
  const excludeLayout = ['/bejelentkezes', '/fiokaktivalas','/elfelejtettjelszo'];
  const shouldShowLayout = !excludeLayout.includes(location.pathname);

  const getPageTitle = (pathname) => {
    const staticTitles = {
      '/': 'Főoldal',
      '/szures': 'Szűrés',
      '/szerviz': 'Szerviz',
      '/kosar': 'Kosár',
      '/osszehasonlitas': 'Összehasonlítás',
      '/profil': 'Profil',
      '/szervizigenyles': 'Szervizigénylés',
      '/bejelentkezes': 'Bejelentkezés',
      '/fiokaktivalas': 'Fiókaktiválás',
      '/teszt': 'Teszt',
      '/rolunk': 'Rólunk',
      '/kapcsolat': 'Kapcsolat',
      '/elerhetosegek': 'Elérhetőségek',
      '/bolt': 'Bolt',
      '/csomagolasfeltetelek': 'Csomagolási feltételek',
      '/elfelejtettjelszo': 'Elfelejtett jelszó'
    };

    if (pathname.startsWith('/telefon/')) {
      return 'Telefon adatlap';
    }

    return staticTitles[pathname] || 'PhoneScout';
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = `${pageTitle} | PhoneScout`;
  }, [location.pathname]);

  return (

    <div className="App">


      {shouldShowLayout && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/szures' element={<FilterPage />} ></Route>
        <Route path='/szerviz' element={<Service />}></Route>
        <Route path='/kosar' element={<Cart />}></Route>
        <Route path='/osszehasonlitas' element={<Compare />}></Route>
        <Route path="/telefon/:phoneId" element={<PhonePage />} />
        <Route path="/profil" element={<Profile />}></Route>
        <Route path="/szervizigenyles" element={<ServiceRequest />}></Route>
        <Route path="/szervizigenyles" element={<ServiceRequest />}></Route>
        <Route path="/bejelentkezes" element={<LoginRegister />}></Route>
        <Route path='/fiokaktivalas' element={<RegistrationConfirm />} />
        <Route path='/teszt' element={<KepTeszt />} />
        <Route path='/rolunk' element={<AboutUs />} />
        <Route path='/kapcsolat' element={<Contact />} />
        <Route path='/elerhetosegek' element={<Contacts />} />
        <Route path='/bolt' element={<Shop />} />
        <Route path='/csomagolasfeltetelek' element={<PackagingTerms />} />
        <Route path='/elfelejtettjelszo' element={<ForgotPassword />} />

      </Routes>

      {shouldShowLayout && <Footer />}

      <ChatbotWidget />
      <ScrollToTopButton />

    </div>


  );
}

export default App;
