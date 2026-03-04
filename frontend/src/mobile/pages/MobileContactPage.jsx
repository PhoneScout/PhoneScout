import './MobilePageBase.css';

function MobileContactPage() {
  return (
    <section className='mobile-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Kapcsolatfelvétel</h2>
        <form className='d-flex flex-column gap-2 mt-3'>
          <input className='form-control' placeholder='Név' />
          <input className='form-control' placeholder='Email' type='email' />
          <textarea className='form-control' rows='4' placeholder='Üzenet'></textarea>
          <button type='button' className='btn btn-primary'>
            Üzenet küldése
          </button>
        </form>
      </div>
    </section>
  );
}

export default MobileContactPage;
