// Configuration
const CONFIG = {
    phoneNumber: 'tel:+18442130185',
    initialDelay: 1000, // 1 second delay before showing progress
    progressDuration: 3000, // 3 seconds for progress animation
    autoCallDelay: 2000, // 2 seconds after progress starts to trigger call
    manualCallDelay: 6000, // 6 seconds total before showing manual call option
    enableAutoCall: true // Set to false to disable auto-call for testing
};

// DOM Elements
let callProgressEl;
let manualCallEl;
let progressTextEl;

// State
let hasTriggeredCall = false;
let progressTimer;
let callTimer;
let manualTimer;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    startCallSequence();
});

function initializeElements() {
    callProgressEl = document.getElementById('callProgress');
    manualCallEl = document.getElementById('manualCall');
    progressTextEl = document.querySelector('.progress-text');
    
    // Ensure manual call section is hidden initially
    if (manualCallEl) {
        manualCallEl.style.display = 'none';
    }
}

function setupEventListeners() {
    // Track call button clicks
    const callButton = document.querySelector('.call-button');
    if (callButton) {
        callButton.addEventListener('click', function(e) {
            trackCallAttempt('manual_button_click');
        });
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, user might be on a call
            trackCallAttempt('page_hidden_during_sequence');
        }
    });
    
    // Handle beforeunload for call tracking
    window.addEventListener('beforeunload', function() {
        if (!hasTriggeredCall) {
            trackCallAttempt('page_exit_before_call');
        }
    });
}

function startCallSequence() {
    // Show initial progress after delay
    setTimeout(() => {
        showProgressSection();
        startProgressAnimation();
        
        // Trigger automatic call
        if (CONFIG.enableAutoCall) {
            setTimeout(() => {
                triggerAutoCall();
            }, CONFIG.autoCallDelay);
        }
        
        // Show manual call option after full sequence
        setTimeout(() => {
            showManualCallSection();
        }, CONFIG.manualCallDelay);
        
    }, CONFIG.initialDelay);
}

function showProgressSection() {
    if (callProgressEl) {
        callProgressEl.style.display = 'block';
        callProgressEl.style.opacity = '0';
        
        // Fade in animation
        setTimeout(() => {
            callProgressEl.style.transition = 'opacity 0.5s ease-in-out';
            callProgressEl.style.opacity = '1';
        }, 100);
    }
}

function startProgressAnimation() {
    const messages = [
        'Connecting to specialist...',
        'Finding technician in your area...',
        'Preparing your priority call...',
        'Call ready - please answer!'
    ];
    
    let messageIndex = 0;
    
    const updateProgress = () => {
        if (progressTextEl && messageIndex < messages.length) {
            progressTextEl.textContent = messages[messageIndex];
            messageIndex++;
        }
    };
    
    // Update message every 750ms
    updateProgress();
    const messageTimer = setInterval(() => {
        if (messageIndex < messages.length) {
            updateProgress();
        } else {
            clearInterval(messageTimer);
        }
    }, 750);
}

function triggerAutoCall() {
    if (hasTriggeredCall) return;
    
    hasTriggeredCall = true;
    
    try {
        // Create and trigger the call link
        const link = document.createElement('a');
        link.href = CONFIG.phoneNumber;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Trigger the call
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
        }, 1000);
        
        trackCallAttempt('auto_call_triggered');
        
        // Update progress text
        if (progressTextEl) {
            progressTextEl.innerHTML = '<strong>📞 Call initiated! Please answer your phone.</strong>';
        }
        
    } catch (error) {
        console.log('Auto-call failed, showing manual option');
        showManualCallSection();
        trackCallAttempt('auto_call_failed');
    }
}

function showManualCallSection() {
    // Hide progress section
    if (callProgressEl) {
        callProgressEl.style.transition = 'opacity 0.5s ease-out';
        callProgressEl.style.opacity = '0';
        
        setTimeout(() => {
            callProgressEl.style.display = 'none';
        }, 500);
    }
    
    // Show manual call section
    if (manualCallEl) {
        setTimeout(() => {
            manualCallEl.style.display = 'block';
            manualCallEl.style.opacity = '0';
            
            setTimeout(() => {
                manualCallEl.style.transition = 'opacity 0.5s ease-in-out';
                manualCallEl.style.opacity = '1';
            }, 100);
        }, 600);
    }
}

function trackCallAttempt(event) {
    // Analytics tracking (can be connected to Google Analytics, etc.)
    console.log('Call tracking event:', event, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        phoneNumber: CONFIG.phoneNumber
    });
    
    // Send to analytics service if needed
    if (window.gtag) {
        gtag('event', event, {
            event_category: 'call_interaction',
            event_label: 'pest_control_mobile',
            value: 1
        });
    }
}

// Utility Functions
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function supportsPhoneLinks() {
    return isMobileDevice() || /Mobi|Android/i.test(navigator.userAgent);
}

// Enhanced UX Features for Mobile
function enhanceCallButton() {
    const callButton = document.querySelector('.call-button');
    if (callButton) {
        // Add enhanced mobile interactions
        callButton.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        callButton.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Vibration feedback on mobile
        if ('vibrate' in navigator && isMobileDevice()) {
            callButton.addEventListener('click', function() {
                navigator.vibrate(100); // Short vibration
            });
        }
    }
}

// Emergency fallback for call functionality
function emergencyCallFallback() {
    const callButton = document.querySelector('.call-button');
    if (callButton) {
        callButton.addEventListener('click', function(e) {
            // Ensure call works even if tel: link fails
            if (!supportsPhoneLinks()) {
                e.preventDefault();
                
                // Show phone number for manual dialing
                const phoneDisplay = document.createElement('div');
                phoneDisplay.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                                z-index: 1000; text-align: center; border: 2px solid #2563eb; max-width: 90vw;">
                        <h3 style="margin-bottom: 1rem; color: #1f2937;">📞 Please dial this number:</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: #2563eb; margin-bottom: 1rem;">
                            (844) 213-0185
                        </p>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="background: #2563eb; color: white; border: none; padding: 1rem 2rem; 
                                       border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">Close</button>
                    </div>
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                background: rgba(0,0,0,0.5); z-index: 999;" 
                         onclick="this.parentElement.remove()"></div>
                `;
                document.body.appendChild(phoneDisplay);
            }
        });
    }
}

// Mobile-specific optimizations
function mobileOptimizations() {
    // Prevent zoom on input focus (not applicable here but good practice)
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && isMobileDevice()) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add touch-friendly interactions
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // Optimize for mobile performance
    if (isMobileDevice()) {
        // Reduce animation frequency for better performance
        document.documentElement.style.setProperty('--animation-duration', '2s');
    }
}

// Initialize enhanced features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        enhanceCallButton();
        emergencyCallFallback();
        mobileOptimizations();
    }, 1000);
});

// Debug mode for testing
if (window.location.search.includes('debug=true')) {
    CONFIG.enableAutoCall = false;
    CONFIG.initialDelay = 500;
    CONFIG.manualCallDelay = 2000;
    
    console.log('🐛 Debug mode enabled - auto-call disabled');
    
    // Add debug controls
    setTimeout(() => {
        const debugPanel = document.createElement('div');
        debugPanel.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: #000; color: #fff; 
                        padding: 1rem; border-radius: 0.5rem; z-index: 1000; font-family: monospace;
                        font-size: 0.8rem; max-width: 200px;">
                <h4 style="margin: 0 0 0.5rem 0;">🐛 Debug Controls</h4>
                <button onclick="triggerAutoCall()" style="margin: 0.25rem; padding: 0.5rem; font-size: 0.7rem;">Trigger Call</button><br>
                <button onclick="showManualCallSection()" style="margin: 0.25rem; padding: 0.5rem; font-size: 0.7rem;">Show Manual</button><br>
                <button onclick="startCallSequence()" style="margin: 0.25rem; padding: 0.5rem; font-size: 0.7rem;">Restart</button>
            </div>
        `;
        document.body.appendChild(debugPanel);
    }, 1000);
} 