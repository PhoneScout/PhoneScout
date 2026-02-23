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



function App() {

  const location = useLocation();
  const excludeLayout = ['/bejelentkezes', '/fiokaktivalas'];
  const shouldShowLayout = !excludeLayout.includes(location.pathname);

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

      </Routes>

      {shouldShowLayout && <Footer />}

      <ChatbotWidget />

    </div>


  );
}

export default App;
