import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';

function Page1({ t }) {
  const [activeTab, setActiveTab] = useState('mobile');
  
  const currentTab = t.tab1.tabs[activeTab];

  const getIconName = (tabName, itemIndex) => {
    if (tabName === 'mobile') {
      return itemIndex === 0 ? 'smartphone' : 'gamepad';
    }
    return itemIndex === 0 ? 'users' : 'monitor';
  };

  const stats = activeTab === 'mobile' 
    ? [
        { id: 'stat-mobile-1', number: '5M+', label: 'Active Players' },
        { id: 'stat-mobile-2', number: '50+', label: 'Published Games' },
        { id: 'stat-mobile-3', number: '4.8★', label: 'Average Rating' }
      ]
    : [
        { id: 'stat-pc-1', number: '100K+', label: 'Daily Players' },
        { id: 'stat-pc-2', number: '15+', label: 'AAA Projects' },
        { id: 'stat-pc-3', number: '99%', label: 'Uptime' }
      ];

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-hero">
          <div className="hero-animation gaming-animation">
            <div className="gaming-character char-1">🧙‍♂️</div>
            <div className="gaming-character char-2">🦸‍♀️</div>
            <div className="gaming-character char-3">🤖</div>
            <div className="gaming-character char-4">👨‍🚀</div>
            <div className="gaming-character char-5">🧝‍♀️</div>
            <div className="gaming-character char-6">👾</div>
            <div className="game-effects">
              <div className="effect-icon">⚔️</div>
              <div className="effect-icon">🛡️</div>
              <div className="effect-icon">✨</div>
              <div className="effect-icon">💫</div>
              <div className="effect-icon">🔮</div>
              <div className="effect-icon">⚡</div>
              <div className="effect-icon">🎯</div>
              <div className="effect-icon">💎</div>
            </div>
            <div className="game-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t.tab1.title}</h1>
            <p className="hero-subtitle">{t.tab1.description}</p>
          </div>
        </div>
        
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'mobile' ? 'active' : ''}`}
              onClick={() => setActiveTab('mobile')}
            >
              <span>{t.tab1.tabs.mobile.name}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'pc' ? 'active' : ''}`}
              onClick={() => setActiveTab('pc')}
            >
              <span>{t.tab1.tabs.pc.name}</span>
            </button>
          </div>
          
          <div className="tab-content" key={activeTab}>
            <div className="tab-main-content">
              <div className="tab-header-section">
                <div className="tab-subtitle">{currentTab.subtitle}</div>
                <h2 className="tab-title">{currentTab.name}</h2>
                <p className="tab-description">{currentTab.description}</p>
              </div>

              <div className="tab-visual-section">
                {activeTab === 'mobile' ? (
                  <div className="visual-animation mobile-gaming-visual">
                    <div className="phone-frame">
                      <div className="phone-screen">
                        <div className="game-element">🎮</div>
                        <div className="game-element">⭐</div>
                        <div className="game-element">🏆</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="visual-animation pc-gaming-visual">
                    <div className="monitor-frame">
                      <div className="monitor-screen">
                        <div className="fps-counter">144 FPS</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="tab-features">
                {currentTab.items.map((item, index) => (
                  <div key={`${activeTab}-feature-${index}`} className="feature-card">
                    <div className="feature-icon">
                      <Icon name={getIconName(activeTab, index)} />
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="tab-stats">
                {stats.map((stat) => (
                  <div key={stat.id} className="stat-card">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Page1.propTypes = {
  t: PropTypes.object.isRequired,
};

export default Page1;
