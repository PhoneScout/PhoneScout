import './MobilePageBase.css';
import './MobileFilterPage.css';

function MobileFilterPage() {
  return (
    <section className='mobile-page mobile-filter-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Gyors szűrő</h2>
        <p className='mobile-muted mt-2'>Állítsd be a fő szempontokat, és mutatjuk a legjobb találatokat.</p>
        <label className='form-label mt-3 mb-1'>Árkeret</label>
        <input className='form-range' type='range' min='50000' max='600000' defaultValue='250000' />
        <label className='form-label mt-2 mb-1'>Kijelző méret</label>
        <select className='form-select'>
          <option>Kicsi (5.5" alatt)</option>
          <option>Közepes (6.1" körül)</option>
          <option>Nagy (6.5" fölött)</option>
        </select>
      </div>

      <div className='mobile-surface'>
        <h3 className='mobile-title mb-3'>Népszerű szűrők</h3>
        <div className='mobile-filter-tags'>
          <button type='button' className='btn btn-outline-primary btn-sm'>5G</button>
          <button type='button' className='btn btn-outline-primary btn-sm'>128 GB+</button>
          <button type='button' className='btn btn-outline-primary btn-sm'>Jó kamera</button>
          <button type='button' className='btn btn-outline-primary btn-sm'>Gyors töltés</button>
        </div>
      </div>
    </section>
  );
}

export default MobileFilterPage;
