import './MobilePageBase.css';
import './MobileServiceRequestPage.css';

function MobileServiceRequestPage() {
  return (
    <section className='mobile-page mobile-service-request-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Új szervizigény</h2>
        <p className='mobile-muted mt-2'>Töltsd ki az űrlapot, és hamarosan felvesszük veled a kapcsolatot.</p>
        <form className='mobile-service-form mt-3'>
          <input className='form-control' placeholder='Név' />
          <input className='form-control' placeholder='Email' type='email' />
          <textarea className='form-control' rows='4' placeholder='Hibaleírás'></textarea>
          <button type='button' className='btn btn-primary w-100'>
            Igény elküldése
          </button>
        </form>
      </div>
    </section>
  );
}

export default MobileServiceRequestPage;
