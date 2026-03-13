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
        <div className="page-hero gaming-page-hero">
          {/* Animated Background - Energy Lines */}
          <div className="gaming-energy-bg">
            <div className="energy-line el-1"></div>
            <div className="energy-line el-2"></div>
            <div className="energy-line el-3"></div>
            <div className="energy-line el-4"></div>
            <div className="energy-line el-5"></div>
            <div className="energy-pulse ep-1"></div>
            <div className="energy-pulse ep-2"></div>
            <div className="energy-pulse ep-3"></div>
          </div>
          <div className="hero-animation gaming-animation">
            {/* Animated game controller SVG */}
            <div className="gaming-controller-anim">
              <svg className="controller-svg" viewBox="0 0 120 80" fill="none">
                <rect x="10" y="15" width="100" height="50" rx="25" stroke="currentColor" strokeWidth="2"/>
                <circle cx="35" cy="40" r="8" stroke="currentColor" strokeWidth="2" className="ctrl-dpad"/>
                <circle cx="85" cy="40" r="4" fill="currentColor" className="ctrl-btn ctrl-btn-1"/>
                <circle cx="95" cy="30" r="4" fill="currentColor" className="ctrl-btn ctrl-btn-2"/>
                <circle cx="75" cy="30" r="4" fill="currentColor" className="ctrl-btn ctrl-btn-3"/>
                <circle cx="85" cy="20" r="4" fill="currentColor" className="ctrl-btn ctrl-btn-4"/>
                <path d="M10 35 Q0 40 10 45" stroke="currentColor" strokeWidth="2" className="ctrl-grip"/>
                <path d="M110 35 Q120 40 110 45" stroke="currentColor" strokeWidth="2" className="ctrl-grip"/>
              </svg>
              <div className="controller-glow"></div>
            </div>
            {/* Floating game icons */}
            <div className="game-float-icons">
              <svg className="gf-icon gf-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <svg className="gf-icon gf-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <svg className="gf-icon gf-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <svg className="gf-icon gf-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
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
                        <div className="game-ui">
                          <div className="ui-health">HP: 100</div>
                          <div className="ui-score">Score: 2,450</div>
                          <div className="ui-level">Level 15</div>
                        </div>
                      </div>
                    </div>
                    <div className="mobile-stats">
                      <div className="mini-stat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>
                        iOS & Android
                      </div>
                      <div className="mini-stat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        60 FPS
                      </div>
                      <div className="mini-stat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>
                        Touch Controls
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="visual-animation pc-gaming-visual">
                    <div className="monitor-frame">
                      <div className="monitor-screen">
                        <div className="fps-counter">144 FPS</div>
                        <div className="game-hud">
                          <div className="hud-element">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
                            Crosshair
                          </div>
                          <div className="hud-element">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                            Minimap
                          </div>
                          <div className="hud-element">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                            Team Chat
                          </div>
                        </div>
                        <div className="pc-effects">
                          <div className="ray-trace">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Ray Tracing
                          </div>
                          <div className="ultra-hd">4K Ultra HD</div>
                        </div>
                      </div>
                    </div>
                    <div className="pc-peripherals">
                      <div className="peripheral">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="12" rx="2"/><path d="M6 20h12M12 16v4"/></svg>
                        Keyboard
                      </div>
                      <div className="peripheral">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="2" width="12" height="18" rx="6"/><path d="M12 6v4"/></svg>
                        Mouse
                      </div>
                      <div className="peripheral">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
                        Headset
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
