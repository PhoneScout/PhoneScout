import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileHomePage.css';

function MobileHomePage() {
  return (
    <section className='mobile-page mobile-home-page'>
      <div className='mobile-surface mobile-home-hero'>
        <p className='mobile-chip mb-2 d-inline-flex'>Új mobil dizájn</p>
        <h2 className='mobile-title'>Telefonok, gyorsan és kényelmesen</h2>
        <p className='mobile-muted mt-2'>
          App-szerű nézetben könnyen szűrhetsz, összehasonlíthatsz és kezelheted a kosarad.
        </p>
        <div className='d-flex gap-2 mt-3'>
          <Link to='/szures' className='btn btn-primary btn-sm'>
            Keresés indítása
          </Link>
          <Link to='/bolt' className='btn btn-outline-primary btn-sm'>
            Bolt
          </Link>
        </div>
      </div>

      <div className='mobile-surface'>
        <h3 className='mobile-title mb-3'>Gyors műveletek</h3>
        <div className='mobile-home-grid'>
          <Link to='/szerviz' className='mobile-home-action'>
            <i className='bi bi-tools'></i>
            <span>Szerviz</span>
          </Link>
          <Link to='/kosar' className='mobile-home-action'>
            <i className='bi bi-cart3'></i>
            <span>Kosár</span>
          </Link>
          <Link to='/osszehasonlitas' className='mobile-home-action'>
            <i className='bi bi-columns-gap'></i>
            <span>Összehasonlítás</span>
          </Link>
          <Link to='/profil' className='mobile-home-action'>
            <i className='bi bi-person'></i>
            <span>Profil</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MobileHomePage;
