/**
 * YogSpace — Custom Follower Cursor & Magnetic Physics Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorFollower = document.getElementById('cursor-follower');
    const cursorText = document.getElementById('cursor-text');

    if (!cursorDot || !cursorFollower) return;

    // Mouse positions
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Follower position (with lerp interpolation)
    let followerX = mouseX;
    let followerY = mouseY;

    // Check touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.remove('custom-cursor-active');
        cursorDot.style.display = 'none';
        cursorFollower.style.display = 'none';
        return;
    }

    // Update mouse coordinates with passive listener
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Position tiny dot instantly
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Render loop for smooth follower physics (lerp)
    function renderCursor() {
        const ease = 0.15;
        followerX += (mouseX - followerX) * ease;
        followerY += (mouseY - followerY) * ease;

        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover Listeners
    function attachCursorEvents() {
        // Interactive Elements (Links, Buttons, Magnetic)
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [data-cursor="pointer"]');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('cursor-hover');
            });
        });

        // Project Cards
        const projectElements = document.querySelectorAll('[data-cursor="project"]');
        projectElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('cursor-project');
                if (cursorText) cursorText.textContent = 'Lihat';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('cursor-project');
                if (cursorText) cursorText.textContent = '';
            });
        });

        // Magnetic Pulling Effect for Buttons with .magnetic-target (Cached rect to prevent reflows)
        const magneticElements = document.querySelectorAll('.magnetic-target');
        magneticElements.forEach((el) => {
            let rect = null;

            el.addEventListener('mouseenter', () => {
                rect = el.getBoundingClientRect();
                el.style.transition = 'none';
            });

            el.addEventListener('mousemove', (e) => {
                if (!rect) rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distanceX = (e.clientX - centerX) * 0.25;
                const distanceY = (e.clientY - centerY) * 0.25;

                el.style.transform = `translate3d(${distanceX}px, ${distanceY}px, 0)`;
            }, { passive: true });

            el.addEventListener('mouseleave', () => {
                rect = null;
                el.style.transform = `translate3d(0px, 0px, 0)`;
                el.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
        });
    }

    attachCursorEvents();
});
