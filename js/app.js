/**
 * YogSpace — Application Logic, Theme Switcher & WhatsApp Integration
 */

// Theme Management Helper (Self-executing to prevent flash of wrong theme)
(function initThemeEarly() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Set Current Year in Footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Default WhatsApp Number for YogSpace
    const waNumber = "6285748961065";

    // 3. Dark/Light Theme Dongle Toggle Handler
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
    
    function updateThemeIcons(isDark) {
        themeToggleBtns.forEach(btn => {
            const sunIcon = btn.querySelector('.theme-icon-sun');
            const moonIcon = btn.querySelector('.theme-icon-moon');
            if (sunIcon && moonIcon) {
                if (isDark) {
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                } else {
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                }
            }
        });
    }

    // Initial icon state
    updateThemeIcons(document.documentElement.classList.contains('dark'));

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
        });
    });

    // 4. Service Cards Click Listener -> Open Detail Services & Pricing Page (services.html)
    const serviceCards = document.querySelectorAll('.service-card[data-category], .service-card[data-service]');
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const category = card.getAttribute('data-category');
            if (category) {
                window.location.href = `services.html?category=${encodeURIComponent(category)}`;
            } else {
                window.location.href = `services.html`;
            }
        });
    });

    // 5. Package Filtering on Services Detail Page (services.html)
    const categoryTabs = document.querySelectorAll('.service-tab-btn');
    const packageCards = document.querySelectorAll('.pricing-package-card');

    if (categoryTabs.length > 0 && packageCards.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategory = urlParams.get('category');

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                
                categoryTabs.forEach(t => {
                    t.classList.remove('bg-slateDark', 'text-white', 'dark:bg-emerald-600');
                    t.classList.add('bg-slateLight', 'text-slateDark', 'dark:bg-slate-800', 'dark:text-slate-200');
                });
                
                tab.classList.remove('bg-slateLight', 'text-slateDark', 'dark:bg-slate-800', 'dark:text-slate-200');
                tab.classList.add('bg-slateDark', 'text-white', 'dark:bg-emerald-600');

                packageCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        card.classList.remove('opacity-0', 'scale-95');
                        card.classList.add('opacity-100', 'scale-100');
                    } else {
                        card.style.display = 'none';
                        card.classList.add('opacity-0', 'scale-95');
                    }
                });
            });
        });

        // Auto-select tab if category parameter is present in URL
        if (selectedCategory) {
            const matchingTab = document.querySelector(`.service-tab-btn[data-category="${selectedCategory}"]`);
            if (matchingTab) {
                matchingTab.click();
            }
        }
    }

    // 6. Mobile Hamburger Menu (Garis 3) Toggle Handler
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenuDrawer) {
        let isMobileMenuOpen = false;
        mobileMenuBtn.addEventListener('click', () => {
            isMobileMenuOpen = !isMobileMenuOpen;
            if (isMobileMenuOpen) {
                mobileMenuDrawer.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
                mobileMenuDrawer.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                mobileMenuBtn.innerHTML = `<i data-lucide="x" class="w-5 h-5 text-slateDark dark:text-white"></i>`;
            } else {
                mobileMenuDrawer.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                mobileMenuDrawer.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
                mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-5 h-5 text-slateDark dark:text-white"></i>`;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMobileMenuOpen = false;
                mobileMenuDrawer.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                mobileMenuDrawer.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
                mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-5 h-5 text-slateDark dark:text-white"></i>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });
    }

    // 6. Contact Form Submission & WhatsApp Direct Redirection
    const contactForm = document.getElementById('contact-form');
    const modalSuccess = document.getElementById('modal-success');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract Form Input Values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email) return;

            // Format WhatsApp Message
            const waText = `Halo YogSpace,\n\nNama: ${name}\nKontak/Email: ${email}\nLayanan yang Dipilih: ${service}\nPesan: ${message}`;
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

            // Show Confirmation Modal
            if (modalSuccess) {
                modalSuccess.classList.remove('opacity-0', 'pointer-events-none');
                modalSuccess.classList.add('opacity-100', 'pointer-events-auto');
            }

            // Open WhatsApp in new tab after brief delay
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 600);

            // Reset Form Fields
            contactForm.reset();
        });

        // Close Modal Listeners
        if (modalCloseBtn && modalSuccess) {
            modalCloseBtn.addEventListener('click', () => {
                modalSuccess.classList.remove('opacity-100', 'pointer-events-auto');
                modalSuccess.classList.add('opacity-0', 'pointer-events-none');
            });

            modalSuccess.addEventListener('click', (e) => {
                if (e.target === modalSuccess) {
                    modalSuccess.classList.remove('opacity-100', 'pointer-events-auto');
                    modalSuccess.classList.add('opacity-0', 'pointer-events-none');
                }
            });
        }
    }

    /* -------------------------------------------------------------------------- */
    /* 7. SURVEY REGISTRATION MODAL FOR PACKAGE ORDER BUTTONS                     */
    /* -------------------------------------------------------------------------- */
    const surveyModal = document.getElementById('survey-modal');
    const surveyForm = document.getElementById('survey-form');
    const surveyModalClose = document.getElementById('survey-modal-close');
    const surveyModalCancel = document.getElementById('survey-modal-cancel');
    const modalPackageName = document.getElementById('modal-package-name');
    const modalPackagePrice = document.getElementById('modal-package-price');
    const surveyDateInput = document.getElementById('survey-date');

    let currentSelectedPackage = { name: '', price: '' };

    function closeSurveyModal() {
        if (!surveyModal) return;
        surveyModal.classList.remove('opacity-100', 'pointer-events-auto');
        surveyModal.classList.add('opacity-0', 'pointer-events-none');
    }

    // Attach click listeners to all "Pesan Paket" buttons inside package cards
    const orderButtons = document.querySelectorAll('.pricing-package-card a');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.pricing-package-card');
            
            let packageName = "Paket Layanan YogSpace";
            let packagePrice = "";

            if (card) {
                const titleEl = card.querySelector('h3');
                const priceEl = card.querySelector('.font-extrabold');
                if (titleEl) packageName = titleEl.innerText.trim();
                if (priceEl) packagePrice = priceEl.innerText.trim();
            }

            currentSelectedPackage = { name: packageName, price: packagePrice };

            if (modalPackageName) modalPackageName.innerText = packageName;
            if (modalPackagePrice) modalPackagePrice.innerText = packagePrice || 'Konsultasi Gratis';

            // Set default survey date to tomorrow
            if (surveyDateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                surveyDateInput.value = tomorrow.toISOString().split('T')[0];
            }

            if (surveyModal) {
                surveyModal.classList.remove('opacity-0', 'pointer-events-none');
                surveyModal.classList.add('opacity-100', 'pointer-events-auto');
            }
        });
    });

    if (surveyModalClose) surveyModalClose.addEventListener('click', closeSurveyModal);
    if (surveyModalCancel) surveyModalCancel.addEventListener('click', closeSurveyModal);
    
    if (surveyModal) {
        surveyModal.addEventListener('click', (e) => {
            if (e.target === surveyModal) closeSurveyModal();
        });
    }

    if (surveyForm) {
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('survey-name').value.trim();
            const phone = document.getElementById('survey-phone').value.trim();
            const address = document.getElementById('survey-address').value.trim();
            const date = document.getElementById('survey-date').value;
            const notes = document.getElementById('survey-notes').value.trim();

            if (!name || !phone || !address || !date) return;

            const waMsg = `Halo YogSpace, saya ingin mengajukan Survey & Pemesanan Paket:\n\n` +
                          `📌 LAYANAN YANG DIPILIH:\n` +
                          `• Paket: ${currentSelectedPackage.name}\n` +
                          `• Est. Harga: ${currentSelectedPackage.price || '-'}\n\n` +
                          `👤 DATA PEMESAN:\n` +
                          `• Nama Lengkap: ${name}\n` +
                          `• No. WhatsApp: ${phone}\n` +
                          `• Alamat Lokasi: ${address}\n\n` +
                          `📅 RENCANA JADWAL SURVEY:\n` +
                          `• Tanggal Survey: ${date}\n` +
                          (notes ? `• Catatan Tambahan: ${notes}\n\n` : `\n`) +
                          `Mohon konfirmasi jadwal survey & info teknisi selanjutnya. Terima kasih!`;

            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;
            window.open(waUrl, '_blank');

            closeSurveyModal();
            surveyForm.reset();
        });
    }

    /* -------------------------------------------------------------------------- */
    /* 8. PORTFOLIO SHOWCASE: HORIZONTAL SCROLL BUTTON CONTROLS                   */
    /* -------------------------------------------------------------------------- */
    const portfolioContainer = document.getElementById('portfolio-scroll-container');
    const scrollLeftBtn = document.getElementById('portfolio-scroll-left');
    const scrollRightBtn = document.getElementById('portfolio-scroll-right');

    if (portfolioContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            portfolioContainer.scrollBy({ left: -450, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener('click', () => {
            portfolioContainer.scrollBy({ left: 450, behavior: 'smooth' });
        });
    }
});
