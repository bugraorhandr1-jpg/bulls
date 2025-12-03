import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Hero({ t }) {
  return (
    <section className="hero">
      <div className="hero-animation-bg">
        <div className="floating-element element-1">🎮</div>
        <div className="floating-element element-2">📱</div>
        <div className="floating-element element-3">📊</div>
        <div className="floating-element element-4">🚀</div>
        <div className="floating-element element-5">⭐</div>
        <div className="floating-element element-6">💡</div>
        <div className="hero-people-avatars">
          <div className="hero-avatar av-1">👨‍💼</div>
          <div className="hero-avatar av-2">👩‍🎤</div>
          <div className="hero-avatar av-3">🧑‍🎨</div>
          <div className="hero-avatar av-4">👨‍💻</div>
        </div>
        <div className="hero-tech-icons">
          <div className="tech-icon">🤖</div>
          <div className="tech-icon">⚡</div>
          <div className="tech-icon">🎯</div>
          <div className="tech-icon">🔥</div>
        </div>
        <div className="hero-gradient-orb orb-1"></div>
        <div className="hero-gradient-orb orb-2"></div>
        <div className="hero-gradient-orb orb-3"></div>
      </div>
      <div className="hero-content">
        <h1>{t.hero.title}</h1>
        <p>{t.hero.subtitle}</p>
        <div className="hero-features">
          <div className="hero-feature-item">
            <span className="feature-icon">🎮</span>
            <span className="feature-text">{t.hero.feature1}</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">📸</span>
            <span className="feature-text">{t.hero.feature2}</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">{t.hero.feature3}</span>
          </div>
        </div>
        <Link to="/gaming">
          <button className="cta-button">
            {t.hero.cta}
            <span className="button-arrow">→</span>
          </button>
        </Link>
      </div>
    </section>
  );
}

Hero.propTypes = {
  t: PropTypes.shape({
    hero: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      cta: PropTypes.string,
      feature1: PropTypes.string,
      feature2: PropTypes.string,
      feature3: PropTypes.string,
    }),
  }).isRequired,
};

export default Hero;
