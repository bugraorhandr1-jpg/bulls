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
        <div className="floating-element element-7">💻</div>
        <div className="floating-element element-8">🎨</div>
        <div className="floating-element element-9">⚙️</div>
        <div className="floating-element element-10">🌟</div>
        
        <div className="hero-particles">
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
        </div>
        
        <div className="hero-people-avatars">
          <div className="hero-avatar av-1">👨‍💼</div>
          <div className="hero-avatar av-2">👩‍🎤</div>
          <div className="hero-avatar av-3">🧑‍🎨</div>
          <div className="hero-avatar av-4">👨‍💻</div>
          <div className="hero-avatar av-5">👩‍🚀</div>
          <div className="hero-avatar av-6">🧑‍🎤</div>
        </div>
        
        <div className="hero-tech-icons">
          <div className="tech-icon ti-1">🤖</div>
          <div className="tech-icon ti-2">⚡</div>
          <div className="tech-icon ti-3">🎯</div>
          <div className="tech-icon ti-4">🔥</div>
          <div className="tech-icon ti-5">💎</div>
          <div className="tech-icon ti-6">✨</div>
        </div>
        
        <div className="hero-gradient-orb orb-1"></div>
        <div className="hero-gradient-orb orb-2"></div>
        <div className="hero-gradient-orb orb-3"></div>
        <div className="hero-gradient-orb orb-4"></div>
        
        <div className="hero-rings">
          <div className="rotating-ring ring-1"></div>
          <div className="rotating-ring ring-2"></div>
          <div className="rotating-ring ring-3"></div>
        </div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">🏆</span>
          <span className="badge-text">Award Winning Studio</span>
        </div>
        
        <h1 className="hero-title-animated">{t.hero.title}</h1>
        <p className="hero-subtitle-animated">{t.hero.subtitle}</p>
        
        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="hero-stat-item">
            <div className="stat-number">50M+</div>
            <div className="stat-label">Users</div>
          </div>
          <div className="hero-stat-item">
            <div className="stat-number">30+</div>
            <div className="stat-label">Countries</div>
          </div>
        </div>
        
        <div className="hero-features">
          <div className="hero-feature-item">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🎮</span>
              <div className="icon-glow"></div>
            </div>
            <span className="feature-text">{t.hero.feature1}</span>
          </div>
          <div className="hero-feature-item">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📸</span>
              <div className="icon-glow"></div>
            </div>
            <span className="feature-text">{t.hero.feature2}</span>
          </div>
          <div className="hero-feature-item">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🎯</span>
              <div className="icon-glow"></div>
            </div>
            <span className="feature-text">{t.hero.feature3}</span>
          </div>
        </div>
        
        <Link to="/gaming">
          <button className="cta-button-enhanced">
            <span className="button-content">
              {t.hero.cta}
              <span className="button-arrow">→</span>
            </span>
            <div className="button-shine"></div>
          </button>
        </Link>
        
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <div className="scroll-text">Scroll Down</div>
          <div className="scroll-arrow">↓</div>
        </div>
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
