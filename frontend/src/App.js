import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FilterPage from './pages/FilterPage';
import Service from './pages/Service';
import Cart from './pages/Cart';
import Compare from './pages/Compare';

function App() {
  return (

    <div className="App">

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/szures' element={<FilterPage />} ></Route>
        <Route path='/szerviz' element={<Service />}></Route>
        <Route path='/kosar' element={<Cart/>}></Route>
        <Route path='/osszehasonlitas' element={<Compare/>}></Route>
      </Routes>
    </div>


  );
}

export default App;
