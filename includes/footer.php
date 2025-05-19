<?php
/**
 * Footer template part
 * 
 * @package JUZAR
 */
?>
    </main><!-- .site-content -->

    <footer class="site-footer bg-gray-900 text-white py-8" role="contentinfo">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Footer Widget 1 -->
                <div class="footer-widget">
                    <?php if (is_active_sidebar('footer-1')) : ?>
                        <?php dynamic_sidebar('footer-1'); ?>
                    <?php else : ?>
                        <h3 class="text-xl font-bold mb-4"><?php bloginfo('name'); ?></h3>
                        <p><?php esc_html_e('A modern WordPress theme with 3D model viewing capabilities.', 'juzar'); ?></p>
                    <?php endif; ?>
                </div>

                <!-- Footer Widget 2 -->
                <div class="footer-widget">
                    <?php if (is_active_sidebar('footer-2')) : ?>
                        <?php dynamic_sidebar('footer-2'); ?>
                    <?php else : ?>
                        <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Quick Links', 'juzar'); ?></h3>
                        <?php
                        wp_nav_menu(array(
                            'theme_location' => 'footer',
                            'menu_class'     => 'space-y-2',
                            'container'      => false,
                            'fallback_cb'    => false,
                        ));
                        ?>
                    <?php endif; ?>
                </div>

                <!-- Footer Widget 3 -->
                <div class="footer-widget">
                    <?php if (is_active_sidebar('footer-3')) : ?>
                        <?php dynamic_sidebar('footer-3'); ?>
                    <?php else : ?>
                        <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Contact Us', 'juzar'); ?></h3>
                        <address class="not-italic">
                            <p>123 Example St.</p>
                            <p>City, State 12345</p>
                            <p>Email: info@example.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </address>
                    <?php endif; ?>
                </div>
            </div>

            <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('All rights reserved.', 'juzar'); ?></p>
            </div>
        </div>
    </footer>


    <?php wp_footer(); ?>
</body>
</html>
