<?php
/**
 * Testimonials section template part
 * 
 * @package JUZAR
 */
?>
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                <?php echo esc_html__('Testimonials', 'juzar'); ?>
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <?php echo esc_html__('What Our Customers Say', 'juzar'); ?>
            </h2>
            <p class="text-xl text-gray-600">
                <?php echo esc_html__('Don\'t just take our word for it. Here\'s what our customers have to say about our fire safety products.', 'juzar'); ?>
            </p>
        </div>

        <!-- Testimonials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Testimonial 1 -->
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center mb-6">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/avatar-1.jpg'); ?>" 
                             alt="Sarah Johnson" 
                             class="w-full h-full object-cover"
                             loading="lazy">
                    </div>
                    <div class="ml-4">
                        <h4 class="font-bold text-lg">Sarah Johnson</h4>
                        <p class="text-blue-600 text-sm">Safety Manager, TechCorp</p>
                    </div>
                </div>
                <div class="text-yellow-400 mb-4">
                    <?php for ($i = 0; $i < 5; $i++) : ?>
                        <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                    <?php endfor; ?>
                </div>
                <p class="text-gray-600 italic">
                    "The fire extinguishers we purchased have given us peace of mind. The 3D viewer on the website helped us understand the product features better before making a decision."
                </p>
            </div>

            <!-- Testimonial 2 -->
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center mb-6">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/avatar-2.jpg'); ?>" 
                             alt="Michael Chen" 
                             class="w-full h-full object-cover"
                             loading="lazy">
                    </div>
                    <div class="ml-4">
                        <h4 class="font-bold text-lg">Michael Chen</h4>
                        <p class="text-blue-600 text-sm">Facility Director, EduPlus</p>
                    </div>
                </div>
                <div class="text-yellow-400 mb-4">
                    <?php for ($i = 0; $i < 5; $i++) : ?>
                        <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                    <?php endfor; ?>
                </div>
                <p class="text-gray-600 italic">
                    "Outstanding customer service and high-quality products. The interactive 3D model on their website helped us train our staff on proper usage before the equipment even arrived."
                </p>
            </div>

            <!-- Testimonial 3 -->
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center mb-6">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/avatar-3.jpg'); ?>" 
                             alt="Emma Rodriguez" 
                             class="w-full h-full object-cover"
                             loading="lazy">
                    </div>
                    <div class="ml-4">
                        <h4 class="font-bold text-lg">Emma Rodriguez</h4>
                        <p class="text-blue-600 text-sm">CEO, SafeHaven Inc.</p>
                    </div>
                </div>
                <div class="text-yellow-400 mb-4">
                    <?php for ($i = 0; $i < 5; $i++) : ?>
                        <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                    <?php endfor; ?>
                </div>
                <p class="text-gray-600 italic">
                    "The 3D model viewer on their website is revolutionary. Being able to examine the fire extinguisher from all angles gave us confidence in our purchase. The product exceeded our expectations."
                </p>
            </div>
        </div>
    </div>
</section>
