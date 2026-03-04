import { Link } from 'react-router-dom';
import './MobilePageBase.css';
import './MobileLoginPage.css';

function MobileLoginPage() {
  return (
    <section className='mobile-page mobile-login-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Belépés</h2>
        <form className='mobile-login-form mt-3'>
          <input type='email' className='form-control' placeholder='Email' />
          <input type='password' className='form-control' placeholder='Jelszó' />
          <button type='button' className='btn btn-primary w-100'>
            Bejelentkezés
          </button>
        </form>
        <Link to='/elfelejtettjelszo' className='mobile-login-link mt-3 d-inline-block'>
          Elfelejtett jelszó?
        </Link>
      </div>
    </section>
  );
}

export default MobileLoginPage;
