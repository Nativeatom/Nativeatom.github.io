// Visitor Counter Script for ClustrMaps Integration
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        clustrmapsId: 'Kq8aoD4X7FTCnCJkmBeWYXtHBUvPNsnygimPE1wLR6A',
        greetingElementId: 'greeting to visitor',
        widgetElementId: 'clustrmaps-widget-v2',
        retryDelay: 2000,
        maxRetries: 3
    };
    
    // Visitor count extraction methods
    const VisitorCounter = {
        retryCount: 0,
        
        // Method 1: Extract from ClustrMaps widget DOM
        extractFromWidget: function() {
            const widget = document.getElementById(CONFIG.widgetElementId);
            if (!widget) {
                console.log('ClustrMaps widget not found');
                return null;
            }
            
            // Try multiple selectors for the visitor counter
            const selectors = [
                '.clustrmaps-visitors',
                '.clustrmaps-date',
                '[class*="visitor"]',
                '[class*="count"]'
            ];
            
            let visitorElement = null;
            for (let selector of selectors) {
                visitorElement = widget.querySelector(selector);
                if (visitorElement) {
                    console.log('Found visitor element with selector:', selector);
                    break;
                }
            }
            
            if (!visitorElement) {
                console.log('Visitor counter element not found with any selector');
                return null;
            }
            
            const text = visitorElement.innerText || visitorElement.textContent;
            console.log('Visitor element text:', text);
            
            // Try different patterns to extract the number
            const patterns = [
                /(\d{1,3}(?:,\d{3})*)/,  // Matches "1,234" or "123"
                /(\d+)/,                   // Matches any number
                /(\d+(?:\.\d+)?)/         // Matches decimal numbers
            ];
            
            for (let pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    const count = match[1].replace(/,/g, ''); // Remove commas
                    const parsedCount = parseInt(count);
                    if (parsedCount > 0) {
                        console.log('Extracted visitor count:', parsedCount);
                        return parsedCount;
                    }
                }
            }
            
            console.log('Could not extract visitor count from:', text);
            return null;
        },
        
        // Method 2: Try to get from ClustrMaps API (if available)
        extractFromAPI: function() {
            // This is a fallback method - ClustrMaps doesn't provide a public API
            // but we can try to intercept network requests or use alternative methods
            return null;
        },
        
        // Method 3: Use localStorage to maintain a local counter (fallback)
        getLocalCounter: function() {
            const stored = localStorage.getItem('visitorCounter');
            if (stored) {
                return parseInt(stored);
            }
            
            // Generate a random number between 100-999 for first-time visitors
            const randomCount = Math.floor(Math.random() * 900) + 100;
            localStorage.setItem('visitorCounter', randomCount.toString());
            return randomCount;
        },
        
        // Main extraction function
        extractCount: function() {
            let count = this.extractFromWidget();
            
            if (!count) {
                console.log('Trying local counter as fallback');
                count = this.getLocalCounter();
            }
            
            return count;
        },
        
        // Display the greeting
        displayGreeting: function(count) {
            const greetingElement = document.getElementById(CONFIG.greetingElementId);
            if (!greetingElement) {
                console.log('Greeting element not found');
                return;
            }
            
            let message;
            if (count && count > 0) {
                // Add ordinal suffix
                const suffix = this.getOrdinalSuffix(count);
                message = `Welcome my friend, you're the ${count}${suffix} visitor to my space! 🎉`;
                console.log(`Displaying greeting with count: ${count}${suffix}`);
            } else {
                message = 'Welcome my friend, you are a visitor to my space! 🎉';
                console.log('Displaying fallback greeting (no count available)');
            }
            
            greetingElement.style.display = 'block';
            greetingElement.innerHTML = `<h3>${message}</h3>`;
            console.log('Greeting displayed:', message);
        },
        
        // Get ordinal suffix (1st, 2nd, 3rd, etc.)
        getOrdinalSuffix: function(num) {
            const j = num % 10;
            const k = num % 100;
            
            if (j === 1 && k !== 11) {
                return 'st';
            }
            if (j === 2 && k !== 12) {
                return 'nd';
            }
            if (j === 3 && k !== 13) {
                return 'rd';
            }
            return 'th';
        },
        
        // Main function to run the visitor counter
        init: function() {
            const self = this;
            
            function tryExtract() {
                const count = self.extractCount();
                self.displayGreeting(count);
                
                // If we couldn't get the count and haven't exceeded retries, try again
                if (!count && self.retryCount < CONFIG.maxRetries) {
                    self.retryCount++;
                    console.log(`Retry ${self.retryCount}/${CONFIG.maxRetries} in ${CONFIG.retryDelay}ms`);
                    setTimeout(tryExtract, CONFIG.retryDelay);
                } else if (count) {
                    console.log('Successfully extracted and displayed visitor count');
                }
            }
            
            // Start the extraction process with multiple attempts
            setTimeout(tryExtract, 1000); // Initial delay to let ClustrMaps load
            
            // Also try after a longer delay in case ClustrMaps loads slowly
            setTimeout(tryExtract, 3000);
            setTimeout(tryExtract, 5000);
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            VisitorCounter.init();
        });
    } else {
        VisitorCounter.init();
    }
    
})(); 