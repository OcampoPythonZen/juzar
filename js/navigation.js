/**
 * File: navigation.js
 * Handles mobile menu functionality and other navigation-related features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            
            // Toggle the menu
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            // Update the button icon
            const menuIcon = this.querySelector('svg');
            if (menuIcon) {
                if (!isExpanded) {
                    // Change to X icon when opening
                    menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                } else {
                    // Change back to hamburger icon when closing
                    menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
                }
            }
        });
    }
    
    // Close mobile menu when a menu item is clicked
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (mobileMenuButton) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    const menuIcon = mobileMenuButton.querySelector('svg');
                    if (menuIcon) {
                        menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
                    }
                }
            }
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
    
    // Sticky header on scroll
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScroll = 0;
        const headerHeight = header.offsetHeight;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove sticky class based on scroll position
            if (currentScroll > headerHeight) {
                header.classList.add('sticky', 'top-0', 'bg-white/90', 'shadow-md', 'backdrop-blur-sm');
                header.classList.remove('bg-transparent');
                
                // Hide header on scroll down, show on scroll up
                if (currentScroll > lastScroll && currentScroll > headerHeight) {
                    // Scrolling down
                    header.style.transform = `translateY(-${headerHeight}px)`;
                } else {
                    // Scrolling up
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove('sticky', 'shadow-md', 'bg-white/90', 'backdrop-blur-sm');
                header.classList.add('bg-transparent');
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        });
    }
    
    // Add active class to current menu item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.site-header nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.classList.add('text-blue-600', 'font-semibold');
            link.setAttribute('aria-current', 'page');
        }
    });
});
