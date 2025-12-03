import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';

function Page3({ t }) {
  const [activeTab, setActiveTab] = useState('digital');
  
  const currentTab = t.tab3.tabs[activeTab];

  const getIconName = (tabName, itemIndex) => {
    if (tabName === 'digital') {
      return itemIndex === 0 ? 'megaphone' : 'chart';
    }
    return itemIndex === 0 ? 'video' : 'trending';
  };

  const stats = activeTab === 'digital' 
    ? [
        { id: 'stat-digital-1', number: '$50M+', label: 'Ad Spend' },
        { id: 'stat-digital-2', number: '300%', label: 'Avg ROI' },
        { id: 'stat-digital-3', number: '200+', label: 'Campaigns' }
      ]
    : [
        { id: 'stat-content-1', number: '10K+', label: 'Content Pieces' },
        { id: 'stat-content-2', number: '100M+', label: 'Views' },
        { id: 'stat-content-3', number: '500+', label: 'Influencers' }
      ];

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-hero">
          <div className="hero-animation influencer-animation">
            <div className="influencer-avatars">
              <div className="inf-avatar avatar-1">👩‍🎤</div>
              <div className="inf-avatar avatar-2">🧔‍♂️</div>
              <div className="inf-avatar avatar-3">👱‍♀️</div>
              <div className="inf-avatar avatar-4">🧑‍🎨</div>
              <div className="inf-avatar avatar-5">👨‍💼</div>
              <div className="inf-avatar avatar-6">👨‍🚀</div>
              <div className="inf-avatar avatar-7">👩‍💻</div>
              <div className="inf-avatar avatar-8">🧑‍🎤</div>
            </div>
            <div className="social-reactions">
              <div className="reaction">❤️</div>
              <div className="reaction">🔥</div>
              <div className="reaction">👍</div>
              <div className="reaction">😍</div>
              <div className="reaction">🎉</div>
              <div className="reaction">✨</div>
              <div className="reaction">💯</div>
              <div className="reaction">🚀</div>
            </div>
            <div className="social-icons-float">
              <div className="social-icon-float">📱</div>
              <div className="social-icon-float">💬</div>
              <div className="social-icon-float">📸</div>
              <div className="social-icon-float">🎥</div>
              <div className="social-icon-float">📊</div>
              <div className="social-icon-float">🎯</div>
            </div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t.tab3.title}</h1>
            <p className="hero-subtitle">{t.tab3.description}</p>
          </div>
        </div>
        
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'digital' ? 'active' : ''}`}
              onClick={() => setActiveTab('digital')}
            >
              <span>{t.tab3.tabs.digital.name}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <span>{t.tab3.tabs.content.name}</span>
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
                {activeTab === 'digital' ? (
                  <div className="visual-animation influencer-visual">
                    <div className="influencer-network">
                      <div className="network-center">🌟</div>
                      <div className="network-node">👨‍💼</div>
                      <div className="network-node">👩‍🎤</div>
                      <div className="network-node">🧑‍🎨</div>
                      <div className="network-node">👩‍💻</div>
                      <div className="network-node">🧔‍♂️</div>
                      <div className="network-node">👱‍♀️</div>
                      <div className="network-line"></div>
                      <div className="network-line"></div>
                      <div className="network-line"></div>
                    </div>
                    <div className="ai-avatar-grid">
                      <div className="avatar-card">👨‍💼</div>
                      <div className="avatar-card">👩‍🎤</div>
                      <div className="avatar-card">🧑‍🎨</div>
                      <div className="avatar-card">👩‍💻</div>
                      <div className="avatar-card">🧔‍♂️</div>
                      <div className="avatar-card">👱‍♀️</div>
                      <div className="avatar-card">👨‍🚀</div>
                      <div className="avatar-card">🧑‍🎤</div>
                    </div>
                    <div className="ai-tools-banner">
                      <span className="ai-badge">🤖 AI-Powered</span>
                      <span className="ai-badge">📊 Analytics</span>
                      <span className="ai-badge">🎯 Targeting</span>
                      <span className="ai-badge">🚀 Growth</span>
                    </div>
                    <div className="social-stats-overlay">
                      <div className="stat-bubble">📸 50K Posts</div>
                      <div className="stat-bubble">❤️ 10M Likes</div>
                      <div className="stat-bubble">💬 500K Comments</div>
                      <div className="stat-bubble">👥 2M Followers</div>
                    </div>
                  </div>
                ) : (
                  <div className="visual-animation content-visual">
                    <div className="content-creator-scene">
                      <div className="creator-avatar">🎬</div>
                      <div className="video-grid">
                        <div className="mini-video">📹</div>
                        <div className="mini-video">🎥</div>
                        <div className="mini-video">📸</div>
                        <div className="mini-video">🎞️</div>
                        <div className="mini-video">📺</div>
                        <div className="mini-video">🎪</div>
                      </div>
                      <div className="content-tools">
                        <div className="tool-icon">✂️</div>
                        <div className="tool-icon">🎨</div>
                        <div className="tool-icon">🎵</div>
                        <div className="tool-icon">💡</div>
                      </div>
                      <div className="engagement-metrics">
                        <div className="metric-bar">
                          <span>👁️ Views</span>
                          <div className="progress-bar"><div className="progress-fill" style={{width: '90%'}}>10M</div></div>
                        </div>
                        <div className="metric-bar">
                          <span>💖 Engagement</span>
                          <div className="progress-bar"><div className="progress-fill" style={{width: '75%'}}>7.5M</div></div>
                        </div>
                        <div className="metric-bar">
                          <span>🔄 Shares</span>
                          <div className="progress-bar"><div className="progress-fill" style={{width: '60%'}}>2.5M</div></div>
                        </div>
                        <div className="metric-bar">
                          <span>💬 Comments</span>
                          <div className="progress-bar"><div className="progress-fill" style={{width: '85%'}}>8.5M</div></div>
                        </div>
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
        
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <div className="scroll-text">Scroll Down</div>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </section>
  );
}

Page3.propTypes = {
  t: PropTypes.object.isRequired,
};

export default Page3;
