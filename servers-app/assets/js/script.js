document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Management ---
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (systemDark) {
        html.setAttribute('data-theme', 'dark');
    }

    themeBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // --- Mobile Menu Management ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-list a');

    function toggleMenu(show) {
        if (show) {
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

    if (navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) toggleMenu(false);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.site-header');

    function updateHeader() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // --- Smooth Scroll with Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    // Prepare elements
    const animatedElements = document.querySelectorAll('.service-card, .design-card, .section-title, .section-desc, .footer-grid > div');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        // Add subtle stagger to cards in the same grid
        // Simple heuristic: if it's a card, depend on its index relative to its container
        if (el.classList.contains('service-card') || el.classList.contains('design-card')) {
            // We can just rely on the CSS transition delay or random stagger
            // A simple way to stagger is to set style.transitionDelay based on position in parent
            const indexInParent = Array.from(el.parentNode.children).indexOf(el);
            el.style.transitionDelay = `${indexInParent * 100}ms`;
        }
        animateOnScroll.observe(el);
    });

});
