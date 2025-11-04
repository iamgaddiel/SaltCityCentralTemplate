// Programs & Events Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Countdown Timer for Featured Event
    function initCountdown() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        
        // Set the target date (Faith Convention - December 9, 2025)
        const targetDate = new Date('December 9, 2025 09:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = targetDate - now;
            
            if (timeLeft < 0) {
                // Event has passed
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
        }
        
        // Update immediately and then every minute
        updateCountdown();
        setInterval(updateCountdown, 60000);
    }
    
    // Filter functionality
    function initFilters() {
        const filterOptions = document.querySelectorAll('.filter-option');
        const eventCards = document.querySelectorAll('.event-card');
        const viewBtns = document.querySelectorAll('.view-btn');
        const eventsGrid = document.getElementById('eventsGrid');
        
        let activeFilters = {
            category: 'all-categories',
            date: 'all-dates',
            location: 'all-locations'
        };
        
        let currentView = 'grid';
        
        // Filter option click handler
        filterOptions.forEach(option => {
            option.addEventListener('click', function() {
                const filterType = this.closest('.filter-group').querySelector('.filter-label').textContent.toLowerCase();
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filters
                activeFilters[filterType] = filterValue;
                
                // Update active states
                this.closest('.filter-options').querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                // Apply filters
                applyFilters();
            });
        });
        
        // View toggle functionality
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const viewType = this.getAttribute('data-view');
                
                // Update current view
                currentView = viewType;
                
                // Update active states
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Apply view
                applyView();
            });
        });
        
        // Apply all active filters
        function applyFilters() {
            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const date = card.getAttribute('data-date');
                const location = card.getAttribute('data-location');
                
                const categoryMatch = activeFilters.category === 'all-categories' || category === activeFilters.category;
                const locationMatch = activeFilters.location === 'all-locations' || location === activeFilters.location;
                
                // Date filtering logic
                let dateMatch = true;
                if (activeFilters.date !== 'all-dates') {
                    const eventDate = new Date(date);
                    const now = new Date();
                    
                    switch(activeFilters.date) {
                        case 'this-week':
                            const startOfWeek = new Date(now);
                            startOfWeek.setDate(now.getDate() - now.getDay());
                            startOfWeek.setHours(0, 0, 0, 0);
                            
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            endOfWeek.setHours(23, 59, 59, 999);
                            
                            dateMatch = eventDate >= startOfWeek && eventDate <= endOfWeek;
                            break;
                            
                        case 'this-month':
                            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                            
                            dateMatch = eventDate >= startOfMonth && eventDate <= endOfMonth;
                            break;
                            
                        case 'next-month':
                            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                            const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
                            
                            dateMatch = eventDate >= nextMonth && eventDate <= endOfNextMonth;
                            break;
                    }
                }
                
                if (categoryMatch && locationMatch && dateMatch) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }
        
        // Apply current view
        function applyView() {
            if (currentView === 'list') {
                eventsGrid.classList.add('list-view');
            } else {
                eventsGrid.classList.remove('list-view');
            }
        }
    }
    
    // Calendar functionality
    function initCalendar() {
        const calendarTitle = document.getElementById('calendarTitle');
        const calendarDays = document.getElementById('calendarDays');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        const eventsList = document.getElementById('eventsList');
        const selectedDateTitle = document.getElementById('selectedDateTitle');
        
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        // Sample events data (in a real app, this would come from an API)
        const eventsData = [
            { id: 1, title: 'The Faith Convention', date: '2025-12-09', location: 'Central', type: 'conference' },
            { id: 2, title: 'Warri Worship Conference', date: '2025-07-25', location: 'Central', type: 'worship' },
            { id: 3, title: 'CityCenter Youth Conference', date: '2025-08-10', location: 'CityCenter', type: 'youth' },
            { id: 4, title: 'Warri Singles Summit', date: '2025-05-17', location: 'Central', type: 'community' },
            { id: 5, title: 'Archippus Leadership Training', date: '2025-09-07', location: 'Central', type: 'training' },
            { id: 6, title: 'End of Year Thanksgiving', date: '2025-12-31', location: 'Central', type: 'community' }
        ];
        
        // Render calendar
        function renderCalendar() {
            // Update calendar title
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Clear previous days
            calendarDays.innerHTML = '';
            
            // Get first day of month and number of days
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < startingDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                calendarDays.appendChild(emptyDay);
            }
            
            // Add days of the month
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
                // Check if this day has events
                const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const hasEvents = eventsData.some(event => event.date === dateStr);
                
                if (hasEvents) {
                    dayElement.classList.add('has-events');
                }
                
                // Check if today
                if (currentYear === today.getFullYear() && 
                    currentMonth === today.getMonth() && 
                    day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                // Add click event
                dayElement.addEventListener('click', function() {
                    // Remove selected class from all days
                    document.querySelectorAll('.calendar-day').forEach(day => {
                        day.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked day
                    this.classList.add('selected');
                    
                    // Show events for selected date
                    showEventsForDate(dateStr);
                });
                
                calendarDays.appendChild(dayElement);
            }
        }
        
        // Show events for selected date
        function showEventsForDate(dateStr) {
            const date = new Date(dateStr);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            selectedDateTitle.textContent = `Events for ${date.toLocaleDateString('en-US', options)}`;
            
            // Filter events for the selected date
            const dayEvents = eventsData.filter(event => event.date === dateStr);
            
            // Clear events list
            eventsList.innerHTML = '';
            
            if (dayEvents.length === 0) {
                eventsList.innerHTML = '<p class="no-events">No events scheduled for this date.</p>';
                return;
            }
            
            // Add events to list
            dayEvents.forEach(event => {
                const eventDate = new Date(event.date);
                const eventElement = document.createElement('div');
                eventElement.className = 'event-list-item';
                
                eventElement.innerHTML = `
                    <div class="event-list-date">
                        <span class="event-list-day">${eventDate.getDate()}</span>
                        <span class="event-list-month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                    <div class="event-list-content">
                        <h4 class="event-list-title">${event.title}</h4>
                        <div class="event-list-meta">
                            <span>📍 ${event.location}</span>
                            <span>🎯 ${event.type}</span>
                        </div>
                    </div>
                    <div class="event-list-actions">
                        <button class="action-btn" title="Register">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                                <path d="M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm0 14.5A6.5 6.5 0 1 1 9 2.5a6.5 6.5 0 0 1 0 13zM8 5h2v6H8V5zm0 7h2v2H8v-2z"/>
                            </svg>
                        </button>
                    </div>
                `;
                
                eventsList.appendChild(eventElement);
            });
        }
        
        // Month navigation
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        // Initial render
        renderCalendar();
        
        // Show today's events by default
        const todayStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        showEventsForDate(todayStr);
    }
    
    // Event card interactions
    function initEventCards() {
        const eventCards = document.querySelectorAll('.event-card');
        const actionBtns = document.querySelectorAll('.action-btn');
        
        eventCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on action buttons
                if (e.target.closest('.action-btn')) {
                    return;
                }
                
                // In a real implementation, this would open the event detail page
                const eventTitle = this.querySelector('.event-title').textContent;
                alert(`Opening event: ${eventTitle}`);
            });
        });
        
        // Action buttons
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('title');
                
                switch(action) {
                    case 'Register':
                        alert('Opening registration form...');
                        break;
                    case 'Share':
                        alert('Sharing event...');
                        break;
                }
            });
        });
    }
    
    // Load more functionality
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more content
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // In a real implementation, this would fetch more data from an API
                // For now, we'll just show a message
                this.textContent = 'No More Events';
                this.style.opacity = '0.5';
                
                // You could remove the button entirely after all content is loaded
                // this.style.display = 'none';
            }, 1500);
        });
    }
    
    // Scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.event-card, .calendar-container, .event-list-item'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Initialize all functions
    function init() {
        initCountdown();
        initFilters();
        initCalendar();
        initEventCards();
        initLoadMore();
        initScrollAnimations();
    }
    
    // Run initialization
    init();
    
    // Enhanced loading for images
// skip the logo — only animate event images
    const images = document.querySelectorAll('img:not(.logo)');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
    
    // Add to calendar functionality
    const addToCalendarBtn = document.querySelector('.btn-secondary');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', function() {
            // In a real implementation, this would generate calendar files
            alert('Adding event to your calendar...');
        });
    }
});