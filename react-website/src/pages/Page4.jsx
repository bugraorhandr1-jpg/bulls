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
    <section className="page-section alternate bg-theme-tech">
      <div className="container">
        <div className="page-hero about-page-hero">
          <div className="hero-animation about-animation">
            {/* Animated orbit rings */}
            <div className="about-orbit-system">
              <div className="orbit-ring orbit-ring-1">
                <div className="orbit-dot"></div>
              </div>
              <div className="orbit-ring orbit-ring-2">
                <div className="orbit-dot"></div>
              </div>
              <div className="orbit-ring orbit-ring-3">
                <div className="orbit-dot"></div>
              </div>
              <div className="orbit-center-logo">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            {/* Floating achievement cards */}
            <div className="about-float-cards">
              <div className="about-fcard afc-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
                <span>Award Winner</span>
              </div>
              <div className="about-fcard afc-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                <span>50+ Team</span>
              </div>
              <div className="about-fcard afc-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                <span>30+ Countries</span>
              </div>
            </div>
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
                      <div className="icon email-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                      </div>
                      <h3>{t.tab4.tabs.contact.emailTitle}</h3>
                      <a href={`mailto:${t.tab4.tabs.contact.emailInfo}`}>{t.tab4.tabs.contact.emailInfo}</a>
                    </div>
                    
                    <div className="contact-info-card">
                      <div className="icon phone-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                      </div>
                      <h3>{t.tab4.tabs.contact.phoneTitle}</h3>
                      <a href={`tel:${t.tab4.tabs.contact.phoneMain.replaceAll(' ', '')}`}>{t.tab4.tabs.contact.phoneMain}</a>
                    </div>
                    
                    <div className="contact-info-card">
                      <div className="icon location-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
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
                        <div className="badge-item">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
                        </div>
                        <div className="badge-item">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <div className="badge-item">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div className="badge-item">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
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
                        <div className="team-card"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <div className="team-card"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>
                        <div className="team-card"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg></div>
                        <div className="team-card"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
                        <div className="team-card"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div>
                        <div className="team-card"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div>
                      </div>
                      <div className="team-skills">
                        <div className="skill-badge">Development</div>
                        <div className="skill-badge">Design</div>
                        <div className="skill-badge">Analytics</div>
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
            <h2 className="slider-title">{activeTab === 'company' ? 'Our Achievements' : 'Meet Our Team'}</h2>
            <div className="project-slider">
              <div className="slider-track">
                {activeTab === 'company' ? (
                  <>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="16" r="14"/><path d="M16.42 27.78L14 46l10-6 10 6-2.42-18.24"/></svg></div>
                      <h3>Best Studio 2024</h3>
                      <p>Industry Excellence Award</p>
                      <div className="project-stats"><span>Gold</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="12"/><circle cx="24" cy="24" r="4"/></svg></div>
                      <h3>Top Innovator</h3>
                      <p>Creative Technology Prize</p>
                      <div className="project-stats"><span>Platinum</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="24 4 30.18 16.52 44 18.54 34 28.28 36.36 42.04 24 35.54 11.64 42.04 14 28.28 4 18.54 17.82 16.52 24 4"/></svg></div>
                      <h3>Client Choice</h3>
                      <p>Best Partner Award</p>
                      <div className="project-stats"><span>Diamond</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M24 4L4 14l20 10 20-10L24 4zM4 34l20 10 20-10M4 24l20 10 20-10"/></svg></div>
                      <h3>Game Changer</h3>
                      <p>Digital Transformation Leader</p>
                      <div className="project-stats"><span>Elite</span></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M40 42v-4a8 8 0 00-8-8H16a8 8 0 00-8 8v4"/><circle cx="24" cy="14" r="8"/></svg></div>
                      <h3>CEO</h3>
                      <p>Chief Executive Officer</p>
                      <div className="project-stats"><span>Leadership</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="6" width="40" height="28" rx="4"/><path d="M16 42h16M24 34v8"/></svg></div>
                      <h3>CTO</h3>
                      <p>Chief Technology Officer</p>
                      <div className="project-stats"><span>Technology</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M24 38l14-14 6 6-14 14-6-6z"/><path d="M36 26l-3-14L4 4l7 29 18-4 10 10z"/></svg></div>
                      <h3>Creative Director</h3>
                      <p>Design & Branding</p>
                      <div className="project-stats"><span>Design</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M29.4 12.6a2 2 0 000 2.8l3.2 3.2a2 2 0 002.8 0l7.54-7.54a12 12 0 01-15.88 15.88L13.18 40.82a4.24 4.24 0 01-6-6l13.88-13.88A12 12 0 0136.94 5.06l-7.52 7.52z"/></svg></div>
                      <h3>Lead Engineer</h3>
                      <p>Full-Stack Development</p>
                      <div className="project-stats"><span>Engineering</span></div>
                    </div>
                    <div className="project-card">
                      <div className="project-icon-svg"><svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 6s-2 2-2 8 4 12 8 16 12 8 16 8 8-2 8-2l-6-6s-4 2-6 2-8-4-10-6-6-8-6-10 2-6 2-6z"/></svg></div>
                      <h3>Project Manager</h3>
                      <p>Agile & Delivery</p>
                      <div className="project-stats"><span>Management</span></div>
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
