import './MobilePageBase.css';

function MobileForgotPasswordPage() {
  return (
    <section className='mobile-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Elfelejtett jelszó</h2>
        <p className='mobile-muted mt-2'>Add meg az emailed, és küldünk visszaállítási linket.</p>
        <div className='d-flex flex-column gap-2 mt-3'>
          <input className='form-control' type='email' placeholder='Email cím' />
          <button type='button' className='btn btn-primary'>
            Link küldése
          </button>
        </div>
      </div>
    </section>
  );
}

export default MobileForgotPasswordPage;
