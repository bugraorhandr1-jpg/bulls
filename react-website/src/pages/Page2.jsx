import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';

function Page2({ t }) {
  const [activeTab, setActiveTab] = useState('banking');
  
  const currentTab = t.tab2.tabs[activeTab];

  const getIconName = (tabName, itemIndex) => {
    if (tabName === 'banking') {
      return itemIndex === 0 ? 'creditcard' : 'wallet';
    }
    return itemIndex === 0 ? 'briefcase' : 'blockchain';
  };

  const stats = activeTab === 'banking' 
    ? [
        { id: 'stat-banking-1', number: '$2B+', label: 'Transactions' },
        { id: 'stat-banking-2', number: '10M+', label: 'Users' },
        { id: 'stat-banking-3', number: '99.9%', label: 'Security' }
      ]
    : [
        { id: 'stat-enterprise-1', number: '500+', label: 'Enterprises' },
        { id: 'stat-enterprise-2', number: '50+', label: 'Integrations' },
        { id: 'stat-enterprise-3', number: '24/7', label: 'Support' }
      ];

  return (
    <section className="page-section alternate">
      <div className="container">
        <div className="page-hero">
          <div className="hero-animation fintech-animation">
            <div className="fintech-particle"></div>
            <div className="fintech-particle"></div>
            <div className="fintech-particle"></div>
            <div className="fintech-particle"></div>
            <div className="fintech-particle"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t.tab2.title}</h1>
            <p className="hero-subtitle">{t.tab2.description}</p>
          </div>
        </div>
        
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'banking' ? 'active' : ''}`}
              onClick={() => setActiveTab('banking')}
            >
              <span>{t.tab2.tabs.banking.name}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'enterprise' ? 'active' : ''}`}
              onClick={() => setActiveTab('enterprise')}
            >
              <span>{t.tab2.tabs.enterprise.name}</span>
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
                {activeTab === 'banking' ? (
                  <div className="visual-animation banking-visual">
                    <div className="credit-cards">
                      <div className="card">
                        <div className="card-chip"></div>
                        <div className="card-number">**** **** **** 1234</div>
                      </div>
                      <div className="card">
                        <div className="card-chip"></div>
                        <div className="card-number">**** **** **** 5678</div>
                      </div>
                      <div className="card">
                        <div className="card-chip"></div>
                        <div className="card-number">**** **** **** 9012</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="visual-animation enterprise-visual">
                    <div className="network-node">📊</div>
                    <div className="network-node">💻</div>
                    <div className="network-node">📡</div>
                    <div className="network-node">☁️</div>
                    <div className="network-node">🔒</div>
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

Page2.propTypes = {
  t: PropTypes.object.isRequired,
};

export default Page2;
