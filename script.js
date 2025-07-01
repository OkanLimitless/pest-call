// Aptive-Style Landing Page - Callback Form Functionality
// Version 2.0 - Professional Pest Control

// Configuration
const CONFIG = {
    PHONE_NUMBER: '+18442130185',
    DISPLAY_PHONE: '(844) 213-0185',
    DEBUG_MODE: window.location.search.includes('debug=true'),
    ANALYTICS_ENABLED: true
};

// Analytics tracking
function trackEvent(eventName, properties = {}) {
    if (!CONFIG.ANALYTICS_ENABLED) return;
    
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                phone_number: CONFIG.PHONE_NUMBER,
                ...properties
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                event_name: eventName,
                ...properties
            });
        }
        
        console.log(`📊 Analytics Event: ${eventName}`, properties);
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

// Show callback form
function showCallbackForm() {
    const form = document.getElementById('callbackForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus first input
        const firstInput = form.querySelector('input[name="firstName"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
        
        trackEvent('callback_form_opened', {
            source: 'cta_button'
        });
    }
}

// Hide callback form
function hideCallbackForm() {
    const form = document.getElementById('callbackForm');
    if (form) {
        form.style.display = 'none';
    }
}

// Handle form submission and trigger call
function submitQuickCall(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Extract form data
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        zipCode: formData.get('zipCode'),
        consent: formData.get('consent')
    };
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.zipCode || !data.consent) {
        alert('Please fill in all required fields and agree to the terms.');
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[\+]?[1]?[\s\-\(\)]?[0-9]{3}[\s\-\(\)]?[0-9]{3}[\s\-]?[0-9]{4}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Please enter a valid phone number.');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Processing...';
    submitBtn.disabled = true;
    
    // Track submission
    trackEvent('quick_call_form_submitted', {
        phone: data.phone,
        zipCode: data.zipCode,
        source: 'quick_call_form'
    });
    
    // Log the lead data (you can send this to your CRM/email)
    console.log('📞 Lead submitted:', data);
    
    // After brief delay, trigger call and show success
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showCallTriggeredModal(data.firstName);
        
        // Hide form
        hideCallbackForm();
        
        // TRIGGER THE ACTUAL CALL
        setTimeout(() => {
            window.location.href = CONFIG.PHONE_NUMBER;
            
            // Mobile vibration
            if (navigator.vibrate) {
                navigator.vibrate([300, 100, 300]);
            }
        }, 1500); // 1.5 second delay for user to see success message
        
        // Track conversion
        trackEvent('quick_call_triggered', {
            phone: data.phone,
            conversion_type: 'form_to_call',
            value: 99 // $99 offer value
        });
        
    }, 1000);
}

// Show call triggered modal
function showCallTriggeredModal(firstName) {
    const modal = document.getElementById('successModal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (modal && modalContent) {
        modalContent.innerHTML = `
            <h3>🎉 Thanks ${firstName}!</h3>
            <p><strong>Connecting you now to get your $99 quote...</strong></p>
            <p>Your phone should ring momentarily with our pest control expert.</p>
            <button onclick="closeModal()" class="modal-btn">Got It!</button>
        `;
        modal.style.display = 'flex';
        
        trackEvent('call_triggered_modal_shown', {
            firstName: firstName
        });
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Contact now function (for plan CTA)
function contactNow() {
    // Try direct call first
    window.location.href = CONFIG.PHONE_NUMBER;
    
    // Track call attempt
    trackEvent('plan_cta_clicked', {
        source: 'service_plan',
        phone_number: CONFIG.PHONE_NUMBER
    });
    
    // Fallback - vibrate on mobile
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
}

// Device detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
}

// Initialize page
function initializePage() {
    console.log('🛡️ Professional Pest Control - Callback System Loaded');
    
    // Track page load
    trackEvent('page_loaded', {
        device_type: isMobileDevice() ? 'mobile' : 'desktop',
        phone_number: CONFIG.PHONE_NUMBER,
        user_agent: navigator.userAgent,
        page_type: 'callback_landing'
    });
    
    // Add click tracking to call buttons
    const callButtons = document.querySelectorAll('a[href*="tel:"]');
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('call_button_clicked', {
                button_location: this.closest('section')?.className || 'unknown',
                phone_number: CONFIG.PHONE_NUMBER
            });
            
            // Mobile vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([150]);
            }
        });
    });
    
    // Modal click outside to close
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Form validation on input
    const form = document.getElementById('callbackFormData');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
        });
    }
    
    // Debug mode
    if (CONFIG.DEBUG_MODE) {
        showDebugPanel();
    }
}

// Input validation
function validateInput(event) {
    const input = event.target;
    const name = input.name;
    const value = input.value.trim();
    
    // Remove previous error styling
    input.style.borderColor = '';
    
    if (name === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.style.borderColor = '#e53e3e';
        }
    }
    
    if (name === 'phone' && value) {
        const phoneRegex = /^[\+]?[1]?[\s\-\(\)]?[0-9]{3}[\s\-\(\)]?[0-9]{3}[\s\-]?[0-9]{4}$/;
        if (!phoneRegex.test(value)) {
            input.style.borderColor = '#e53e3e';
        }
    }
    
    if (name === 'zipCode' && value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            input.style.borderColor = '#e53e3e';
        }
    }
}

// Debug panel for testing
function showDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 8px; font-size: 12px; z-index: 9999; max-width: 250px;">
            <strong>🔧 DEBUG MODE</strong><br>
            Phone: ${CONFIG.DISPLAY_PHONE}<br>
            Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'}<br>
            Page Type: Callback Landing<br>
            <button onclick="showCallbackForm()" style="margin-top: 8px; padding: 4px 8px; background: #38a169; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Form</button>
            <button onclick="trackEvent('debug_test', {source: 'debug_panel'})" style="margin-top: 4px; padding: 4px 8px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Analytics</button>
        </div>
    `;
    document.body.appendChild(debugPanel);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        trackEvent('page_hidden', {
            time_on_page: Date.now() - pageLoadTime
        });
    }
});

// Track time on page
const pageLoadTime = Date.now();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Export functions for global access
window.showCallbackForm = showCallbackForm;
window.hideCallbackForm = hideCallbackForm;
window.submitQuickCall = submitQuickCall;
window.closeModal = closeModal;
window.contactNow = contactNow; 