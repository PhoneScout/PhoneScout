import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileServicePage.css';

function MobileServicePage() {
  return (
    <section className='mobile-page mobile-service-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Szerviz központ</h2>
        <p className='mobile-muted mt-2'>Kérj gyors bevizsgálást vagy javítást pár lépésben.</p>
      </div>

      <div className='mobile-surface mobile-service-list'>
        <div className='mobile-service-item'>
          <i className='bi bi-phone'></i>
          <div>
            <strong>Kijelző csere</strong>
            <p className='mobile-muted mb-0'>Gyors, gyári minőségű alkatrésszel.</p>
          </div>
        </div>
        <div className='mobile-service-item'>
          <i className='bi bi-battery-charging'></i>
          <div>
            <strong>Akkumulátor csere</strong>
            <p className='mobile-muted mb-0'>Rövid átfutási idővel.</p>
          </div>
        </div>
        <Link to='/szervizigenyles' className='btn btn-primary w-100 mt-2'>
          Szervizigénylés indítása
        </Link>
      </div>
    </section>
  );
}

export default MobileServicePage;
