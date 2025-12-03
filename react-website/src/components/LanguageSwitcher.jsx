import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function LanguageSwitcher({ currentLang, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className="lang-current"
        onClick={() => setIsOpen(!isOpen)}
        title={currentLang === 'tr' ? 'Türkçe' : 'EN'}
      >
        <span className="lang-flag">{currentLang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
        <span className="lang-text">{currentLang === 'tr' ? 'TR' : 'EN'}</span>
        <span className={`lang-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="lang-dropdown">
          <button 
            className={`lang-option ${currentLang === 'tr' ? 'active' : ''}`}
            onClick={() => handleLanguageSelect('tr')}
            title="Türkçe"
          >
            <span className="lang-flag">🇹🇷</span>
          </button>
          <button 
            className={`lang-option ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageSelect('en')}
            title="EN"
          >
            <span className="lang-flag">🇬🇧</span>
          </button>
        </div>
      )}
    </div>
  );
}

LanguageSwitcher.propTypes = {
  currentLang: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

export default LanguageSwitcher;
