import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileProfilePage.css';

function MobileProfilePage() {
  return (
    <section className='mobile-page mobile-profile-page'>
      <div className='mobile-surface mobile-profile-card'>
        <div className='mobile-profile-avatar'>KM</div>
        <div>
          <h2 className='mobile-title mb-1'>Saját fiók</h2>
          <p className='mobile-muted mb-0'>Kezeld adataidat és rendeléseidet.</p>
        </div>
      </div>

      <div className='mobile-surface'>
        <Link to='/bejelentkezes' className='btn btn-primary w-100'>
          Bejelentkezés
        </Link>
      </div>
    </section>
  );
}

export default MobileProfilePage;
