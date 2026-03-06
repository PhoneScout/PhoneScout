import { Route, Routes } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './mobile-functional-overrides.css';
import MobileLayout from './components/MobileLayout';
import Home from '../pages/Home';
import FilterPage from '../pages/FilterPage';
import Service from '../pages/Service';
import Cart from '../pages/Cart';
import Compare from '../pages/Compare';
import PhonePage from '../pages/PhonePage';
import Profile from '../pages/Profile';
import ServiceRequest from '../pages/ServiceRequest';
import LoginRegister from '../pages/LoginRegister';
import RegistrationConfirm from '../pages/RegistrationConfirm';
import AboutUs from '../pages/AboutUs';
import Contact from '../pages/Contact';
import Contacts from '../pages/Contacts';
import Shop from '../pages/Shop';
import PackagingTerms from '../pages/PackagingTerms';
import ForgotPassword from '../pages/ForgotPassword';
import KepTeszt from '../pages/KepTeszt';
import ChatbotWidget from '../components/ChatbotWidget';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useAuth } from '../components/AuthContext';

function MobileApp() {
  const { token } = useAuth();

  return (
    <div className='mobile-mode-root'>
      <MobileLayout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/szures' element={<FilterPage />} />
          <Route path='/szerviz' element={<Service />} />
          <Route path='/kosar' element={<Cart />} />
          <Route path='/osszehasonlitas' element={<Compare />} />
          <Route path='/telefon/:phoneId' element={<PhonePage />} />
          <Route path='/profil' element={token ? <Profile /> : <LoginRegister />} />
          <Route path='/szervizigenyles' element={<ServiceRequest />} />
          <Route path='/bejelentkezes' element={<LoginRegister />} />
          <Route path='/fiokaktivalas' element={<RegistrationConfirm />} />
          <Route path='/teszt' element={<KepTeszt />} />
          <Route path='/rolunk' element={<AboutUs />} />
          <Route path='/kapcsolat' element={<Contact />} />
          <Route path='/elerhetosegek' element={<Contacts />} />
          <Route path='/bolt' element={<Shop />} />
          <Route path='/csomagolasfeltetelek' element={<PackagingTerms />} />
          <Route path='/elfelejtettjelszo' element={<ForgotPassword />} />
        </Routes>
      </MobileLayout>
      <ChatbotWidget />
      <ScrollToTopButton />
    </div>
  );
}

export default MobileApp;
