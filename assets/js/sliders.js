// sliders.js - Modern horizontal slider functionality

class HorizontalSlider {
    constructor(container, options = {}) {
        this.container = container;
        this.track = container.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
        this.prevBtn = container.querySelector('.slider-prev') || container.querySelector('[class*="prev"]');
        this.nextBtn = container.querySelector('.slider-next') || container.querySelector('[class*="next"]');
        this.indicatorsContainer = container.querySelector('.slider-indicators');
        
        this.options = {
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            responsive: [
                { breakpoint: 768, slidesToShow: 2 },
                { breakpoint: 480, slidesToShow: 1 }
            ],
            ...options
        };
        
        this.currentSlide = 0;
        this.slideWidth = 0;
        this.trackWidth = 0;
        this.maxSlides = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        this.calculateDimensions();
        this.createIndicators();
        this.bindEvents();
        this.updateSlider();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        window.addEventListener('resize', () => {
            this.calculateDimensions();
            this.updateSlider();
        });
    }
    
    calculateDimensions() {
        const containerWidth = this.container.offsetWidth;
        const slideCount = this.slides.length;
        
        // Get responsive slidesToShow
        let slidesToShow = this.options.slidesToShow;
        const responsive = this.options.responsive.find(r => 
            window.innerWidth <= r.breakpoint
        );
        if (responsive) {
            slidesToShow = responsive.slidesToShow;
        }
        
        this.slideWidth = containerWidth / slidesToShow;
        this.maxSlides = Math.max(0, slideCount - slidesToShow);
        
        // Set slide widths
        this.slides.forEach(slide => {
            slide.style.minWidth = `${this.slideWidth}px`;
            slide.style.maxWidth = `${this.slideWidth}px`;
        });
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        const indicatorCount = this.maxSlides + 1;
        
        for (let i = 0; i < indicatorCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'slider-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }
    
    next() {
        if (this.isAnimating || this.currentSlide >= this.maxSlides) return;
        this.goToSlide(this.currentSlide + this.options.slidesToScroll);
    }
    
    prev() {
        if (this.isAnimating || this.currentSlide <= 0) return;
        this.goToSlide(this.currentSlide - this.options.slidesToScroll);
    }
    
    goToSlide(slideIndex) {
        if (this.isAnimating) return;
        
        slideIndex = Math.max(0, Math.min(slideIndex, this.maxSlides));
        
        this.isAnimating = true;
        this.currentSlide = slideIndex;
        
        const translateX = -this.currentSlide * this.slideWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        this.updateControls();
        this.updateIndicators();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }
    
    updateControls() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide >= this.maxSlides;
        }
    }
    
    updateIndicators() {
        if (!this.indicatorsContainer) return;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.slider-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    updateSlider() {
        this.goToSlide(this.currentSlide);
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (this.currentSlide >= this.maxSlides) {
                this.goToSlide(0);
            } else {
                this.next();
            }
        }, this.options.autoplaySpeed);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoplay();
        window.removeEventListener('resize', this.calculateDimensions);
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Expressions data
    const expressionsData = [
        {
            name: "SaltCity Central",
            description: "Our main gathering—a multi-generational community where families, singles, and believers of all ages come together.",
            image: "assets/images/expressions/saltcity-central.jpg",
            location: "20 Okumagba Avenue, Warri",
            times: "Sun 9am, Wed & Fri 5pm",
            badge: "Headquarters",
            type: "primary",
            link: "pages/expressions.html#saltcity-central"
        },
        {
            name: "CityCenter",
            description: "Dynamic worship and relevant teaching for young adults and teens. Navigate faith, purpose, and identity.",
            image: "assets/images/expressions/citycentre.jpg",
            location: "Centre of Discipleship, Warri",
            times: "Sun 9am, Wed & Fri 5pm",
            badge: "Young Adults & Teens",
            link: "pages/expressions.html#citycentre"
        },
        {
            name: "Life City",
            description: "A vibrant expression focused on living the abundant life in Christ. Experience worship and community.",
            image: "assets/images/expressions/lifecity.jpg",
            location: "Centre of Discipleship, Warri",
            times: "Sundays 3pm",
            link: "pages/expressions.html#lifecity"
        },
        {
            name: "Cityzens PTI",
            description: "Campus ministry at PTI bringing the gospel to students. Build your faith and connect with peers.",
            image: "assets/images/expressions/cityzens-pti.jpg",
            location: "UNICUS Complex 1, PTI",
            times: "Wed & Fri 5pm",
            badge: "Campus Ministry",
            link: "pages/expressions.html#cityzens-pti"
        },
        {
            name: "Cityzens FUPRE",
            description: "Campus expression at FUPRE serving students and the university community. Authentic worship and discipleship.",
            image: "assets/images/expressions/cityzens-fupre.jpg",
            location: "La Vigor Hotel, Ugbomro",
            times: "Wed & Fri 5pm",
            badge: "Campus Ministry",
            link: "pages/expressions.html#cityzens-fupre"
        },
        {
            name: "SaltCity Sapele",
            description: "Our expression in Sapele bringing the same commitment to discipleship across Delta State.",
            image: "assets/images/expressions/saltcity-sapele.jpg",
            location: "Sapele, Delta State",
            times: "Contact for service times",
            link: "pages/expressions.html#saltcity-sapele"
        }
    ];

    // Programs data
    const programsData = [
        {
            title: "21-Day Annual Fast",
            description: "Begin the year seeking God's face through corporate fasting and prayer. Experience breakthrough and divine direction.",
            image: "assets/images/programs/21-day-fast.jpg",
            date: "January 10-30, 2026",
            time: "Daily Prayer Points",
            badge: "Spiritual Discipline",
            highlights: ["Daily Devotionals", "Prayer Meetings", "Breakthrough"],
            link: "pages/programs.html#21-day-fast"
        },
        {
            title: "The Faith Convention",
            description: "Six-day conference dedicated to building unshakeable faith with powerful teaching and testimonies.",
            image: "assets/images/programs/faith-convention.jpg",
            date: "December 9-16, 2026",
            location: "Centre of Discipleship",
            badge: "Annual Conference",
            highlights: ["Guest Ministers", "Impartation", "Teaching"],
            featured: true,
            link: "pages/programs.html#faith-convention"
        },
        {
            title: "Warri Singles Summit",
            description: "Power-packed event for single adults with practical teaching on purpose and relationships.",
            image: "assets/images/programs/singles-summit.jpg",
            date: "May 17, 2026",
            time: "10:00 AM - 4:00 PM",
            badge: "Special Event",
            highlights: ["Purpose & Identity", "Relationships", "Networking"],
            link: "pages/programs.html#singles-summit"
        },
        {
            title: "Warri Worship Conference",
            description: "Two days of uninterrupted worship, teaching, and equipping for worshippers and psalmists.",
            image: "assets/images/programs/worship-conference.jpg",
            date: "July 25-26, 2026",
            location: "Centre of Discipleship",
            badge: "Worship Event",
            highlights: ["Live Worship", "Training", "Guest Psalmists"],
            link: "pages/programs.html#worship-conference"
        },
        {
            title: "Priscilla & Aquila",
            description: "Quarterly paraministry teaching program for building strong, Christ-centered relationships.",
            image: "assets/images/programs/priscilla-aquila.jpg",
            date: "Quarterly (Next: April 20, 2026)",
            audience: "Parast Only",
            badge: "Para-Ministry",
            highlights: ["Relationship Building", "Unity", "Ministry"],
            link: "pages/programs.html#priscilla-aquila"
        },
        {
            title: "Archippus",
            description: "Intensive leadership training for current and emerging ministry leaders. Fulfill your ministry with excellence.",
            image: "assets/images/programs/archippus.jpg",
            date: "September 7-8, 2026",
            audience: "Ministry Leaders",
            badge: "Leadership",
            highlights: ["Leadership Training", "Skills", "Mentorship"],
            link: "pages/programs.html#archippus"
        }
    ];

    // Render expressions
    const expressionsTrack = document.getElementById('expressionsTrack');
    if (expressionsTrack) {
        expressionsData.forEach(expr => {
            const slide = createExpressionSlide(expr);
            expressionsTrack.appendChild(slide);
        });
    }

    // Render programs
    const programsTrack = document.getElementById('programsTrack');
    if (programsTrack) {
        programsData.forEach(program => {
            const slide = createProgramSlide(program);
            programsTrack.appendChild(slide);
        });
    }

    // Initialize sliders
    const expressionsSlider = new HorizontalSlider(
        document.querySelector('.expressions-section .slider-container'),
        { slidesToShow: 3, autoplay: true }
    );

    const programsSlider = new HorizontalSlider(
        document.querySelector('.programs-section .slider-container'),
        { slidesToShow: 3, autoplay: false }
    );
});

// Helper function to create expression slides
function createExpressionSlide(data) {
    const slide = document.createElement('div');
    slide.className = `expression-slide ${data.type || ''}`;
    
    slide.innerHTML = `
        <div class="slide-image">
            <img src="${data.image}" alt="${data.name}" loading="lazy">
            <div class="slide-overlay"></div>
            ${data.badge ? `<div class="slide-badge">${data.badge}</div>` : ''}
        </div>
        <div class="slide-content">
            <h3 class="slide-title">${data.name}</h3>
            <p class="slide-description">${data.description}</p>
            <div class="slide-meta">
                <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    <span>${data.location}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">🕐</span>
                    <span>${data.times}</span>
                </div>
            </div>
            <a href="${data.link}" class="slide-link">
                Learn More <span>→</span>
            </a>
        </div>
    `;
    
    return slide;
}

// Helper function to create program slides
function createProgramSlide(data) {
    const slide = document.createElement('div');
    slide.className = `program-slide ${data.featured ? 'featured' : ''}`;
    
    const highlightsHTML = data.highlights.map(highlight => 
        `<span class="highlight-tag">${highlight}</span>`
    ).join('');
    
    slide.innerHTML = `
        <div class="program-slide-image">
            <img src="${data.image}" alt="${data.title}" loading="lazy">
            <div class="program-slide-overlay"></div>
            <div class="program-slide-badge ${data.badge.toLowerCase().replace(' ', '-')}">
                ${data.badge}
            </div>
        </div>
        <div class="program-slide-content">
            <h3 class="program-slide-title">${data.title}</h3>
            <div class="program-slide-meta">
                <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>${data.date}</span>
                </div>
                ${data.time ? `
                <div class="meta-item">
                    <span class="meta-icon">🕐</span>
                    <span>${data.time}</span>
                </div>
                ` : ''}
                ${data.location ? `
                <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    <span>${data.location}</span>
                </div>
                ` : ''}
                ${data.audience ? `
                <div class="meta-item">
                    <span class="meta-icon">👥</span>
                    <span>${data.audience}</span>
                </div>
                ` : ''}
            </div>
            <p class="program-slide-description">${data.description}</p>
            <div class="program-slide-highlights">
                ${highlightsHTML}
            </div>
            <a href="${data.link}" class="btn btn-primary btn-small">
                ${data.featured ? 'Register Now' : 'Learn More'}
            </a>
        </div>
    `;
    
    return slide;
}