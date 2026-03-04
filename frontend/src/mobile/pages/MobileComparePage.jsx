import './MobilePageBase.css';
import './MobileComparePage.css';

function MobileComparePage() {
  return (
    <section className='mobile-page mobile-compare-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Összehasonlítás</h2>
        <p className='mobile-muted mt-2'>Válassz ki telefonokat és hasonlítsd össze a fő paramétereiket.</p>
      </div>

      <div className='mobile-surface'>
        <div className='mobile-compare-grid'>
          <div className='mobile-compare-box'>Model A</div>
          <div className='mobile-compare-box'>Model B</div>
        </div>
      </div>
    </section>
  );
}

export default MobileComparePage;
