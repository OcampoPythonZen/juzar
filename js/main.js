// Import the model viewer component
import { ModelViewer } from './components/model-viewer.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the 3D model viewer
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        // Update the path to your .glb model
        const modelPath = themeData.themeUrl + '/assets/models/your-model.glb';
        const viewer = new ModelViewer('model-container', modelPath);

        // Add event listeners for model loading
        document.addEventListener('modelLoaded', (e) => {
            console.log('Model loaded successfully', e.detail.model);
            // You can add any post-loading logic here
        });

        document.addEventListener('modelLoading', (e) => {
            const percent = e.detail.percent.toFixed(1);
            console.log(`Loading: ${percent}%`);
            // Update loading progress UI if needed
        });

        document.addEventListener('modelError', (e) => {
            console.error('Failed to load model:', e.detail.error);
            // Display error message to the user
            modelContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div class="text-red-500 mb-2">
                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Error Loading Model</h3>
                    <p class="mt-1 text-sm text-gray-500">We couldn't load the 3D model. Please try again later.</p>
                    <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Retry
                    </button>
                </div>
            `;
        });
    }

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('[aria-label="Toggle menu"]');
    const mobileMenu = document.querySelector('nav');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Add scroll-based animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate-fade-in-up');
            }
        });
    };

    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    /* Add some delay for staggered animations */
    .animate-delay-100 { animation-delay: 0.1s; }
    .animate-delay-200 { animation-delay: 0.2s; }
    .animate-delay-300 { animation-delay: 0.3s; }
`;
document.head.appendChild(style);
