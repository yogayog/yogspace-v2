/**
 * YogSpace — GSAP ScrollTrigger Animations & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;
    
    // Register GSAP Plugins
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* -------------------------------------------------------------------------- */
    /* 1. HERO REVEAL ANIMATIONS                                                   */
    /* -------------------------------------------------------------------------- */
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl
        .from('.hero-badge', { y: -30, opacity: 0, delay: 0.2 })
        .from('.hero-title', { y: 50, opacity: 0, scale: 0.95 }, '-=0.8')
        .from('.hero-sub', { y: 30, opacity: 0 }, '-=0.8')
        .from('.hero-actions', { y: 30, opacity: 0, stagger: 0.15 }, '-=0.8');

    /* -------------------------------------------------------------------------- */
    /* 2. STICKY HEADER GLASSMORPHISM SHIFT                                       */
    /* -------------------------------------------------------------------------- */
    const header = document.getElementById('main-header');
    if (header && typeof ScrollTrigger !== 'undefined') {
        let isScrolled = false;
        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                const scrolled = self.scroll() > 80;
                if (scrolled !== isScrolled) {
                    isScrolled = scrolled;
                    if (isScrolled) {
                        header.classList.add('bg-white/90', 'backdrop-blur-md', 'border-b', 'border-slate-200', 'shadow-sm', 'py-3');
                        header.classList.remove('py-5');
                    } else {
                        header.classList.remove('bg-white/90', 'border-b', 'border-slate-200', 'shadow-sm');
                        header.classList.add('py-5');
                    }
                }
            }
        });
    }

    /* -------------------------------------------------------------------------- */
    /* 3. ABOUT SECTION: SCROLL-TRIGGERED WORD LIGHTING HIGHLIGHT                  */
    /* -------------------------------------------------------------------------- */
    const highlightParagraph = document.getElementById('scroll-highlight-text');
    if (highlightParagraph && typeof ScrollTrigger !== 'undefined') {
        // Wrap words in span without CSS transitions to prevent GSAP scrub conflict
        const words = highlightParagraph.innerText.split(' ');
        highlightParagraph.innerHTML = words.map(word => `<span class="highlight-word opacity-25 inline mr-1.5 text-mutedGrey">${word}</span>`).join('');

        const wordSpans = highlightParagraph.querySelectorAll('.highlight-word');

        gsap.to(wordSpans, {
            opacity: 1,
            color: '#0F172A',
            stagger: 0.05,
            scrollTrigger: {
                trigger: '#about',
                start: 'top 75%',
                end: 'bottom 45%',
                scrub: 0.8
            }
        });
    }

    /* -------------------------------------------------------------------------- */
    /* 4. STAT COUNTERS ANIMATION                                                 */
    /* -------------------------------------------------------------------------- */
    const statCounters = document.querySelectorAll('.stat-counter');
    if (statCounters.length > 0 && typeof ScrollTrigger !== 'undefined') {
        statCounters.forEach(counter => {
            const targetVal = parseFloat(counter.getAttribute('data-target'));
            const isFloat = targetVal % 1 !== 0;

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    let obj = { val: 0 };
                    gsap.to(obj, {
                        val: targetVal,
                        duration: 2.2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            counter.innerText = isFloat ? obj.val.toFixed(1) : Math.floor(obj.val);
                        }
                    });
                }
            });
        });
    }

    /* -------------------------------------------------------------------------- */
    /* 5. SERVICES SECTION: 3D TILT CARDS & MOUSE SPOTLIGHT (Cached rect)        */
    /* -------------------------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let rect = null;

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set spotlight CSS variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg tilt for smoothness
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            rect = null;
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.4s ease';
        });
    });

    /* -------------------------------------------------------------------------- */
    /* 6. PORTFOLIO SHOWCASE: GSAP HORIZONTAL SCROLL PINNING                      */
    /* -------------------------------------------------------------------------- */
    const portfolioPinWrapper = document.getElementById('portfolio-pin-wrapper');
    const portfolioTrack = document.getElementById('portfolio-track');

    if (portfolioPinWrapper && portfolioTrack && typeof ScrollTrigger !== 'undefined') {
        // Calculate scroll length needed
        const getScrollAmount = () => {
            let trackWidth = portfolioTrack.scrollWidth;
            return -(trackWidth - window.innerWidth + 100);
        };

        const horizontalTween = gsap.to(portfolioTrack, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: '#portfolio',
                pin: true,
                scrub: 0.8,
                start: 'top top',
                end: () => `+=${portfolioTrack.scrollWidth - window.innerWidth + 300}`,
                invalidateOnRefresh: true
            }
        });
    }

    // Refresh ScrollTrigger after assets load to align pinning and scroll lengths perfectly
    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });
});
