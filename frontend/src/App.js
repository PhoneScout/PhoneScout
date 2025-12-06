import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import FilterPage from './pages/FilterPage';
import Service from './pages/Service';
import Cart from './pages/Cart';
import Compare from './pages/Compare';
import PhonePage from './pages/PhonePage';

function App() {
  return (

    <div className="App">

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/szures' element={<FilterPage />} ></Route>
        <Route path='/szerviz' element={<Service />}></Route>
        <Route path='/kosar' element={<Cart />}></Route>
        <Route path='/osszehasonlitas' element={<Compare />}></Route>
        <Route path="/telefon/:phoneId" element={<PhonePage />} />

      </Routes>
    </div>


  );
}

export default App;
