<?php
/**
 * Hero section template part with 3D model viewer
 * 
 * @package JUZAR
 */
?>
<section class="hero-section relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
    <!-- Background Pattern (optional) -->
    <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMjEgM2E5IDkgMCAwMTkuODA0IDUgOSA5IDAgMDEtMTcuNTU3IDBBNy45OTkgNy45OTkgMCAwMTIxIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
    
    <!-- 3D Model Container -->
    <div id="hero-model" class="absolute inset-0 w-full h-full">
        <!-- Programmatic 3D fire extinguisher will be rendered here -->
    </div>
    
    <!-- Hero Content -->
    <div class="container mx-auto px-4 z-20 text-center text-white">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    <?php echo esc_html__('Fire Safety Redefined', 'juzar'); ?>
                </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                <?php echo esc_html__('Experience our premium fire extinguisher in stunning 3D detail. Designed for safety, built for performance.', 'juzar'); ?>
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#features" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <?php echo esc_html__('Explore Features', 'juzar'); ?>
                    <svg class="w-5 h-5 inline-block ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
                <a href="#contact" class="bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 border-2 border-white/30 rounded-full transition-all duration-300 transform hover:scale-105">
                    <?php echo esc_html__('Get a Quote', 'juzar'); ?>
                </a>
            </div>
            
            <!-- Stats -->
            <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div class="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-blue-400">10+</div>
                    <div class="text-sm text-gray-300">Years Experience</div>
                </div>
                <div class="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-blue-400">5K+</div>
                    <div class="text-sm text-gray-300">Happy Clients</div>
                </div>
                <div class="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-blue-400">24/7</div>
                    <div class="text-sm text-gray-300">Support</div>
                </div>
                <div class="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div class="text-3xl font-bold text-blue-400">100%</div>
                    <div class="text-sm text-gray-300">Satisfaction</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 group cursor-pointer animate-bounce" onclick="document.querySelector('#features').scrollIntoView({ behavior: 'smooth' })">
        <div class="w-10 h-16 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div class="w-1 h-3 bg-white rounded-full group-hover:animate-ping"></div>
        </div>
        <span class="block text-xs text-white/70 text-center mt-2">Scroll Down</span>
    </div>
</section>

<!-- Initialize 3D Model -->
<script type="module">
    import { HeroModelViewer } from '<?php echo esc_url(get_template_directory_uri() . '/js/components/hero-model-viewer.js'); ?>';
    
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize the 3D model viewer with custom options
        new HeroModelViewer('hero-model', {
            autoRotate: true,
            autoRotateSpeed: 0.5,
            scale: 1.2,
            modelColor: '#ff3e3e',
            cameraPosition: { x: 0, y: 0.5, z: 3 },
            backgroundColor: 0x000000
        });
        
        // Add parallax effect to the model on mouse move
        const modelContainer = document.getElementById('hero-model');
        if (modelContainer) {
            modelContainer.addEventListener('mousemove', (e) => {
                const x = (window.innerWidth / 2 - e.pageX) / 50;
                const y = (window.innerHeight / 2 - e.pageY) / 50;
                modelContainer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
            
            // Reset on mouse leave
            modelContainer.addEventListener('mouseleave', () => {
                modelContainer.style.transform = 'translate3d(0, 0, 0)';
            });
        }
    });
    
    // Parallax effect for the hero section
    document.addEventListener('mousemove', (e) => {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
        }
    });
</script>
