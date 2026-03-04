import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../mobile-shell.css';

const hiddenBottomNavPaths = ['/bejelentkezes', '/fiokaktivalas', '/elfelejtettjelszo'];

function getMobileTitle(pathname) {
  if (pathname.startsWith('/telefon/')) {
    return 'Telefon részletek';
  }

  const map = {
    '/': 'Főoldal',
    '/szures': 'Keresés',
    '/szerviz': 'Szerviz',
    '/kosar': 'Kosár',
    '/osszehasonlitas': 'Összehasonlítás',
    '/profil': 'Profil',
    '/szervizigenyles': 'Új szervizigény',
    '/bejelentkezes': 'Fiók',
    '/fiokaktivalas': 'Megerősítés',
    '/rolunk': 'Rólunk',
    '/kapcsolat': 'Kapcsolat',
    '/elerhetosegek': 'Elérhetőségek',
    '/bolt': 'Bolt',
    '/csomagolasfeltetelek': 'Csomagolás',
    '/elfelejtettjelszo': 'Jelszó visszaállítás'
  };

  return map[pathname] || 'Oldal';
}

function MobileLayout({ children }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const hideBottomNav = hiddenBottomNavPaths.includes(location.pathname);

  useEffect(() => {
    const getCartCount = () => {
      try {
        const cartRaw = localStorage.getItem('cart');
        if (!cartRaw) {
          setCartCount(0);
          return;
        }

        const cartParsed = JSON.parse(cartRaw);
        if (Array.isArray(cartParsed)) {
          setCartCount(cartParsed.length);
          return;
        }

        if (cartParsed && typeof cartParsed === 'object') {
          const total = Object.values(cartParsed).reduce((sum, value) => {
            const numeric = Number(value);
            return sum + (Number.isFinite(numeric) ? numeric : 0);
          }, 0);
          setCartCount(total);
          return;
        }

        setCartCount(0);
      } catch {
        setCartCount(0);
      }
    };

    getCartCount();
    window.addEventListener('cartUpdated', getCartCount);
    window.addEventListener('storage', getCartCount);

    return () => {
      window.removeEventListener('cartUpdated', getCartCount);
      window.removeEventListener('storage', getCartCount);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className='mobile-app-shell'>
      {isMenuOpen && <button className='mobile-menu-backdrop' onClick={() => setIsMenuOpen(false)} aria-label='Menü bezárása' />}

      <header className='mobile-topbar'>
        <div className='mobile-topbar-content'>
          <button
            className='mobile-menu-button'
            type='button'
            onClick={() => setIsMenuOpen(true)}
            aria-label='Menü megnyitása'
          >
            <i className='bi bi-list'></i>
          </button>

          <Link to='/' className='mobile-topbar-logo'>
            <img src='/images/ImagePhoneScoutLogo.png' alt='PhoneScout logó' />
          </Link>

          <Link to='/' className='mobile-topbar-brand' aria-label='PhoneScout főoldal'>
            <span className='mobile-brand-blue'>Phone</span>
            <span className='mobile-brand-green'>Scout</span>
          </Link>

          <div className='mobile-topbar-title-wrap'>
            <small className='mobile-topbar-subtitle'>Aktuális oldal</small>
            <h1 className='mobile-topbar-title'>{getMobileTitle(location.pathname)}</h1>
          </div>

          <Link to='/szures' className='mobile-topbar-search' aria-label='Keresés'>
            <i className='bi bi-search'></i>
          </Link>

          <Link to='/kosar' className='mobile-topbar-cart' aria-label='Kosár'>
            <i className='bi bi-cart3'></i>
            <span className='mobile-topbar-cart-badge'>{cartCount}</span>
          </Link>
        </div>
      </header>

      <aside className={`mobile-side-menu ${isMenuOpen ? 'mobile-side-menu--open' : ''}`}>
        <div className='mobile-side-menu-header'>
          <strong>Menü</strong>
          <button
            className='mobile-side-menu-close'
            type='button'
            onClick={() => setIsMenuOpen(false)}
            aria-label='Menü bezárása'
          >
            <i className='bi bi-x-lg'></i>
          </button>
        </div>

        <div className='mobile-side-menu-group'>
          <small className='mobile-side-menu-group-title'>Fő navigáció</small>
          <NavLink to='/szures' className='mobile-side-link'>
            <i className='bi bi-phone'></i>
            <span>Minden telefon</span>
          </NavLink>
          <NavLink to='/szerviz' className='mobile-side-link'>
            <i className='bi bi-tools'></i>
            <span>Szerviz</span>
          </NavLink>
          <NavLink to='/osszehasonlitas' className='mobile-side-link'>
            <i className='bi bi-columns-gap'></i>
            <span>Összehasonlítás</span>
          </NavLink>
        </div>

        <div className='mobile-side-menu-group'>
          <small className='mobile-side-menu-group-title'>További oldalak</small>
          <Link to='/' className='mobile-side-link'>
            <i className='bi bi-house-door'></i>
            <span>Főoldal</span>
          </Link>
          <Link to='/szures' className='mobile-side-link'>
            <i className='bi bi-search'></i>
            <span>Szűrés</span>
          </Link>
          <Link to='/bolt' className='mobile-side-link'>
            <i className='bi bi-bag'></i>
            <span>Bolt</span>
          </Link>
          <Link to='/kapcsolat' className='mobile-side-link'>
            <i className='bi bi-chat-dots'></i>
            <span>Kapcsolat</span>
          </Link>
          <Link to='/profil' className='mobile-side-link'>
            <i className='bi bi-person'></i>
            <span>Profil</span>
          </Link>
          <Link to='/kosar' className='mobile-side-link'>
            <i className='bi bi-cart3'></i>
            <span>Kosár</span>
          </Link>
        </div>
      </aside>

      <main className='mobile-main'>{children}</main>

      {!hideBottomNav && (
        <nav className='mobile-bottom-nav'>
          <NavLink to='/' className='mobile-nav-item'>
            <i className='bi bi-house-door'></i>
            <span>Főoldal</span>
          </NavLink>
          <NavLink to='/szures' className='mobile-nav-item'>
            <i className='bi bi-phone'></i>
            <span>Telefonok</span>
          </NavLink>
          <NavLink to='/szerviz' className='mobile-nav-item'>
            <i className='bi bi-tools'></i>
            <span>Szerviz</span>
          </NavLink>
          <NavLink to='/osszehasonlitas' className='mobile-nav-item'>
            <i className='bi bi-columns-gap'></i>
            <span>Összeh.</span>
          </NavLink>
          <NavLink to='/profil' className='mobile-nav-item'>
            <i className='bi bi-person'></i>
            <span>Profil</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}

export default MobileLayout;
