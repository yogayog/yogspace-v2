/**
 * YogSpace — Lenis Smooth Scroll Engine & GSAP Integration
 */

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check if Lenis library is loaded
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis Scroll library not detected, falling back to native scroll.');
        return;
    }

    // Initialize Lenis with smooth luxury easing and inertia
    lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        smoothTouch: false,
        touchMultiplier: 1.5,
    });

    // Expose lenis instance globally for optional external triggers
    window.lenis = lenisInstance;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        // Disable GSAP lag smoothing to prevent scroll frame throttling/delay
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Smooth scroll for anchor navigation links with dynamic header offset
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                e.preventDefault();
                const header = document.getElementById('main-header');
                const headerOffset = header ? header.offsetHeight + 35 : 95;

                if (lenisInstance) {
                    lenisInstance.scrollTo(targetEl, {
                        offset: -headerOffset,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
