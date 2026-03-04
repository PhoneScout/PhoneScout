import { useParams } from 'react-router-dom';
import './MobilePageBase.css';
import './MobilePhonePage.css';

function MobilePhonePage() {
  const { phoneId } = useParams();

  return (
    <section className='mobile-page mobile-phone-page'>
      <div className='mobile-surface'>
        <h2 className='mobile-title'>Telefon azonosító: #{phoneId}</h2>
        <p className='mobile-muted mt-2'>Mobilbarát adatlap nézet app-szerű kártyákkal.</p>
      </div>

      <div className='mobile-surface'>
        <div className='mobile-phone-spec'>
          <span>Kijelző</span>
          <strong>6.4" AMOLED</strong>
        </div>
        <div className='mobile-phone-spec'>
          <span>Tárhely</span>
          <strong>128 GB</strong>
        </div>
        <div className='mobile-phone-spec'>
          <span>Kamera</span>
          <strong>50 MP</strong>
        </div>
      </div>
    </section>
  );
}

export default MobilePhonePage;
