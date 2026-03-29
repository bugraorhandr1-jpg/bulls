import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalCursor from './components/GlobalCursor';
import { translations } from './translations';

const Page1 = lazy(() => import('./pages/Page1'));
const Page3 = lazy(() => import('./pages/Page3'));
const Page4 = lazy(() => import('./pages/Page4'));
const Page5 = lazy(() => import('./pages/Page5'));
const Page7 = lazy(() => import('./pages/Page7'));
const Page14 = lazy(() => import('./pages/Page14'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Lanyard = lazy(() => import('./pages/deneme'));

function RouteFallback() {
  return (
    <div
      className="bg-theme-tech"
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg-theme-core)',
        color: '#8a8177',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Loading content...
    </div>
  );
}

function AppContent() {
  const [currentLang, setCurrentLang] = useState('tr');
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSpecialPage = ['/coming-soon', '/deneme'].includes(location.pathname);
  const isNotFound = ![
    '/', '/gaming', '/advertising', '/about', '/landing', '/thermal',
    '/spells', '/coming-soon', '/deneme'
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
      <GlobalCursor />
      {!hideChrome && <Header t={t} currentLang={currentLang} onLanguageChange={handleLanguageChange} isHome={isHome} />}
      
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Page14 />} />
          <Route path="/gaming" element={<Page1 t={t} />} />
          <Route path="/advertising" element={<Page3 t={t} />} />
          <Route path="/about" element={<Page4 t={t} />} />
          <Route path="/landing" element={<Page5 />} />
          <Route path="/thermal" element={<Page7 t={t} />} />
          <Route path="/spells" element={<Page14 />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route
            path="/deneme"
            element={(
              <div
                className="bg-theme-tech"
                style={{
                  '--bg-theme-glow-strength': 0.52,
                  position: 'relative',
                  width: '100vw',
                  height: '100vh',
                  background: 'var(--bg-theme-core)',
                  overflow: 'hidden',
                }}
              >
                <div className="bg-layer-glow" />
                <Lanyard />
              </div>
            )}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
