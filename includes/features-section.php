<?php
/**
 * Features section template part
 * 
 * @package JUZAR
 */
?>
<section id="features" class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <?php echo esc_html__('Advanced Fire Safety Features', 'juzar'); ?>
            </h2>
            <p class="text-xl text-gray-600">
                <?php echo esc_html__('Our fire extinguishers are designed with cutting-edge technology to provide maximum protection and ease of use.', 'juzar'); ?>
            </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="feature-card group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <svg class="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3"><?php echo esc_html__('Advanced Protection', 'juzar'); ?></h3>
                <p class="text-gray-600">
                    <?php echo esc_html__('Our fire extinguishers are designed to quickly suppress various types of fires with maximum efficiency.', 'juzar'); ?>
                </p>
            </div>

            <!-- Feature 2 -->
            <div class="feature-card group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <svg class="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3"><?php echo esc_html__('Easy to Use', 'juzar'); ?></h3>
                <p class="text-gray-600">
                    <?php echo esc_html__('Designed with intuitive controls and clear instructions for quick response during emergencies.', 'juzar'); ?>
                </p>
            </div>

            <!-- Feature 3 -->
            <div class="feature-card group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <svg class="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3"><?php echo esc_html__('Fast Acting', 'juzar'); ?></h3>
                <p class="text-gray-600">
                    <?php echo esc_html__('Rapid response formula works quickly to suppress flames and prevent re-ignition.', 'juzar'); ?>
                </p>
            </div>
        </div>
    </div>
</section>
