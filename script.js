/**
 * Papa Sureña Website Application
 * Clean, Modern, and Responsive JavaScript
 */

class PapaSurenaApp {
    constructor() {
        this.navbar = null;
        this.navToggle = null;
        this.navMenu = null;
        this.contactForm = null;
        this.whatsappButton = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupContactForm();
        this.setupWhatsApp();
        this.setupScrollEffects();
        this.setupImageLazyLoading();
        this.setupAnimations();
        this.setupGallery();
        this.setupPrivacyBanner();
        this.setupFloatingWhatsApp();
    }

    setupEventListeners() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }

        // Window Events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        // Prevent form spam
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    onDOMReady() {
        // Get DOM elements
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.contactForm = document.querySelector('#contact-form');
        this.whatsappButton = document.querySelector('.nav-whatsapp');
        
        // Initialize components
        this.initializeComponents();
    }

    initializeComponents() {
        console.log('Papa Sureña App initialized successfully!');
        
        // Set initial states
        this.updateNavbar();
        this.updateScrollIndicator();
    }

    // === NAVIGATION FUNCTIONALITY === //
    setupNavigation() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Navigation links smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (this.navMenu?.classList.contains('active') && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.navMenu?.classList.add('active');
        this.navToggle?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Accessibility
        this.navMenu?.setAttribute('aria-expanded', 'true');
    }

    closeMobileMenu() {
        this.navMenu?.classList.remove('active');
        this.navToggle?.classList.remove('active');
        document.body.style.overflow = '';
        
        // Accessibility
        this.navMenu?.setAttribute('aria-expanded', 'false');
    }

    smoothScrollTo(target) {
        const navbarHeight = this.navbar?.offsetHeight || 70;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // === SCROLL EFFECTS === //
    setupScrollEffects() {
        // Throttle scroll events for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                this.updateNavbar();
                this.updateScrollIndicator();
                this.revealElementsOnScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }, { passive: true });
    }

    handleScroll() {
        this.updateNavbar();
        this.updateScrollIndicator();
    }

    updateNavbar() {
        if (!this.navbar) return;
        
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }

    updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;
        
        const scrolled = window.scrollY > 100;
        scrollIndicator.style.opacity = scrolled ? '0' : '1';
        scrollIndicator.style.visibility = scrolled ? 'hidden' : 'visible';
    }

    revealElementsOnScroll() {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    // === CONTACT FORM === //
    setupContactForm() {
        if (!this.contactForm) return;
        
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(e);
        });

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleContactSubmit(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(data)) {
            this.showMessage('Por favor complete todos los campos correctamente.', 'error');
            return;
        }

        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            // Simulate form submission
            await this.submitForm(data);
            
            // Success
            this.showMessage('¡Mensaje enviado correctamente! Nos contactaremos pronto.', 'success');
            this.contactForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showMessage('Error al enviar el mensaje. Intente nuevamente.', 'error');
        } finally {
            // Restore button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    validateForm(data) {
        const { name, email, message } = data;
        
        // Basic validation
        if (!name?.trim() || name.length < 2) {
            this.showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Ingrese un email válido');
            return false;
        }
        
        if (!message?.trim() || message.length < 10) {
            this.showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }
        
        return true;
    }

    validateField(input) {
        const value = input.value.trim();
        const name = input.name;
        
        switch (name) {
            case 'name':
                if (!value || value.length < 2) {
                    this.showFieldError(name, 'El nombre debe tener al menos 2 caracteres');
                    return false;
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(name, 'Ingrese un email válido');
                    return false;
                }
                break;
            case 'message':
                if (!value || value.length < 10) {
                    this.showFieldError(name, 'El mensaje debe tener al menos 10 caracteres');
                    return false;
                }
                break;
        }
        
        this.clearFieldError(name);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        // Remove existing error
        this.clearFieldError(fieldName);
        
        // Add error styling
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(fieldName) {
        const field = typeof fieldName === 'string' 
            ? document.querySelector(`[name="${fieldName}"]`)
            : fieldName;
            
        if (!field) return;
        
        // Remove error styling
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        // Style the message
        Object.assign(messageElement.style, {
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: '500',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            opacity: '0',
            transform: 'translateY(-10px)'
        });
        
        // Type-specific styling
        if (type === 'success') {
            messageElement.style.backgroundColor = '#dcfce7';
            messageElement.style.color = '#166534';
            messageElement.style.border = '1px solid #bbf7d0';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#fee2e2';
            messageElement.style.color = '#dc2626';
            messageElement.style.border = '1px solid #fecaca';
        } else {
            messageElement.style.backgroundColor = '#e0f2fe';
            messageElement.style.color = '#0369a1';
            messageElement.style.border = '1px solid #bae6fd';
        }
        
        // Insert message
        if (this.contactForm) {
            this.contactForm.insertBefore(messageElement, this.contactForm.firstChild);
            
            // Animate in
            requestAnimationFrame(() => {
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.opacity = '0';
                    messageElement.style.transform = 'translateY(-10px)';
                    setTimeout(() => messageElement.remove(), 300);
                }
            }, 5000);
        }
    }

    // === WHATSAPP INTEGRATION === //
    setupWhatsApp() {
        // WhatsApp button functionality
        document.querySelectorAll('.whatsapp-btn, .nav-whatsapp').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp();
            });
        });
    }

    openWhatsApp() {
        const phoneNumber = '+56958979618'; // Número real actualizado
        const message = encodeURIComponent(
            '¡Hola Papa Patagonia! Me interesa conocer más sobre sus productos agrícolas. ¿Podrían brindarme más información?'
        );
        
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        
        // Track engagement
        this.trackEvent('whatsapp_click', {
            source: 'website',
            timestamp: new Date().toISOString()
        });
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }

    // === ANIMATIONS === //
    setupAnimations() {
        // Setup Intersection Observer for animations
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }
        
        // Setup scroll-based animations
        this.setupScrollAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollAnimations() {
        // Counter animation for statistics
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        element.classList.add('counted');
        const target = parseInt(element.textContent);
        const increment = target / 50; // 50 steps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }

    // === IMAGE LAZY LOADING === //
    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // === UTILITY METHODS === //
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    trackEvent(eventName, eventData = {}) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Console log for development
        console.log('Event tracked:', eventName, eventData);
    }

    cleanup() {
        // Cleanup before page unload
        document.body.style.overflow = '';
    }

    // === GALLERY FUNCTIONALITY === //
    setupGallery() {
        this.galleryImages = ['images/01.jpeg', 'images/03.jpg', 'images/05.jpeg'];
        this.currentImageIndex = 0;
        
        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openGalleryModal(index);
            });
        });
        
        // Modal controls
        const modal = document.getElementById('gallery-modal');
        const closeBtn = document.querySelector('.gallery-close');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGalleryModal());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.showPreviousImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showNextImage());
        }
        
        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeGalleryModal();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal && modal.classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeGalleryModal();
                        break;
                    case 'ArrowLeft':
                        this.showPreviousImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            }
        });
    }
    
    openGalleryModal(imageIndex) {
        this.currentImageIndex = imageIndex;
        const modal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('modal-image');
        
        if (modal && modalImage) {
            modalImage.src = this.galleryImages[imageIndex];
            modalImage.alt = `Papa Patagonia - Imagen ${imageIndex + 1}`;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Track gallery engagement
            this.trackEvent('gallery_open', {
                image_index: imageIndex,
                image_src: this.galleryImages[imageIndex]
            });
        }
    }
    
    closeGalleryModal() {
        const modal = document.getElementById('gallery-modal');
        
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                const modalImage = document.getElementById('modal-image');
                if (modalImage) {
                    modalImage.src = '';
                }
            }, 300);
        }
    }
    
    showPreviousImage() {
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.galleryImages.length - 1;
        this.updateModalImage();
    }
    
    showNextImage() {
        this.currentImageIndex = this.currentImageIndex < this.galleryImages.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        this.updateModalImage();
    }
    
    updateModalImage() {
        const modalImage = document.getElementById('modal-image');
        
        if (modalImage) {
            // Fade effect
            modalImage.style.opacity = '0';
            
            setTimeout(() => {
                modalImage.src = this.galleryImages[this.currentImageIndex];
                modalImage.alt = `Papa Patagonia - Imagen ${this.currentImageIndex + 1}`;
                modalImage.style.opacity = '1';
            }, 150);
        }
    }

    // === FLOATING WHATSAPP === //
    setupFloatingWhatsApp() {
        const floatButton = document.querySelector('.whatsapp-float-btn');
        
        if (floatButton) {
            // Track clicks on floating WhatsApp button
            floatButton.addEventListener('click', () => {
                this.trackEvent('whatsapp_float_click', {
                    source: 'floating_button',
                    timestamp: new Date().toISOString(),
                    page_section: this.getCurrentSection()
                });
            });

            // Show/hide based on scroll position
            this.setupFloatingButtonVisibility();
        }
    }

    setupFloatingButtonVisibility() {
        const floatContainer = document.getElementById('whatsapp-float');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isScrollingDown = scrollTop > lastScrollTop;
            const shouldShow = scrollTop > 300; // Show after scrolling 300px
            
            if (floatContainer) {
                if (shouldShow) {
                    floatContainer.style.opacity = '1';
                    floatContainer.style.visibility = 'visible';
                    floatContainer.style.transform = isScrollingDown ? 'translateY(0)' : 'translateY(0) scale(1.05)';
                } else {
                    floatContainer.style.opacity = '0.7';
                }
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    getCurrentSection() {
        const sections = ['inicio', 'productos', 'calidad', 'galeria', 'contacto'];
        const scrollPosition = window.scrollY + 100;
        
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    return sectionId;
                }
            }
        }
        return 'unknown';
    }

    // === PRIVACY BANNER & MODAL === //
    setupPrivacyBanner() {
        // Check if user has already accepted privacy policy
        const privacyAccepted = localStorage.getItem('privacyAccepted');
        
        if (!privacyAccepted) {
            // Show banner after a short delay
            setTimeout(() => {
                const banner = document.getElementById('privacy-banner');
                if (banner) {
                    banner.classList.add('show');
                }
            }, 2000);
        }
    }

    // === ERROR HANDLING === //
    handleError(error, context = '') {
        console.error(`Papa Sureña App Error ${context}:`, error);
        
        // Optional: Send error to logging service
        if (typeof logError === 'function') {
            logError(error, context);
        }
    }
}

// === CSS ANIMATION STYLES (Injected via JavaScript) === //
const addAnimationStyles = () => {
    const styles = `
        .fade-in {
            opacity: 0;
            transition: opacity 0.6s ease;
        }
        
        .fade-in.animate-in {
            opacity: 1;
        }
        
        .slide-in-left {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-left.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        
        .slide-in-right {
            opacity: 0;
            transform: translateX(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-right.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        
        .slide-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-up.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        img[data-src] {
            opacity: 0;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
};

// === APP INITIALIZATION === //
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    window.papaSurenaApp = new PapaSurenaApp();
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Papa Sureña Website Error:', e.error);
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PapaSurenaApp;
}

// === GLOBAL PRIVACY FUNCTIONS === //
function acceptPrivacyPolicy() {
    localStorage.setItem('privacyAccepted', 'true');
    localStorage.setItem('privacyDate', new Date().toISOString());
    hidePrivacyBanner();
    closePrivacyModal();
    
    // Track acceptance
    if (window.papaSurenaApp) {
        window.papaSurenaApp.trackEvent('privacy_accepted', {
            date: new Date().toISOString(),
            method: 'banner'
        });
    }
}

function hidePrivacyBanner() {
    const banner = document.getElementById('privacy-banner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function showPrivacyPolicy() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
