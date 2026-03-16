import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/img/ChatGPT Image 2 Ara 2025 14_59_01.png';

function Header({ t, currentLang, onLanguageChange, isHome }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const thermalRoutes = ['/thermal', '/spells', '/showcase', '/particle', '/hero', '/mobile', '/digital-house', '/landing'];
  const isThermalContext = thermalRoutes.includes(location.pathname);
  const isSpells = location.pathname === '/spells';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 0);

      if (currentY > lastScrollY.current && currentY > 80) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={[
        scrolled ? 'scrolled' : '',
        !headerVisible ? 'header-hidden' : '',
        isHome ? 'header-home' : '',
        isHome && !scrolled ? 'header-transparent' : '',
        isThermalContext ? 'header-thermal' : '',
        isSpells ? 'header-spells' : '',
      ].filter(Boolean).join(' ')}
    >
      <nav className="navbar">
        <Link to="/" className="logo">
          <div className="logo-container">
            <div className="logo-smoke-wrap">
              <img src={logo} alt="Bulls Logo" className="bull-logo" />
              <span className="smoke smoke-l1"></span>
              <span className="smoke smoke-l2"></span>
              <span className="smoke smoke-l3"></span>
              <span className="smoke smoke-r1"></span>
              <span className="smoke smoke-r2"></span>
              <span className="smoke smoke-r3"></span>
              <span className="smoke-hot hot-1"></span>
              <span className="smoke-hot hot-2"></span>
            </div>
            <h1>{t.logo}</h1>
          </div>
        </Link>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/gaming" 
              className={isActive('/gaming') ? 'active' : ''}
            >
              {t.nav.tab1}
            </Link>
          </li>
          <li>
            <Link 
              to="/advertising" 
              className={isActive('/advertising') ? 'active' : ''}
            >
              {t.nav.tab3}
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
            >
              {t.nav.tab4}
            </Link>
          </li>
          <li>
            <Link 
              to="/landing" 
              className={isActive('/landing') ? 'active' : ''}
            >
              {t.nav.tab5}
            </Link>
          </li>
          <li>
            <Link 
              to="/thermal" 
              className={isActive('/thermal') ? 'active' : ''}
            >
              {t.nav.tab7}
            </Link>
          </li>
          <li>
            <Link 
              to="/studio" 
              className={isActive('/studio') ? 'active' : ''}
            >
              {t.nav.tab8}
            </Link>
          </li>
          <li>
            <Link 
              to="/digital-house" 
              className={isActive('/digital-house') ? 'active' : ''}
            >
              {t.nav.tab9}
            </Link>
          </li>
          <li>
            <Link 
              to="/mobile" 
              className={isActive('/mobile') ? 'active' : ''}
            >
              {t.nav.tab10}
            </Link>
          </li>
          <li>
            <Link 
              to="/showcase" 
              className={isActive('/showcase') ? 'active' : ''}
            >
              {t.nav.tab11}
            </Link>
          </li>
          <li>
            <Link 
              to="/particle" 
              className={isActive('/particle') ? 'active' : ''}
            >
              {t.nav.tab12}
            </Link>
          </li>
          <li>
            <Link 
              to="/hero" 
              className={isActive('/hero') ? 'active' : ''}
            >
              {t.nav.tab13}
            </Link>
          </li>
          <li>
            <Link 
              to="/spells" 
              className={isActive('/spells') ? 'active' : ''}
            >
              {t.nav.tab14}
            </Link>
          </li>
        </ul>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
          
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}

Header.propTypes = {
  t: PropTypes.shape({
    logo: PropTypes.string,
    nav: PropTypes.shape({
      tab1: PropTypes.string,
      tab2: PropTypes.string,
      tab3: PropTypes.string,
      tab4: PropTypes.string,
      tab5: PropTypes.string,
      tab6: PropTypes.string,
      tab7: PropTypes.string,
      tab8: PropTypes.string,
      tab9: PropTypes.string,
      tab10: PropTypes.string,
      tab11: PropTypes.string,
      tab12: PropTypes.string,
      tab13: PropTypes.string,
      tab14: PropTypes.string,
    }),
  }).isRequired,
  currentLang: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  isHome: PropTypes.bool,
};

export default Header;
