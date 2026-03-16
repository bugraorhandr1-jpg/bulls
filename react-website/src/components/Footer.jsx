import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import bullLogo from '../assets/img/ChatGPT Image 2 Ara 2025 14_59_01.png';
import ShaderBG from './ShaderBG';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function Footer({ t }) {
  const location = useLocation();
  const thermalRoutes = ['/thermal', '/spells', '/showcase', '/particle', '/hero', '/mobile', '/digital-house', '/landing'];
  const isThermalContext = thermalRoutes.includes(location.pathname);
  const isSpells = location.pathname === '/spells';

  return (
    <footer className={`${isThermalContext ? 'footer-thermal' : ''} ${isSpells ? 'footer-spells' : ''}`}>
      {isSpells && <ShaderBG />}
      <div className="footer-gradient"></div>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">
              <div className="logo-smoke-wrap">
                <motion.img
                  src={bullLogo}
                  alt="Bulls Logo"
                  className="footer-bull-logo"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="smoke smoke-l1"></span>
                <span className="smoke smoke-l2"></span>
                <span className="smoke smoke-r1"></span>
                <span className="smoke smoke-r2"></span>
                <span className="smoke-hot hot-1"></span>
                <span className="smoke-hot hot-2"></span>
              </div>
              <span className="logo-text">Bulls Digital Studio</span>
            </h2>
            <p className="footer-tagline">{t.footer.aboutText}</p>
            <div className="footer-social">
              {[
                {
                  label: 'Facebook',
                  href: 'https://facebook.com',
                  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                },
                {
                  label: 'Twitter',
                  href: 'https://twitter.com',
                  path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
                },
                {
                  label: 'Instagram',
                  href: 'https://instagram.com',
                  path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
                },
                {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com',
                  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
                {
                  label: 'Behance',
                  href: 'https://behance.net',
                  path: 'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z',
                },
                {
                  label: 'Dribbble',
                  href: 'https://dribbble.com',
                  path: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zm7.56-7.872c.282.386 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-2.13-1.9-4.93-3.058-8.01-3.058-.39 0-.78.03-1.18.076zm10.02 4.476c-.218.3-1.91 2.533-5.724 4.073.236.484.46.976.67 1.473.073.17.14.34.204.51 3.39-.43 6.75.26 7.09.33-.02-2.42-.88-4.64-2.24-6.39z',
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.label}
                  whileHover={{ y: -4, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>{t.footer.services || 'Services'}</h4>
              <ul>
                <li><a href="/gaming">Game Development</a></li>
                <li><a href="/advertising">Digital Marketing</a></li>
                <li><a href="/studio">Studio</a></li>
                <li><a href="/about">Consulting</a></li>
                <li><a href="/coming-soon">Coming Soon</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{t.footer.company || 'Company'}</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/about">Our Team</a></li>
                <li><a href="/about">Careers</a></li>
                <li><a href="/about">Contact</a></li>
                <li><a href="/404-test">404 Page</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{t.footer.contact}</h4>
              <ul className="contact-info">
                <li>
                  <span className="contact-icon">📧</span>
                  <a href="mailto:info@bullsdigital.com">info@bullsdigital.com</a>
                </li>
                <li>
                  <span className="contact-icon">📱</span>
                  <a href="tel:+905551234567">+90 555 123 45 67</a>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <span>Istanbul, Turkey</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footer.copyright}</p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  t: PropTypes.shape({
    footer: PropTypes.shape({
      aboutText: PropTypes.string,
      services: PropTypes.string,
      company: PropTypes.string,
      contact: PropTypes.string,
      copyright: PropTypes.string,
    }),
  }).isRequired,
};

export default Footer;
