// ============================================
// TRANSLATION DATA
// ============================================
const translations = {
    tr: {
        logo: "LOGO",
        nav: {
            tab1: "Tab 1",
            tab2: "Tab 2",
            tab3: "Tab 3",
            tab4: "Tab 4"
        },
        hero: {
            title: "Hoş Geldiniz",
            subtitle: "Modern ve profesyonel web çözümleri",
            cta: "Keşfet"
        },
        tab1: {
            title: "Bölüm 1",
            description: "Bu bölümün açıklaması burada yer alacak.",
            item1: {
                title: "Öğe 1",
                desc: "Öğe 1 açıklaması"
            },
            item2: {
                title: "Öğe 2",
                desc: "Öğe 2 açıklaması"
            },
            item3: {
                title: "Öğe 3",
                desc: "Öğe 3 açıklaması"
            },
            item4: {
                title: "Öğe 4",
                desc: "Öğe 4 açıklaması"
            }
        },
        tab2: {
            title: "Bölüm 2",
            description: "Bu bölümün açıklaması burada yer alacak.",
            item1: {
                title: "Öğe 1",
                desc: "Öğe 1 açıklaması"
            },
            item2: {
                title: "Öğe 2",
                desc: "Öğe 2 açıklaması"
            },
            item3: {
                title: "Öğe 3",
                desc: "Öğe 3 açıklaması"
            },
            item4: {
                title: "Öğe 4",
                desc: "Öğe 4 açıklaması"
            }
        },
        tab3: {
            title: "Bölüm 3",
            description: "Bu bölümün açıklaması burada yer alacak.",
            item1: {
                title: "Öğe 1",
                desc: "Öğe 1 açıklaması"
            },
            item2: {
                title: "Öğe 2",
                desc: "Öğe 2 açıklaması"
            },
            item3: {
                title: "Öğe 3",
                desc: "Öğe 3 açıklaması"
            },
            item4: {
                title: "Öğe 4",
                desc: "Öğe 4 açıklaması"
            }
        },
        tab4: {
            title: "Bölüm 4",
            description: "Bu bölümün açıklaması burada yer alacak.",
            item1: {
                title: "Öğe 1",
                desc: "Öğe 1 açıklaması"
            },
            item2: {
                title: "Öğe 2",
                desc: "Öğe 2 açıklaması"
            },
            item3: {
                title: "Öğe 3",
                desc: "Öğe 3 açıklaması"
            },
            item4: {
                title: "Öğe 4",
                desc: "Öğe 4 açıklaması"
            }
        },
        footer: {
            about: "Hakkımızda",
            aboutText: "Modern web çözümleri sunan profesyonel ekip.",
            contact: "İletişim",
            follow: "Takip Edin",
            copyright: "© 2025 Tüm hakları saklıdır."
        }
    },
    en: {
        logo: "LOGO",
        nav: {
            tab1: "Tab 1",
            tab2: "Tab 2",
            tab3: "Tab 3",
            tab4: "Tab 4"
        },
        hero: {
            title: "Welcome",
            subtitle: "Modern and professional web solutions",
            cta: "Explore"
        },
        tab1: {
            title: "Section 1",
            description: "This section's description will be here.",
            item1: {
                title: "Item 1",
                desc: "Item 1 description"
            },
            item2: {
                title: "Item 2",
                desc: "Item 2 description"
            },
            item3: {
                title: "Item 3",
                desc: "Item 3 description"
            },
            item4: {
                title: "Item 4",
                desc: "Item 4 description"
            }
        },
        tab2: {
            title: "Section 2",
            description: "This section's description will be here.",
            item1: {
                title: "Item 1",
                desc: "Item 1 description"
            },
            item2: {
                title: "Item 2",
                desc: "Item 2 description"
            },
            item3: {
                title: "Item 3",
                desc: "Item 3 description"
            },
            item4: {
                title: "Item 4",
                desc: "Item 4 description"
            }
        },
        tab3: {
            title: "Section 3",
            description: "This section's description will be here.",
            item1: {
                title: "Item 1",
                desc: "Item 1 description"
            },
            item2: {
                title: "Item 2",
                desc: "Item 2 description"
            },
            item3: {
                title: "Item 3",
                desc: "Item 3 description"
            },
            item4: {
                title: "Item 4",
                desc: "Item 4 description"
            }
        },
        tab4: {
            title: "Section 4",
            description: "This section's description will be here.",
            item1: {
                title: "Item 1",
                desc: "Item 1 description"
            },
            item2: {
                title: "Item 2",
                desc: "Item 2 description"
            },
            item3: {
                title: "Item 3",
                desc: "Item 3 description"
            },
            item4: {
                title: "Item 4",
                desc: "Item 4 description"
            }
        },
        footer: {
            about: "About Us",
            aboutText: "Professional team providing modern web solutions.",
            contact: "Contact",
            follow: "Follow Us",
            copyright: "© 2025 All rights reserved."
        }
    }
};

// ============================================
// GLOBAL STATE
// ============================================
let currentLang = 'tr';

// ============================================
// DOM ELEMENTS
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const langButtons = document.querySelectorAll('.lang-btn');

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
for (const link of navLinks) {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
for (const link of navLinks) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
};

// ============================================
// SCROLL ANIMATIONS
// ============================================
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.grid-item, .tab-section h2');
    
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        }
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    for (const element of elements) {
        observer.observe(element);
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', handleScrollAnimations);

// ============================================
// LANGUAGE SWITCHING
// ============================================
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    for (const element of elements) {
        const key = element.dataset.i18n;
        const translation = getNestedValue(translations[lang], key);
        
        if (translation) {
            element.textContent = translation;
        }
    }
    
    // Update active button state
    for (const btn of langButtons) {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    }
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Add click events to language buttons
for (const button of langButtons) {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        updateLanguage(lang);
    });
}

// ============================================
// INITIALIZE
// ============================================
function initialize() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
        updateLanguage(savedLang);
    }
    
    // Add active class to current section on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.tab-section');
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        }
        
        for (const link of navLinks) {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        }
    });
    
    // Header shadow on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// CONSOLE INFORMATION
// ============================================
console.log('%c Website Loaded Successfully! ', 'background: #2563eb; color: white; font-size: 16px; padding: 10px;');
console.log('%c Current Language: ' + currentLang.toUpperCase(), 'color: #2563eb; font-size: 14px;');
