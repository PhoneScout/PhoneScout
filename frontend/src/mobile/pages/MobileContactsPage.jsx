import './MobilePageBase.css';

function MobileContactsPage() {
  return (
    <section className='mobile-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Elérhetőségek</h2>
        <p className='mobile-muted mt-2 mb-1'>Email: info@phonescout.hu</p>
        <p className='mobile-muted mb-1'>Telefon: +36 1 555 0000</p>
        <p className='mobile-muted mb-0'>Ügyfélszolgálat: H-P 09:00-17:00</p>
      </div>
    </section>
  );
}

export default MobileContactsPage;
