// Lazy loading for images and iframes
document.addEventListener('DOMContentLoaded', () => {
    const lazyMedia = [];
    
    // Initialize lazy loading
    function initLazyLoading() {
        // Find all elements with data-src or data-srcset
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        const lazyIframes = document.querySelectorAll('iframe[data-src]');
        const lazyBackgrounds = document.querySelectorAll('[data-bg]');
        
        // Add to lazy load queue
        lazyImages.forEach(img => lazyMedia.push(img));
        lazyIframes.forEach(iframe => lazyMedia.push(iframe));
        
        // Set up intersection observer
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Handle images
                    if (element.tagName === 'IMG') {
                        if (element.dataset.src) {
                            element.src = element.dataset.src;
                            element.removeAttribute('data-src');
                        }
                        if (element.dataset.srcset) {
                            element.srcset = element.dataset.srcset;
                            element.removeAttribute('data-srcset');
                        }
                        
                        // Handle lazy loaded class
                        element.classList.add('lazy-loaded');
                    } 
                    // Handle iframes
                    else if (element.tagName === 'IFRAME') {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                        element.classList.add('lazy-loaded');
                    }
                    
                    // Handle background images
                    if (element.dataset.bg) {
                        element.style.backgroundImage = `url(${element.dataset.bg})`;
                        element.removeAttribute('data-bg');
                        element.classList.add('lazy-loaded');
                    }
                    
                    // Stop observing
                    lazyLoadObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0.01
        });
        
        // Observe all lazy elements
        lazyMedia.forEach(element => {
            lazyLoadObserver.observe(element);
        });
    }
    
    // Initialize when DOM is ready
    if ('IntersectionObserver' in window) {
        initLazyLoading();
    } else {
        // Fallback for browsers without IntersectionObserver
        const loadAllMedia = () => {
            lazyMedia.forEach(element => {
                if (element.tagName === 'IMG') {
                    if (element.dataset.src) element.src = element.dataset.src;
                    if (element.dataset.srcset) element.srcset = element.dataset.srcset;
                } else if (element.tagName === 'IFRAME') {
                    element.src = element.dataset.src;
                }
                if (element.dataset.bg) {
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                }
                element.classList.add('lazy-loaded');
            });
        };
        
        // Load all media after a delay
        setTimeout(loadAllMedia, 500);
    }
});
