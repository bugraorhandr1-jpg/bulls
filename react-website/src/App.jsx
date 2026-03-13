import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Page1 from './pages/Page1';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page6 from './pages/Page6';
import Page7 from './pages/Page7';
import Page8 from './pages/Page8';
import Page9 from './pages/Page9';
import Page10 from './pages/Page10';
import Page11 from './pages/Page11';
import Page12 from './pages/Page12';
import Page13 from './pages/Page13';
import Page14 from './pages/Page14';
import NotFound from './pages/NotFound';
import ComingSoon from './pages/ComingSoon';
import Lanyard from './pages/deneme';
import { translations } from './translations';

function AppContent() {
  const [currentLang, setCurrentLang] = useState('tr');
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSpecialPage = ['/coming-soon', '/deneme'].includes(location.pathname);
  const isNotFound = ![
    '/', '/gaming', '/advertising', '/about', '/landing', '/thermal',
    '/studio', '/digital-house', '/mobile', '/showcase', '/particle',
    '/hero', '/spells', '/coming-soon', '/deneme'
  ].includes(location.pathname);
  const hideChrome = isSpecialPage || isNotFound;

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
    <div className={`app ${isHome ? 'home-page' : ''}`}>
      {!hideChrome && <Header t={t} currentLang={currentLang} onLanguageChange={handleLanguageChange} isHome={isHome} />}
      
      <Routes>
        <Route path="/" element={<Page6 t={t} />} />
        <Route path="/gaming" element={<Page1 t={t} />} />
        <Route path="/advertising" element={<Page3 t={t} />} />
        <Route path="/about" element={<Page4 t={t} />} />
        <Route path="/landing" element={<Page5 />} />
        <Route path="/thermal" element={<Page7 t={t} />} />
        <Route path="/studio" element={<Page8 t={t} />} />
        <Route path="/digital-house" element={<Page9 t={t} />} />
        <Route path="/mobile" element={<Page10 t={t} />} />
        <Route path="/showcase" element={<Page11 t={t} />} />
        <Route path="/particle" element={<Page12 t={t} />} />
        <Route path="/hero" element={<Page13 t={t} />} />
        <Route path="/spells" element={<Page14 />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/deneme" element={<div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#060402', overflow: 'hidden' }}><Lanyard /></div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isHome && !hideChrome && <Footer t={t} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
