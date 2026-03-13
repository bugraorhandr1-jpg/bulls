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
        { id: 'stat-digital-1', number: '5M+', label: 'Users' },
        { id: 'stat-digital-2', number: '99.9%', label: 'Uptime' },
        { id: 'stat-digital-3', number: '150+', label: 'Apps' }
      ]
    : [
        { id: 'stat-content-1', number: '50+', label: 'Microservices' },
        { id: 'stat-content-2', number: '99.99%', label: 'SLA' },
        { id: 'stat-content-3', number: '10TB+', label: 'Data Managed' }
      ];

  return (
    <section className="page-section">
      <div className="container">
        
        {/* === HERO: Animated Phone Showcase === */}
        <div className="app-showcase-hero">
          {/* Background animated elements */}
          <div className="app-hero-bg">
            <div className="app-bg-orb app-bg-orb-1"></div>
            <div className="app-bg-orb app-bg-orb-2"></div>
            <div className="app-bg-orb app-bg-orb-3"></div>
            <div className="app-bg-grid"></div>
          </div>

          <div className="app-hero-content">
            <div className="app-hero-text">
              <div className="app-hero-badge">
                <span className="badge-dot"></span>
                Mobile Development
              </div>
              <h1 className="app-hero-title">{t.tab3.title}</h1>
              <p className="app-hero-subtitle">{t.tab3.description}</p>
              
              {/* Tech stack animated pills */}
              <div className="tech-stack-row">
                <div className="tech-pill tech-pill-1">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  React Native
                </div>
                <div className="tech-pill tech-pill-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  Flutter
                </div>
                <div className="tech-pill tech-pill-3">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  Swift
                </div>
                <div className="tech-pill tech-pill-4">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  Kotlin
                </div>
              </div>
            </div>

            {/* Animated Phone Mockup */}
            <div className="app-phone-showcase">
              <div className="phone-glow"></div>
              <div className="app-phone-device">
                <div className="phone-notch"></div>
                <div className="phone-app-screen">
                  {/* Animated screen content */}
                  <div className="screen-header-bar">
                    <div className="screen-status-dots">
                      <span></span><span></span><span></span>
                    </div>
                    <div className="screen-title-bar">Bulls App</div>
                  </div>
                  <div className="screen-card screen-card-1">
                    <div className="screen-card-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <div className="screen-card-lines">
                      <div className="line-short"></div>
                      <div className="line-long"></div>
                    </div>
                  </div>
                  <div className="screen-card screen-card-2">
                    <div className="screen-card-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
                    </div>
                    <div className="screen-card-lines">
                      <div className="line-long"></div>
                      <div className="line-short"></div>
                    </div>
                  </div>
                  <div className="screen-card screen-card-3">
                    <div className="screen-card-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                    </div>
                    <div className="screen-card-lines">
                      <div className="line-short"></div>
                      <div className="line-long"></div>
                    </div>
                  </div>
                  <div className="screen-nav-bar">
                    <div className="nav-dot active"></div>
                    <div className="nav-dot"></div>
                    <div className="nav-dot"></div>
                    <div className="nav-dot"></div>
                  </div>
                </div>
                <div className="phone-home-indicator"></div>
              </div>

              {/* Floating notification cards */}
              <div className="floating-notif notif-1">
                <div className="notif-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                </div>
                <div className="notif-text">
                  <span className="notif-title">Build Success</span>
                  <span className="notif-desc">v2.4.1 deployed</span>
                </div>
              </div>
              <div className="floating-notif notif-2">
                <div className="notif-icon notif-icon-purple">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <div className="notif-text">
                  <span className="notif-title">+2.4K Users</span>
                  <span className="notif-desc">Today</span>
                </div>
              </div>
              <div className="floating-notif notif-3">
                <div className="notif-icon notif-icon-green">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                </div>
                <div className="notif-text">
                  <span className="notif-title">Performance</span>
                  <span className="notif-desc">98.5% score</span>
                </div>
              </div>

              {/* Animated code particles */}
              <div className="code-particle cp-1">&lt;App /&gt;</div>
              <div className="code-particle cp-2">flutter run</div>
              <div className="code-particle cp-3">swift build</div>
              <div className="code-particle cp-4">npm deploy</div>
            </div>
          </div>
        </div>

        {/* === TABS SECTION === */}
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

              {/* Animated Visual Section */}
              <div className="app-visual-showcase">
                {activeTab === 'digital' ? (
                  <div className="app-features-grid">
                    <div className="app-feature-box app-fb-1">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                      </div>
                      <h4>Native Performance</h4>
                      <p>60fps smooth animations</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '95%'}}></div></div>
                    </div>
                    <div className="app-feature-box app-fb-2">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <h4>Secure by Design</h4>
                      <p>End-to-end encryption</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '100%'}}></div></div>
                    </div>
                    <div className="app-feature-box app-fb-3">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                      </div>
                      <h4>Cross-Platform</h4>
                      <p>iOS & Android unified</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '88%'}}></div></div>
                    </div>
                    <div className="app-feature-box app-fb-4">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      </div>
                      <h4>Fast Delivery</h4>
                      <p>Agile sprint cycles</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '92%'}}></div></div>
                    </div>
                  </div>
                ) : (
                  <div className="app-features-grid">
                    <div className="app-feature-box app-fb-1">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                      </div>
                      <h4>REST & GraphQL</h4>
                      <p>Flexible API architecture</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '96%'}}></div></div>
                    </div>
                    <div className="app-feature-box app-fb-2">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                      </div>
                      <h4>Cloud Native</h4>
                      <p>AWS / GCP / Azure</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '90%'}}></div></div>
                    </div>
                    <div className="app-feature-box app-fb-3">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></svg>
                      </div>
                      <h4>CI/CD Pipeline</h4>
                      <p>Automated deployments</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '94%'}}></div></div>
                    </div>
                    <div className="app-feature-box app-fb-4">
                      <div className="app-fb-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <h4>Monitoring</h4>
                      <p>Real-time analytics</p>
                      <div className="app-fb-bar"><div className="app-fb-fill" style={{width: '87%'}}></div></div>
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

        {/* === App Portfolio Slider === */}
        <div className="slider-section">
          <h2 className="slider-title">Our Mobile Projects</h2>
          <div className="project-slider">
            <div className="slider-track">
              <div className="project-card">
                <div className="project-icon-svg">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="12" y="4" width="24" height="40" rx="4"/><circle cx="24" cy="38" r="2"/><path d="M18 12h12M18 18h8"/></svg>
                </div>
                <h3>FinTrack Pro</h3>
                <p>Personal Finance App</p>
                <div className="project-stats">
                  <span>1.2M Downloads</span>
                  <span>4.8 Rating</span>
                </div>
              </div>
              <div className="project-card">
                <div className="project-icon-svg">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 24c0-9.94 8.06-18 18-18s18 8.06 18 18-8.06 18-18 18"/><path d="M24 6v18l12 6"/></svg>
                </div>
                <h3>HealthSync</h3>
                <p>Health & Wellness Tracker</p>
                <div className="project-stats">
                  <span>800K Users</span>
                  <span>4.9 Rating</span>
                </div>
              </div>
              <div className="project-card">
                <div className="project-icon-svg">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12l20-8 20 8v24l-20 8-20-8z"/><path d="M24 4v40M4 12l20 8 20-8"/></svg>
                </div>
                <h3>LearnFlow</h3>
                <p>EdTech Platform</p>
                <div className="project-stats">
                  <span>500K Students</span>
                  <span>4.7 Rating</span>
                </div>
              </div>
              <div className="project-card">
                <div className="project-icon-svg">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="24" r="20"/><path d="M16 24l6 6 10-12"/></svg>
                </div>
                <h3>TaskMaster</h3>
                <p>Project Management</p>
                <div className="project-stats">
                  <span>2M+ Tasks</span>
                  <span>4.6 Rating</span>
                </div>
              </div>
              <div className="project-card">
                <div className="project-icon-svg">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 8h32v32H8z"/><path d="M16 24h16M24 16v16"/><circle cx="24" cy="24" r="4"/></svg>
                </div>
                <h3>ShopWave</h3>
                <p>E-Commerce Solution</p>
                <div className="project-stats">
                  <span>$10M+ Sales</span>
                  <span>4.8 Rating</span>
                </div>
              </div>
              <div className="project-card">
                <div className="project-icon-svg">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 36V12a8 8 0 018-8h24a8 8 0 018 8v24a8 8 0 01-8 8H12a8 8 0 01-8-8z"/><path d="M16 20l8 8 8-8"/></svg>
                </div>
                <h3>MediaVault</h3>
                <p>Cloud Storage App</p>
                <div className="project-stats">
                  <span>3M Files</span>
                  <span>4.7 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

Page3.propTypes = {
  t: PropTypes.object.isRequired,
};

export default Page3;
