document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // 1. UNIVERSAL SCROLL-REVEAL SYSTEM FOR CARDS & SECTIONS
    // =====================================================
    const revealElements = document.querySelectorAll('.reveal-card, .card');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // =====================================================
    // 2. LIVE STATISTIC NUMBER COUNTERS
    // =====================================================
    const counterElements = document.querySelectorAll('[data-counter]');
    if (counterElements.length > 0) {
        function animateCounter(el) {
            const target = parseFloat(el.getAttribute('data-counter'));
            const isDecimal = target % 1 !== 0;
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                // Cubic ease-out
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = target * easeOut;
                el.textContent = prefix + (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = prefix + (isDecimal ? target.toFixed(2) : target) + suffix;
                }
            }
            requestAnimationFrame(update);
        }

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    // =====================================================
    // 3. INTERACTIVE 3D MOUSE TILT ON CARDS
    // =====================================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (-y / rect.height) * 10;
            const rotateY = (x / rect.width) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transform = '';
        });
    });

    // =====================================================
    // 4. GROWTH CHAT FORM VALIDATION
    // =====================================================
    const form = document.getElementById('growthForm');
    if (form) {
        const fields = [
            { id: 'firstName', errorId: 'firstNameError' },
            { id: 'lastName', errorId: 'lastNameError' },
            { id: 'email', errorId: 'emailError', isEmail: true },
            { id: 'subject', errorId: 'subjectError' },
            { id: 'message', errorId: 'messageError' }
        ];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function validateField(fieldConfig) {
            const input = document.getElementById(fieldConfig.id);
            const errorMsg = document.getElementById(fieldConfig.errorId);
            if (!input || !errorMsg) return true;

            const value = input.value.trim();

            if (value === '') {
                errorMsg.textContent = 'Please fill out this field.';
                errorMsg.classList.remove('hidden');
                input.classList.add('border-red-500');
                return false;
            }

            if (fieldConfig.isEmail && !emailRegex.test(value)) {
                errorMsg.textContent = 'Please enter a valid email address.';
                errorMsg.classList.remove('hidden');
                input.classList.add('border-red-500');
                return false;
            }

            errorMsg.classList.add('hidden');
            input.classList.remove('border-red-500');
            return true;
        }

        // Real-time validation on input/blur
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('input', () => validateField(field));
                input.addEventListener('blur', () => validateField(field));
            }
        });

        // Form Submit Event Handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            fields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                alert('Thank you! Your message has been submitted successfully.');
                form.reset();
            }
        });
    }

    // =====================================================
    // 5. MOBILE NAVIGATION TOGGLE
    // =====================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
});

// =====================================================
// 6. FAQ ACCORDION TOGGLE (GLOBAL)
// =====================================================
function toggleFaq(button) {
    if (!button) return;
    const currentItem = button.closest('.faq-item');
    if (!currentItem) return;

    const currentAnswer = currentItem.querySelector('.faq-answer');
    const sideCard = document.getElementById('sideCard');
    const allItems = document.querySelectorAll('.faq-item');
    if (!currentAnswer) return;

    const isCurrentlyOpen = currentAnswer.style.maxHeight && currentAnswer.style.maxHeight !== '0px';

    // Reset & Close all FAQ items
    allItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        const title = item.querySelector('button span');
        const icon = item.querySelector('.icon-box');

        if (answer) answer.style.maxHeight = '0px';
        if (title) title.className = 'font-medium text-lg tracking-wide text-white transition-colors';
        if (icon) icon.classList.remove('rotate-180');
    });

    // If it was not open, open it now
    if (!isCurrentlyOpen) {
        currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px';
        const title = button.querySelector('span');
        const icon = button.querySelector('.icon-box');
        if (title) title.className = 'font-medium text-lg tracking-wide text-lime-400 transition-colors';
        if (icon) icon.classList.add('rotate-180');

        if (sideCard && window.innerWidth >= 1024) {
            const targetY = currentItem.offsetTop;
            sideCard.style.transform = `translateY(${targetY}px)`;
        }
    } else {
        if (sideCard && window.innerWidth >= 1024) {
            sideCard.style.transform = 'translateY(0px)';
        }
    }
}
