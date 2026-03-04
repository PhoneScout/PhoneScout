import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileShopPage.css';

function MobileShopPage() {
  return (
    <section className='mobile-page mobile-shop-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Bolt</h2>
        <p className='mobile-muted mt-2'>Kiemelt ajánlatok mobilra optimalizált kártyákban.</p>
      </div>

      <div className='mobile-shop-grid'>
        <Link to='/telefon/1' className='mobile-surface mobile-shop-item text-decoration-none'>
          <strong>Galaxy S sorozat</strong>
          <p className='mobile-muted mb-0'>Erős teljesítmény, szép kijelző.</p>
        </Link>
        <Link to='/telefon/2' className='mobile-surface mobile-shop-item text-decoration-none'>
          <strong>iPhone modell</strong>
          <p className='mobile-muted mb-0'>Letisztult rendszer, jó kamera.</p>
        </Link>
      </div>
    </section>
  );
}

export default MobileShopPage;
