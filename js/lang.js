/* Kariaservice - Language Management System */

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('kariaservice-lang') || 'fr';
        this.translations = {};
        this.availableLanguages = {
            'fr': 'Français',
            'en': 'English'
        };
        
        this.init();
    }
    
    async init() {
        await this.loadTranslations();
        this.createLanguageSelector();
        this.updateContent();
        this.bindEvents();
        this.initializeResponsiveNavigation();
    }
    
    async loadTranslations() {
        try {
            for (const lang of Object.keys(this.availableLanguages)) {
                const response = await fetch(`lang/${lang}.json`);
                if (response.ok) {
                    this.translations[lang] = await response.json();
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    
    createLanguageSelector() {
        // Find the header actions
        const navActions = document.querySelector('.nav__actions');
        if (!navActions) return;
        
        // Create language selector
        const langSelector = document.createElement('div');
        langSelector.className = 'lang-selector';
        langSelector.innerHTML = `
            <button class="lang-toggle" id="lang-toggle">
                <i class="fas fa-globe"></i>
                <span class="lang-current">${this.currentLang.toUpperCase()}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="lang-dropdown">
                ${Object.entries(this.availableLanguages).map(([code, name]) => `
                    <button class="lang-option ${code === this.currentLang ? 'active' : ''}" data-lang="${code}">
                        <span class="lang-flag">${this.getFlagEmoji(code)}</span>
                        <span class="lang-name">${name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        // Insert before the quote button
        const quoteBtn = navActions.querySelector('.btn--primary');
        navActions.insertBefore(langSelector, quoteBtn);
    }
    
    getFlagEmoji(langCode) {
        const flags = {
            'fr': '🇫🇷',
            'en': '🇬🇧'
        };
        return flags[langCode] || '🌐';
    }
    
    bindEvents() {
        const langToggle = document.getElementById('lang-toggle');
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (langToggle) {
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.querySelector('.lang-dropdown');
                dropdown.classList.toggle('show');
            });
        }
        
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const selectedLang = e.currentTarget.dataset.lang;
                this.changeLanguage(selectedLang);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            const dropdown = document.querySelector('.lang-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
    }
    
    async changeLanguage(langCode) {
        if (langCode === this.currentLang) return;
        
        this.currentLang = langCode;
        localStorage.setItem('kariaservice-lang', langCode);
        
        // Update current language display
        const langCurrent = document.querySelector('.lang-current');
        if (langCurrent) {
            langCurrent.textContent = langCode.toUpperCase();
        }
        
        // Update active option
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === langCode);
        });
        
        // Update page content
        this.updateContent();
        
        // Close dropdown
        const dropdown = document.querySelector('.lang-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = langCode;
        
        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: langCode }
        }));
    }
    
    initializeResponsiveNavigation() {
        // Update navigation on window resize
        window.addEventListener('resize', debounce(() => {
            this.updateContent();
        }, 250));
    }
    
    updateContent() {
        const translations = this.translations[this.currentLang];
        if (!translations) return;
        
        // Update navigation
        this.updateNavigation(translations.navigation);
        
        // Update hero section
        this.updateHero(translations.hero);
        
        // Update services section
        this.updateServices(translations.services);
        
        // Update excellence section
        this.updateExcellence(translations.excellence);
        
        // Update about section
        this.updateAbout(translations.about);
        
        // Update projects section
        this.updateProjects(translations.projects);
        
        // Update testimonials section
        this.updateTestimonials(translations.testimonials);
        
        // Update contact section
        this.updateContact(translations.contact);
        
        // Update quote section
        this.updateQuote(translations.quote);
        
        // Update footer
        this.updateFooter(translations.footer);
    }
    
    updateNavigation(nav) {
        // Check if we need to use short versions based on screen width
        const useShortNames = this.shouldUseShortNames();
        
        const navLinks = {
            'a[href="#accueil"]': nav.home,
            'a[href="#apropos"]': useShortNames && nav.about_short ? nav.about_short : nav.about,
            'a[href="#services"]': nav.services,
            'a[href="#excellence"]': useShortNames && nav.excellence_short ? nav.excellence_short : nav.excellence,
            'a[href="#immobilier"]': nav.real_estate,
            'a[href="#logistique"]': nav.logistics,
            'a[href="#mine-petrole"]': nav.mining,
            'a[href="#realisations"]': nav.projects,
            'a[href="#testimonials"]': useShortNames && nav.testimonials_short ? nav.testimonials_short : nav.testimonials,
            'a[href="#contact"]': nav.contact,
            'a[href="#devis"]': useShortNames && nav.quote_short ? nav.quote_short : nav.quote
        };
        
        Object.entries(navLinks).forEach(([selector, text]) => {
            const element = document.querySelector(selector);
            if (element) element.textContent = text;
        });
    }
    
    shouldUseShortNames() {
        const screenWidth = window.innerWidth;
        const nav = document.querySelector('.nav');
        
        // Use short names for screens smaller than 1200px when in French
        if (this.currentLang === 'fr' && screenWidth <= 1200) return true;
        
        // Always use short names for tablets and smaller
        if (screenWidth <= 1024) return true;
        
        // Check if navigation would overflow
        if (nav) {
            const navMenu = nav.querySelector('.nav__menu');
            const navActions = nav.querySelector('.nav__actions');
            
            if (navMenu && navActions) {
                const availableWidth = nav.offsetWidth - 350; // Reserve space for logo and actions
                const menuWidth = navMenu.scrollWidth;
                
                return menuWidth > availableWidth;
            }
        }
        
        return false;
    }
    
    updateHero(hero) {
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle) {
            heroTitle.innerHTML = hero.title;
            // Redéclencher l'animation typewriter si elle existe
            if (window.typeWriter && typeof window.typeWriter === 'function') {
                setTimeout(() => {
                    window.typeWriter(heroTitle, hero.title);
                }, 100);
            }
        }
        
        const heroDescription = document.querySelector('.hero__description');
        if (heroDescription) heroDescription.textContent = hero.description;
        
        const btnServices = document.querySelector('.hero__buttons .btn--primary');
        if (btnServices) btnServices.textContent = hero.btn_services;
        
        const btnContact = document.querySelector('.hero__buttons .btn--secondary');
        if (btnContact) btnContact.textContent = hero.btn_contact;
        
        // Update slider content
        const slides = document.querySelectorAll('.slide__content');
        const slideData = [
            { title: hero.slide1_title, desc: hero.slide1_desc },
            { title: hero.slide2_title, desc: hero.slide2_desc },
            { title: hero.slide3_title, desc: hero.slide3_desc }
        ];
        
        slides.forEach((slide, index) => {
            if (slideData[index]) {
                const title = slide.querySelector('h2');
                const desc = slide.querySelector('p');
                if (title) title.textContent = slideData[index].title;
                if (desc) desc.textContent = slideData[index].desc;
            }
        });
    }
    
    updateServices(services) {
        // Section header
        const subtitle = document.querySelector('#services .section__subtitle');
        if (subtitle) subtitle.textContent = services.subtitle;
        
        const title = document.querySelector('#services .section__title');
        if (title) title.textContent = services.title;
        
        const description = document.querySelector('#services .section__description');
        if (description) description.textContent = services.description;
        
        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        const servicesData = [services.real_estate, services.logistics, services.mining];
        
        serviceCards.forEach((card, index) => {
            if (servicesData[index]) {
                const service = servicesData[index];
                const cardTitle = card.querySelector('.service-card__title');
                const cardDesc = card.querySelector('.service-card__description');
                const cardFeatures = card.querySelectorAll('.service-card__features li');
                const cardBtn = card.querySelector('.btn');
                
                if (cardTitle) cardTitle.textContent = service.title;
                if (cardDesc) cardDesc.textContent = service.description;
                if (cardBtn) cardBtn.textContent = service.btn;
                
                cardFeatures.forEach((feature, featureIndex) => {
                    if (service.features[featureIndex]) {
                        const icon = feature.querySelector('i');
                        feature.textContent = service.features[featureIndex];
                        if (icon) {
                            feature.insertBefore(icon, feature.firstChild);
                        }
                    }
                });
            }
        });
    }
    
    updateExcellence(excellence) {
        // Section header
        const subtitle = document.querySelector('#excellence .section__subtitle');
        if (subtitle) subtitle.textContent = excellence.subtitle;
        
        const title = document.querySelector('#excellence .section__title');
        if (title) title.textContent = excellence.title;
        
        const description = document.querySelector('#excellence .section__description');
        if (description) description.textContent = excellence.description;
        
        // Tab items
        const tabItems = document.querySelectorAll('.tab-item');
        const tabsData = [
            excellence.tabs.real_estate,
            excellence.tabs.logistics,
            excellence.tabs.energy,
            excellence.tabs.consulting
        ];
        
        tabItems.forEach((tab, index) => {
            if (tabsData[index]) {
                const tabData = tabsData[index];
                const tabTitle = tab.querySelector('h3');
                const tabSubtitle = tab.querySelector('p');
                
                if (tabTitle) tabTitle.textContent = tabData.title;
                if (tabSubtitle) tabSubtitle.textContent = tabData.subtitle;
            }
        });
        
        // Gallery content
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            if (tabsData[index]) {
                const tabData = tabsData[index];
                const galleryTitle = item.querySelector('.gallery-content h4');
                const galleryDesc = item.querySelector('.gallery-content p');
                const galleryFeatures = item.querySelectorAll('.gallery-features li');
                
                if (galleryTitle) galleryTitle.textContent = tabData.title;
                if (galleryDesc) galleryDesc.textContent = tabData.description;
                
                galleryFeatures.forEach((feature, featureIndex) => {
                    if (tabData.features[featureIndex]) {
                        const icon = feature.querySelector('i');
                        feature.textContent = tabData.features[featureIndex];
                        if (icon) {
                            feature.insertBefore(icon, feature.firstChild);
                        }
                    }
                });
            }
        });
    }
    
    updateAbout(about) {
        const subtitle = document.querySelector('#apropos .section__subtitle');
        if (subtitle) subtitle.textContent = about.subtitle;
        
        const title = document.querySelector('#apropos .section__title');
        if (title) title.textContent = about.title;
        
        const description = document.querySelector('.about__description');
        if (description) description.textContent = about.description;
        
        const statLabels = document.querySelectorAll('.stat__label');
        const statsData = [about.stats.projects, about.stats.countries, about.stats.satisfaction];
        
        statLabels.forEach((label, index) => {
            if (statsData[index]) {
                label.textContent = statsData[index];
            }
        });
        
        const btn = document.querySelector('#apropos .btn');
        if (btn) btn.textContent = about.btn;
    }
    
    updateProjects(projects) {
        const subtitle = document.querySelector('#realisations .section__subtitle');
        if (subtitle) subtitle.textContent = projects.subtitle;
        
        const title = document.querySelector('#realisations .section__title');
        if (title) title.textContent = projects.title;
        
        const description = document.querySelector('#realisations .section__description');
        if (description) description.textContent = projects.description;
        
        const projectCards = document.querySelectorAll('.project-card');
        const projectsData = [projects.project1, projects.project2, projects.project3];
        
        projectCards.forEach((card, index) => {
            if (projectsData[index]) {
                const project = projectsData[index];
                const cardTitle = card.querySelector('.project-card__title');
                const cardDesc = card.querySelector('.project-card__description');
                const cardCategory = card.querySelector('.project-card__category');
                
                if (cardTitle) cardTitle.textContent = project.title;
                if (cardDesc) cardDesc.textContent = project.description;
                if (cardCategory) cardCategory.textContent = project.category;
            }
        });
    }
    
    updateTestimonials(testimonials) {
        const subtitle = document.querySelector('#testimonials .section__subtitle');
        if (subtitle) subtitle.textContent = testimonials.subtitle;
        
        const title = document.querySelector('#testimonials .section__title');
        if (title) title.textContent = testimonials.title;
        
        const description = document.querySelector('#testimonials .section__description');
        if (description) description.textContent = testimonials.description;
        
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialsData = [
            testimonials.testimonial1,
            testimonials.testimonial2,
            testimonials.testimonial3,
            testimonials.testimonial4
        ];
        
        testimonialCards.forEach((card, index) => {
            if (testimonialsData[index]) {
                const testimonial = testimonialsData[index];
                const quote = card.querySelector('.testimonial__quote p');
                const name = card.querySelector('.author__name');
                const position = card.querySelector('.author__position');
                
                if (quote) quote.textContent = `"${testimonial.quote}"`;
                if (name) name.textContent = testimonial.name;
                if (position) position.textContent = testimonial.position;
            }
        });
    }
    
    updateContact(contact) {
        const subtitle = document.querySelector('#contact .section__subtitle');
        if (subtitle) subtitle.textContent = contact.subtitle;
        
        const title = document.querySelector('#contact .section__title');
        if (title) title.textContent = contact.title;
        
        const description = document.querySelector('.contact__description');
        if (description) description.textContent = contact.description;
        
        // Contact items
        const contactItems = document.querySelectorAll('.contact__item-content h4');
        const contactData = [contact.address.title, contact.phone.title, contact.email.title];
        
        contactItems.forEach((item, index) => {
            if (contactData[index]) {
                item.textContent = contactData[index];
            }
        });
        
        // Form labels
        const formLabels = document.querySelectorAll('.contact__form label');
        const formData = [
            contact.form.name,
            contact.form.email,
            contact.form.service,
            contact.form.message
        ];
        
        formLabels.forEach((label, index) => {
            if (formData[index]) {
                label.textContent = formData[index];
            }
        });
        
        // Service options
        const serviceOptions = document.querySelectorAll('#service option');
        if (serviceOptions.length > 0) {
            serviceOptions[0].textContent = contact.form.service_options.placeholder;
            serviceOptions[1].textContent = contact.form.service_options.real_estate;
            serviceOptions[2].textContent = contact.form.service_options.logistics;
            serviceOptions[3].textContent = contact.form.service_options.mining;
            serviceOptions[4].textContent = contact.form.service_options.other;
        }
        
        // Submit button
        const submitBtn = document.querySelector('.contact__form button[type="submit"] span');
        if (submitBtn) submitBtn.textContent = contact.form.submit;
    }
    
    updateQuote(quote) {
        const title = document.querySelector('.quote__title');
        if (title) title.textContent = quote.title;
        
        const description = document.querySelector('.quote__description');
        if (description) description.textContent = quote.description;
        
        const btn = document.querySelector('#devis .btn');
        if (btn) btn.textContent = quote.btn;
        
        const phone = document.querySelector('.quote__phone');
        if (phone) phone.innerHTML = `<i class="fas fa-phone"></i> ${quote.phone}`;
    }
    
    updateFooter(footer) {
        const description = document.querySelector('.footer__description');
        if (description) description.textContent = footer.description;
        
        const titles = document.querySelectorAll('.footer__title');
        const titlesData = [footer.services_title, footer.company_title, footer.contact_title];
        
        titles.forEach((title, index) => {
            if (titlesData[index]) {
                title.textContent = titlesData[index];
            }
        });
        
        const copyright = document.querySelector('.footer__copyright');
        if (copyright) copyright.textContent = footer.copyright;
        
        const legalLinks = document.querySelectorAll('.footer__legal a');
        if (legalLinks.length >= 2) {
            legalLinks[0].textContent = footer.legal;
            legalLinks[1].textContent = footer.privacy;
        }
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    // Get translation
    t(key, lang = null) {
        const targetLang = lang || this.currentLang;
        const keys = key.split('.');
        let value = this.translations[targetLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return value || key;
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.langManager = new LanguageManager();
});

// Update form messages with current language
document.addEventListener('languageChanged', (e) => {
    const lang = e.detail.language;
    // Update any dynamic content that depends on language
});