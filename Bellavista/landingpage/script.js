
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CHECK IN BUTTON ACTION
    // ==========================================

    const checkInBtn = document.getElementById('checkInBtn');

    if (checkInBtn) {

        checkInBtn.addEventListener('click', () => {

            console.log('Check in clicked!');

        });

    }


    // ==========================================
    // 2. POLICIES LINK ROUTING
    // ==========================================

    const policiesLink = document.querySelector(
        'a[href="#policies"]'
    );

    if (policiesLink) {

        policiesLink.addEventListener('click', (e) => {

            e.preventDefault();

            window.location.href = '../policies/index.html';

        });

    }


    // ==========================================
    // 3. INQUIRY FORM SUBMISSION
    // ==========================================

    const inquiryForm = document.getElementById('inquiryForm');

    if (inquiryForm) {

        inquiryForm.addEventListener('submit', (e) => {

            e.preventDefault();

            const formData = new FormData(inquiryForm);

            const inquiryType = formData.get('inquiry_type');
            const others = formData.get('others');
            const email = formData.get('email');

            console.log('Inquiry Submitted:', {
                inquiryType,
                others,
                email
            });

            alert(
                'Thank you for your inquiry! We will get back to you soon.'
            );

            inquiryForm.reset();

        });

    }


    // ==========================================
    // 4. HIGHLIGHTS INFINITE LOOP CAROUSEL
    // ==========================================

    const track = document.getElementById('highlightsTrack');
    const prevBtn = document.getElementById('prevHighlight');
    const nextBtn = document.getElementById('nextHighlight');

    // Stop if the carousel elements do not exist
    if (!track || !prevBtn || !nextBtn) return;


    // Get all original image cards

    const originalCards = Array.from(track.children);

    const totalCards = originalCards.length;

    if (totalCards < 2) return;


    // ==========================================
    // DUPLICATE CARDS FOR INFINITE LOOP
    // ==========================================

    function cloneCards() {

        const fragment = document.createDocumentFragment();

        originalCards.forEach((card) => {

            const clone = card.cloneNode(true);

            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('inert', '');

            fragment.appendChild(clone);

        });

        return fragment;

    }


    // Add duplicate cards before and after originals

    track.prepend(cloneCards());

    track.append(cloneCards());


    // ==========================================
    // CAROUSEL VARIABLES
    // ==========================================

    let cardDistance = 0;

    let loopWidth = 0;

    let scrollTimer;

    let resizeTimer;

    let isMoving = false;

    let currentIndex = 0;


    // Check user's reduced motion preference

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );


    // ==========================================
    // MEASURE CARD DISTANCE
    // ==========================================

    function measureCards() {

        const firstCard =
            track.children[0].getBoundingClientRect();

        const secondCard =
            track.children[1].getBoundingClientRect();

        cardDistance = secondCard.left - firstCard.left;

        // Measure width of one complete set of images

        const firstOriginalCard =
            track.children[totalCards].getBoundingClientRect();

        loopWidth =
            firstOriginalCard.left - firstCard.left;

    }


    // ==========================================
    // INSTANT JUMP WITHOUT ANIMATION
    // ==========================================

    function jumpTo(position) {

        track.scrollTo({
            left: position,
            behavior: 'instant'
        });

    }


    // ==========================================
    // INITIALIZE CAROUSEL
    // ==========================================

    function initializeCarousel() {

        measureCards();

        if (cardDistance > 0) {

            jumpTo(
                loopWidth + currentIndex * cardDistance
            );

        }

    }


    // ==========================================
    // RESET TO THE ORIGINAL IMAGE SET
    // ==========================================

    function resetLoop() {

        if (cardDistance <= 0 || loopWidth <= 0) {

            isMoving = false;

            return;

        }

        const position = track.scrollLeft;


        // Calculate current original card index

        currentIndex = (
            (
                Math.round(
                    (position - loopWidth) / cardDistance
                ) % totalCards
            ) + totalCards
        ) % totalCards;


        // If scrolling reaches the duplicate cards
        // at the beginning, jump to the matching
        // position in the original set

        if (position < loopWidth - 1) {

            jumpTo(position + loopWidth);

        }


        // If scrolling reaches the duplicate cards
        // at the end, jump back to the original set

        else if (position >= loopWidth * 2 - 1) {

            jumpTo(position - loopWidth);

        }


        isMoving = false;

    }


    // ==========================================
    // MOVE CAROUSEL
    // ==========================================

    function moveCarousel(direction) {

        // Prevent repeated clicks during animation

        if (isMoving || cardDistance <= 0) return;

        isMoving = true;


        // Move one image forward or backward

        track.scrollBy({

            left: cardDistance * direction,

            behavior: reducedMotion.matches
                ? 'instant'
                : 'smooth'

        });


        // Fallback timer in case scrolling stops early

        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(resetLoop, 450);

    }


    // ==========================================
    // PREVIOUS BUTTON
    // ==========================================

    prevBtn.addEventListener('click', () => {

        moveCarousel(-1);

    });


    // ==========================================
    // NEXT BUTTON
    // ==========================================

    nextBtn.addEventListener('click', () => {

        moveCarousel(1);

    });


    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================

    track.addEventListener('keydown', (event) => {

        if (event.key === 'ArrowRight') {

            event.preventDefault();

            moveCarousel(1);

        }

        else if (event.key === 'ArrowLeft') {

            event.preventDefault();

            moveCarousel(-1);

        }

    });


    // ==========================================
    // MANUAL SCROLL AND MOBILE SWIPE
    // ==========================================

    track.addEventListener('scroll', () => {

        // Wait for the scrolling to finish
        // before resetting the loop position

        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(resetLoop, 150);

    }, { passive: true });


    // ==========================================
    // RESPONSIVE CAROUSEL RESIZING
    // ==========================================

    function handleResize() {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            clearTimeout(scrollTimer);

            isMoving = false;

            initializeCarousel();

        }, 120);

    }


    // Observe changes in carousel width

    if ('ResizeObserver' in window) {

        const observer = new ResizeObserver(handleResize);

        observer.observe(track);

    }

    else {

        window.addEventListener('resize', handleResize);

    }


    // ==========================================
    // START CAROUSEL
    // ==========================================

    initializeCarousel();

});
