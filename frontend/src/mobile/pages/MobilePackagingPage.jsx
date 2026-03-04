import './MobilePageBase.css';

function MobilePackagingPage() {
  return (
    <section className='mobile-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Csomagolási feltételek</h2>
        <ul className='mobile-muted mt-2 mb-0'>
          <li>Biztonságos dobozolás</li>
          <li>Rendelési azonosító feltüntetése</li>
          <li>Feladás előtt ellenőrzés</li>
        </ul>
      </div>
    </section>
  );
}

export default MobilePackagingPage;
