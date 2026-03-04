import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileActivationPage.css';

function MobileActivationPage() {
  return (
    <section className='mobile-page mobile-activation-page'>
      <div className='mobile-surface mobile-activation-box'>
        <i className='bi bi-check-circle-fill'></i>
        <h2 className='mobile-title'>Fiók megerősítve</h2>
        <p className='mobile-muted'>A regisztráció sikeres, most már bejelentkezhetsz.</p>
        <Link to='/bejelentkezes' className='btn btn-primary'>
          Tovább a bejelentkezéshez
        </Link>
      </div>
    </section>
  );
}

export default MobileActivationPage;
