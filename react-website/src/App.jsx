import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Page1 from './pages/Page1';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import { translations } from './translations';

function App() {
  const [currentLang, setCurrentLang] = useState('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
  };

  const t = translations[currentLang];

  return (
    <Router>
      <div className="app">
        <Header t={t} currentLang={currentLang} onLanguageChange={handleLanguageChange} />
        
      <Routes>
        <Route path="/" element={<Hero t={t} />} />
        <Route path="/gaming" element={<Page1 t={t} />} />
        <Route path="/advertising" element={<Page3 t={t} />} />
        <Route path="/about" element={<Page4 t={t} />} />
      </Routes>        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;
