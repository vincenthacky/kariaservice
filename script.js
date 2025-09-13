/* Kariaservice - Interactive JavaScript */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initializeNavigation();
    initializeHeroSlider();
    initializeScrollEffects();
    initializeAnimations();
    initializeIconAnimations();
    initializeCardEffects();
    initializeForms();
    initializeSlideBackgrounds();
    initializeExcellenceGallery();
    initializeTestimonialsSlider();
    
});

/* Navigation Functionality */
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                
                // Reset hamburger menu
                const bars = navToggle.querySelectorAll('span');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const scrollY = window.pageYOffset;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* Hero Slider Functionality */
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero__prev');
    const nextBtn = document.querySelector('.hero__next');
    
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Initialize slider
    showSlide(currentSlide);
    startAutoSlide();
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
            startAutoSlide();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = index;
            showSlide(currentSlide);
            startAutoSlide();
        });
    });
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    // Pause auto-slide on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
}

/* Initialize slide backgrounds */
function initializeSlideBackgrounds() {
    const slides = document.querySelectorAll('.slide[data-bg]');
    
    slides.forEach(slide => {
        const bgUrl = slide.getAttribute('data-bg');
        if (bgUrl) {
            slide.style.backgroundImage = `url(${bgUrl})`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
        }
    });
}

/* Scroll Effects and Animations */
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('fade-in-stagger')) {
                    const parent = entry.target.parentElement;
                    if (parent.classList.contains('services__grid') || parent.classList.contains('projects__grid')) {
                        const siblings = Array.from(parent.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.15}s`;
                    }
                }
                
                // Add special effects for icons
                if (entry.target.querySelector('.icon-float, .icon-pulse')) {
                    setTimeout(() => {
                        const icons = entry.target.querySelectorAll('.icon-float, .icon-pulse');
                        icons.forEach(icon => {
                            icon.style.animationPlayState = 'running';
                        });
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .fade-in-stagger, .service-card, .project-card, .about__text, .about__image, .contact__info, .contact__form-container').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section (subtle)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero__content');
        
        if (heroContent) {
            const speed = scrolled * 0.1;
            heroContent.style.transform = `translateY(${speed}px)`;
        }
    });
}

/* Animation Effects */
function initializeAnimations() {
    // Counter animation for statistics
    const counters = document.querySelectorAll('.stat__number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current) + suffix;
            }
        }, 40);
    };
    
    // Trigger counter animation when in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        let isVisible = false;
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isVisible) {
                    isVisible = true;
                    setTimeout(() => {
                        typeWriter(heroTitle, text);
                    }, 500);
                }
            });
        });
        
        titleObserver.observe(heroTitle);
    }
}

function typeWriter(element, html, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText;
    
    function type() {
        if (i < text.length) {
            element.innerHTML = html.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* Form Handling */
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Float label effect
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Check if input has value on load
                checkInput(input, label);
                
                // Check on input events
                input.addEventListener('input', () => checkInput(input, label));
                input.addEventListener('focus', () => checkInput(input, label));
                input.addEventListener('blur', () => checkInput(input, label));
                input.addEventListener('change', () => checkInput(input, label));
            }
        });
        
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
    });
}

function checkInput(input, label) {
    if (input.value !== '' || input === document.activeElement) {
        label.classList.add('active');
    } else {
        label.classList.remove('active');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Basic validation
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        if (!field.value.trim()) {
            isValid = false;
            formGroup.classList.add('error');
            field.style.borderColor = 'var(--primary-red)';
        } else {
            formGroup.classList.remove('error');
            field.style.borderColor = '';
        }
    });
    
    if (isValid) {
        // Show loading state
        const originalText = submitBtn.innerHTML;
        const loadingText = window.langManager ? window.langManager.t('messages.form_sending') : 'Envoi en cours...';
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Show success message
            showNotification('messages.form_success', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Reset floating labels
            const labels = form.querySelectorAll('label');
            labels.forEach(label => label.classList.remove('active'));
            
        }, 2000);
        
    } else {
        showNotification('messages.form_error', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Use translated messages if language manager is available
    if (window.langManager && typeof message === 'string' && message.startsWith('messages.')) {
        const key = message.replace('messages.', '');
        message = window.langManager.t(`messages.${key}`);
    }
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-green)' : 'var(--primary-red)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: var(--transition);
        max-width: 400px;
    `;
    
    notification.querySelector('.notification__content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    notification.querySelector('.notification__close').style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 0.875rem;
        opacity: 0.8;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification__close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/* Icon Animations */
function initializeIconAnimations() {
    // Initially pause all icon animations
    const iconElements = document.querySelectorAll('.icon-float, .icon-pulse');
    iconElements.forEach(icon => {
        icon.style.animationPlayState = 'paused';
    });
}

/* Enhanced Card Interactions */
function initializeCardEffects() {
    const cards = document.querySelectorAll('.service-card, .project-card');
    
    cards.forEach(card => {
        // Add magnetic effect for cards
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 5;
            const rotateY = deltaX * -5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* Utility Functions */
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

// Add scroll progress indicator
function addScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
addScrollProgressIndicator();

/* Excellence Gallery Functionality */
function initializeExcellenceGallery() {
    const tabItems = document.querySelectorAll('.tab-item');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (tabItems.length === 0 || galleryItems.length === 0) return;
    
    // Initialize gallery backgrounds
    galleryItems.forEach(item => {
        const bgUrl = item.getAttribute('data-bg');
        if (bgUrl) {
            item.style.backgroundImage = `url(${bgUrl})`;
        }
    });
    
    // Tab switching functionality
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and gallery items
            tabItems.forEach(t => t.classList.remove('active'));
            galleryItems.forEach(g => g.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding gallery item
            const targetGallery = document.getElementById(targetTab);
            if (targetGallery) {
                targetGallery.classList.add('active');
            }
        });
    });
    
    // Auto-rotate functionality (optional)
    let currentIndex = 0;
    const autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % tabItems.length;
        tabItems[currentIndex].click();
    }, 8000); // Change every 8 seconds
    
    // Pause auto-rotate on hover
    const excellenceSection = document.querySelector('.excellence');
    if (excellenceSection) {
        excellenceSection.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        
        excellenceSection.addEventListener('mouseleave', () => {
            // Restart auto-rotate when mouse leaves
            setTimeout(() => {
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % tabItems.length;
                    tabItems[currentIndex].click();
                }, 8000);
            }, 2000);
        });
    }
}

/* Testimonials Slider Functionality */
function initializeTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonials__prev');
    const nextBtn = document.querySelector('.testimonials__next');
    const dots = document.querySelectorAll('.testimonials__dots .dot');
    
    if (testimonialCards.length === 0) return;
    
    let currentTestimonial = 0;
    let testimonialInterval;
    
    // Initialize slider
    showTestimonial(currentTestimonial);
    startAutoTestimonial();
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoTestimonial();
            currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
            showTestimonial(currentTestimonial);
            startAutoTestimonial();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoTestimonial();
            nextTestimonial();
            startAutoTestimonial();
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoTestimonial();
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
            startAutoTestimonial();
        });
    });
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === index) {
                card.classList.add('active');
            } else if (i < index) {
                card.classList.add('prev');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function startAutoTestimonial() {
        testimonialInterval = setInterval(nextTestimonial, 6000); // Change every 6 seconds
    }
    
    function stopAutoTestimonial() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
        }
    }
    
    // Pause auto-slide on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopAutoTestimonial);
        testimonialsSection.addEventListener('mouseleave', startAutoTestimonial);
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const slider = document.querySelector('.testimonials__slider');
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                stopAutoTestimonial();
                if (diff > 0) {
                    // Swipe left - next
                    nextTestimonial();
                } else {
                    // Swipe right - previous
                    currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
                    showTestimonial(currentTestimonial);
                }
                startAutoTestimonial();
            }
        }
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Performance optimization: lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

console.log('🎉 Kariaservice website loaded successfully!');