import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileCartPage.css';

function MobileCartPage() {
  return (
    <section className='mobile-page mobile-cart-page'>
      <div className='mobile-surface mobile-cart-empty'>
        <i className='bi bi-cart-x'></i>
        <h2 className='mobile-title'>A kosár most üres</h2>
        <p className='mobile-muted'>Nézz körül a boltban, és add hozzá a kedvenc telefonod.</p>
        <Link to='/bolt' className='btn btn-primary'>
          Ugrás a boltra
        </Link>
      </div>
    </section>
  );
}

export default MobileCartPage;
