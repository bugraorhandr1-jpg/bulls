import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/img/ChatGPT Image 2 Ara 2025 14_59_01.png';

function Header({ t, currentLang, onLanguageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <nav className="navbar">
        <Link to="/" className="logo">
          <div className="logo-container">
            <img src={logo} alt="Bulls Logo" className="bull-logo" />
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
    }),
  }).isRequired,
  currentLang: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

export default Header;
