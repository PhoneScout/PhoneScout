import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Home />
      </div>
    </BrowserRouter>
  );
}

export default App;
