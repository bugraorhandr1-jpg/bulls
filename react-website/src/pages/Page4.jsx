import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';

function Page4({ t }) {
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  
  const currentTab = t.tab4.tabs[activeTab];

  const getIconName = (tabName, itemIndex) => {
    if (tabName === 'company') {
      return itemIndex === 0 ? 'target' : 'award';
    }
    if (tabName === 'team') {
      return itemIndex === 0 ? 'users' : 'mail';
    }
    return 'mail';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // Formspree ile email gönderme (ücretsiz geçici çözüm)
      const response = await fetch('https://formspree.io/f/xanyrvge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus(''), 3000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
    }
  };

  const stats = activeTab === 'company' 
    ? [
        { id: 'stat-company-1', number: '2020', label: 'Founded' },
        { id: 'stat-company-2', number: '100+', label: 'Projects' },
        { id: 'stat-company-3', number: '30+', label: 'Countries' }
      ]
    : [
        { id: 'stat-team-1', number: '50+', label: 'Team Members' },
        { id: 'stat-team-2', number: '15+', label: 'Years Exp.' },
        { id: 'stat-team-3', number: '98%', label: 'Satisfaction' }
      ];

  return (
    <section className="page-section alternate">
      <div className="container">
        <div className="page-hero">
          <div className="hero-animation about-animation">
            <div className="about-team-avatars">
              <div className="team-member tm-1">👨‍💼</div>
              <div className="team-member tm-2">👩‍💻</div>
              <div className="team-member tm-3">🧑‍🎨</div>
              <div className="team-member tm-4">👨‍🔬</div>
              <div className="team-member tm-5">👩‍🚀</div>
              <div className="team-member tm-6">🧑‍🏫</div>
            </div>
            <div className="company-icons">
              <div className="comp-icon">🏆</div>
              <div className="comp-icon">🎯</div>
              <div className="comp-icon">💡</div>
              <div className="comp-icon">🚀</div>
            </div>
            <div className="rotating-ring"></div>
            <div className="rotating-ring"></div>
            <div className="rotating-ring"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">{t.tab4.title}</h1>
            <p className="hero-subtitle">{t.tab4.description}</p>
          </div>
        </div>
        
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              <span>{t.tab4.tabs.company.name}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <span>{t.tab4.tabs.team.name}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <span>{t.tab4.tabs.contact.name}</span>
            </button>
          </div>
          
          <div className="tab-content" key={activeTab}>
            {activeTab === 'contact' ? (
              <div className="contact-section">
                <div className="contact-layout">
                  <div className="contact-info-side">
                    <div className="contact-info-card">
                      <div className="icon email-icon">📧</div>
                      <h3>{t.tab4.tabs.contact.emailTitle}</h3>
                      <a href={`mailto:${t.tab4.tabs.contact.emailInfo}`}>{t.tab4.tabs.contact.emailInfo}</a>
                    </div>
                    
                    <div className="contact-info-card">
                      <div className="icon phone-icon">📱</div>
                      <h3>{t.tab4.tabs.contact.phoneTitle}</h3>
                      <a href={`tel:${t.tab4.tabs.contact.phoneMain.replaceAll(' ', '')}`}>{t.tab4.tabs.contact.phoneMain}</a>
                    </div>
                    
                    <div className="contact-info-card">
                      <div className="icon location-icon">📍</div>
                      <h3>{t.tab4.tabs.contact.locationTitle}</h3>
                      <span className="location-address">{t.tab4.tabs.contact.locationAddress}</span>
                    </div>
                  </div>

                  <div className="contact-form-side">
                    <div className="contact-form-section">
                  <h2>{t.tab4.tabs.contact.formTitle}</h2>
                  <p className="form-description">{t.tab4.tabs.contact.formDescription}</p>
                  
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">{t.tab4.tabs.contact.nameLabel}</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder={t.tab4.tabs.contact.namePlaceholder}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">{t.tab4.tabs.contact.emailLabel}</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder={t.tab4.tabs.contact.emailPlaceholder}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">{t.tab4.tabs.contact.subjectLabel}</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder={t.tab4.tabs.contact.subjectPlaceholder}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">{t.tab4.tabs.contact.messageLabel}</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        placeholder={t.tab4.tabs.contact.messagePlaceholder}
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="submit-button" disabled={formStatus === 'sending'}>
                      {formStatus === 'sending' ? t.tab4.tabs.contact.sending : t.tab4.tabs.contact.send}
                    </button>
                    
                    {formStatus === 'success' && (
                      <div className="form-message success">{t.tab4.tabs.contact.successMessage}</div>
                    )}
                    {formStatus === 'error' && (
                      <div className="form-message error">{t.tab4.tabs.contact.errorMessage}</div>
                    )}
                  </form>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tab-main-content">
                <div className="tab-header-section">
                  <div className="tab-subtitle">{currentTab.subtitle}</div>
                  <h2 className="tab-title">{currentTab.name}</h2>
                  <p className="tab-description">{currentTab.description}</p>
                </div>

                <div className="tab-visual-section">
                  {activeTab === 'company' ? (
                    <div className="visual-animation company-visual">
                      <div className="achievement-badges">
                        <div className="badge-item">🏆</div>
                        <div className="badge-item">🎯</div>
                        <div className="badge-item">⭐</div>
                        <div className="badge-item">💎</div>
                      </div>
                      <div className="company-stats-overlay">
                        <div className="stat-circle">2020</div>
                        <div className="stat-circle">100+</div>
                        <div className="stat-circle">50M+</div>
                      </div>
                    </div>
                  ) : (
                    <div className="visual-animation team-visual">
                      <div className="team-grid">
                        <div className="team-card">👨‍💼</div>
                        <div className="team-card">👩‍💻</div>
                        <div className="team-card">🧑‍🎨</div>
                        <div className="team-card">👨‍🔬</div>
                        <div className="team-card">👩‍🚀</div>
                        <div className="team-card">🧑‍🏫</div>
                      </div>
                      <div className="team-skills">
                        <div className="skill-badge">💻 Development</div>
                        <div className="skill-badge">🎨 Design</div>
                        <div className="skill-badge">📊 Analytics</div>
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
            )}
          </div>
        </div>

        {/* Team Members Slider */}
        {activeTab !== 'contact' && (
          <div className="slider-section">
            <h2 className="slider-title">👥 {activeTab === 'company' ? 'Our Achievements' : 'Meet Our Team'}</h2>
            <div className="project-slider">
              <div className="slider-track">
                {activeTab === 'company' ? (
                  <>
                    <div className="project-card">
                      <div className="project-icon">🏆</div>
                      <h3>Best Studio 2024</h3>
                      <p>Industry Excellence Award</p>
                      <div className="project-stats">
                        <span>🌟 Gold</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">🎯</div>
                      <h3>Top Innovator</h3>
                      <p>Creative Technology Prize</p>
                      <div className="project-stats">
                        <span>🌟 Platinum</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">⭐</div>
                      <h3>Client Choice</h3>
                      <p>Best Partner Award</p>
                      <div className="project-stats">
                        <span>🌟 Diamond</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">💎</div>
                      <h3>Game Changer</h3>
                      <p>Digital Transformation Leader</p>
                      <div className="project-stats">
                        <span>🌟 Elite</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="project-card">
                      <div className="project-icon">👨‍💼</div>
                      <h3>John CEO</h3>
                      <p>Chief Executive Officer</p>
                      <div className="project-stats">
                        <span>📧 Contact</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">👩‍💻</div>
                      <h3>Sarah CTO</h3>
                      <p>Chief Technology Officer</p>
                      <div className="project-stats">
                        <span>📧 Contact</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">🧑‍🎨</div>
                      <h3>Mike Designer</h3>
                      <p>Creative Director</p>
                      <div className="project-stats">
                        <span>📧 Contact</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">👨‍🔬</div>
                      <h3>Alex Developer</h3>
                      <p>Lead Engineer</p>
                      <div className="project-stats">
                        <span>📧 Contact</span>
                      </div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon">👩‍🚀</div>
                      <h3>Emma Manager</h3>
                      <p>Project Manager</p>
                      <div className="project-stats">
                        <span>📧 Contact</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

Page4.propTypes = {
  t: PropTypes.object.isRequired,
};

export default Page4;
