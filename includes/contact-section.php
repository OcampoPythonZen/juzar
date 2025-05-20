<?php
/**
 * Contact section template part
 * 
 * @package JUZAR
 */
?>
<section id="contact" class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <!-- Contact Information -->
                <div class="lg:pr-12">
                    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        <?php echo esc_html__('Get In Touch', 'juzar'); ?>
                    </h2>
                    <p class="text-xl text-gray-600 mb-8">
                        <?php echo esc_html__('Have questions about our fire safety products? Our team is here to help you find the perfect solution for your needs.', 'juzar'); ?>
                    </p>
                    
                    <div class="space-y-6">
                        <!-- Contact Info 1 -->
                        <div class="flex items-start">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-900"><?php echo esc_html__('Email Us', 'juzar'); ?></h3>
                                <p class="text-gray-600">info@juzarsafety.com</p>
                            </div>
                        </div>
                        
                        <!-- Contact Info 2 -->
                        <div class="flex items-start">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-900"><?php echo esc_html__('Call Us', 'juzar'); ?></h3>
                                <p class="text-gray-600">+1 (555) 123-4567</p>
                            </div>
                        </div>
                        
                        <!-- Contact Info 3 -->
                        <div class="flex items-start">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-semibold text-gray-900"><?php echo esc_html__('Visit Us', 'juzar'); ?></h3>
                                <p class="text-gray-600">123 Safety Way, Suite 100<br>San Francisco, CA 94107</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Contact Form -->
                <div class="bg-gray-50 p-8 rounded-2xl shadow-lg">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">
                        <?php echo esc_html__('Send Us a Message', 'juzar'); ?>
                    </h3>
                    
                    <form id="contact-form" class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                                <?php echo esc_html__('Full Name', 'juzar'); ?>
                            </label>
                            <input type="text" id="name" name="name" required 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                   placeholder="<?php echo esc_attr__('John Doe', 'juzar'); ?>">
                        </div>
                        
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                                <?php echo esc_html__('Email Address', 'juzar'); ?>
                            </label>
                            <input type="email" id="email" name="email" required
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                   placeholder="<?php echo esc_attr__('you@example.com', 'juzar'); ?>">
                        </div>
                        
                        <div>
                            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
                                <?php echo esc_html__('Subject', 'juzar'); ?>
                            </label>
                            <input type="text" id="subject" name="subject" required
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                   placeholder="<?php echo esc_attr__('How can we help?', 'juzar'); ?>">
                        </div>
                        
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                                <?php echo esc_html__('Your Message', 'juzar'); ?>
                            </label>
                            <textarea id="message" name="message" rows="4" required
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      placeholder="<?php echo esc_attr__('Tell us more about your needs...', 'juzar'); ?>"></textarea>
                        </div>
                        
                        <div class="pt-2">
                            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:-translate-y-0.5">
                                <?php echo esc_html__('Send Message', 'juzar'); ?>
                                <svg class="w-5 h-5 inline-block ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
