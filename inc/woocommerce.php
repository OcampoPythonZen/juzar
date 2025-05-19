<?php
/**
 * WooCommerce compatibility for JUZAR theme.
 *
 * @package JUZAR
 */

/**
 * WooCommerce setup function.
 *
 * @link https://docs.woocommerce.com/document/third-party-custom-theme-compatibility/
 * @link https://github.com/woocommerce/woocommerce/wiki/Enabling-product-gallery-features-(zoom,-swipe,-lightbox)-in-3.0.0
 *
 * @return void
 */
function juzar_woocommerce_setup() {
    add_theme_support(
        'woocommerce',
        array(
            'product_grid' => array(
                'default_rows'    => 3,
                'min_rows'        => 2,
                'max_rows'        => 8,
                'default_columns' => 4,
                'min_columns'     => 2,
                'max_columns'     => 5,
            ),
        )
    );
    
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    
    // Remove default WooCommerce wrappers
    remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
    remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
    
    // Add theme wrappers
    add_action('woocommerce_before_main_content', 'juzar_woocommerce_wrapper_start', 10);
    add_action('woocommerce_after_main_content', 'juzar_woocommerce_wrapper_end', 10);
}
add_action('after_setup_theme', 'juzar_woocommerce_setup');

/**
 * Before Content.
 *
 * Wraps all WooCommerce content in wrappers which match the theme markup.
 *
 * @return void
 */
function juzar_woocommerce_wrapper_start() {
    ?>
    <div id="primary" class="content-area">
        <main id="main" class="site-main" role="main">
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full px-4">
    <?php
}

/**
 * After Content.
 *
 * Closes the wrapping divs.
 *
 * @return void
 */
function juzar_woocommerce_wrapper_end() {
    ?>
                    </div>
                </div>
            </div>
        </main><!-- #main -->
    </div><!-- #primary -->
    <?php
}

/**
 * Sample implementation of the WooCommerce Mini Cart.
 *
 * You can add the WooCommerce Mini Cart to header.php like so ...
 *
 * <?php
 * if (function_exists('juzar_woocommerce_header_cart')) {
 *     juzar_woocommerce_header_cart();
 * }
 * ?>
 */
if (!function_exists('juzar_woocommerce_cart_link_fragment')) {
    /**
     * Cart Fragments.
     *
     * Ensure cart contents update when products are added to the cart via AJAX.
     *
     * @param array $fragments Fragments to refresh via AJAX.
     * @return array Fragments to refresh via AJAX.
     */
    function juzar_woocommerce_cart_link_fragment($fragments) {
        ob_start();
        juzar_woocommerce_cart_link();
        $fragments['a.cart-contents'] = ob_get_clean();

        ob_start();
        juzar_woocommerce_cart_count();
        $fragments['span.cart-count'] = ob_get_clean();

        return $fragments;
    }
}
add_filter('woocommerce_add_to_cart_fragments', 'juzar_woocommerce_cart_link_fragment');

if (!function_exists('juzar_woocommerce_cart_link')) {
    /**
     * Cart Link.
     *
     * Displayed a link to the cart including the number of items present and the cart total.
     *
     * @return void
     */
    function juzar_woocommerce_cart_link() {
        ?>
        <a class="cart-contents" href="<?php echo esc_url(wc_get_cart_url()); ?>" title="<?php esc_attr_e('View your shopping cart', 'juzar'); ?>">
            <?php
            $item_count_text = sprintf(
                /* translators: number of items in the mini cart. */
                _n('%d item', '%d items', WC()->cart->get_cart_contents_count(), 'juzar'),
                WC()->cart->get_cart_contents_count()
            );
            ?>
            <span class="amount"><?php echo wp_kses_data(WC()->cart->get_cart_subtotal()); ?></span> 
            <span class="count"><?php echo esc_html($item_count_text); ?></span>
        </a>
        <?php
    }
}

if (!function_exists('juzar_woocommerce_header_cart')) {
    /**
     * Display Header Cart.
     *
     * @return void
     */
    function juzar_woocommerce_header_cart() {
        if (is_cart()) {
            $class = 'current-menu-item';
        } else {
            $class = '';
        }
        ?>
        <ul id="site-header-cart" class="site-header-cart">
            <li class="<?php echo esc_attr($class); ?>">
                <?php juzar_woocommerce_cart_link(); ?>
            </li>
            <li>
                <?php
                $instance = array(
                    'title' => '',
                );

                the_widget('WC_Widget_Cart', $instance);
                ?>
            </li>
        </ul>
        <?php
    }
}

/**
 * Remove default WooCommerce container.
 */
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0);

/**
 * Remove the breadcrumbs
 */
add_action('init', 'juzar_remove_wc_breadcrumbs');
function juzar_remove_wc_breadcrumbs() {
    remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0);
}

/**
 * Change number of products that are displayed per page (shop page)
 */
add_filter('loop_shop_per_page', 'juzar_shop_products_per_page', 20);
function juzar_shop_products_per_page($cols) {
    $cols = 12; // Default number of products per page
    return $cols;
}

/**
 * Change number of related products output
 */
function juzar_related_products_args($args) {
    $args['posts_per_page'] = 4; // 4 related products
    $args['columns'] = 4; // arranged in 4 columns
    return $args;
}
add_filter('woocommerce_output_related_products_args', 'juzar_related_products_args');

/**
 * Remove the product description heading
 */
add_filter('woocommerce_product_description_heading', '__return_null');

/**
 * Customize product data tabs
 */
add_filter('woocommerce_product_tabs', 'juzar_custom_product_tabs');
function juzar_custom_product_tabs($tabs) {
    // Rename the description tab
    if (isset($tabs['description'])) {
        $tabs['description']['title'] = esc_html__('Description', 'juzar');
    }
    
    // Rename the additional information tab
    if (isset($tabs['additional_information'])) {
        $tabs['additional_information']['title'] = esc_html__('Additional Information', 'juzar');
    }
    
    return $tabs;
}
