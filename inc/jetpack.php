<?php
/**
 * Jetpack compatibility file.
 *
 * @link https://jetpack.com/
 *
 * @package JUZAR
 */

/**
 * Jetpack setup function.
 *
 * See: https://jetpack.com/support/infinite-scroll/
 * See: https://jetpack.com/support/responsive-videos/
 * See: https://jetpack.com/support/content-options/
 */
function juzar_jetpack_setup() {
    // Add theme support for Infinite Scroll.
    add_theme_support(
        'infinite-scroll',
        array(
            'container' => 'main',
            'render'    => 'juzar_infinite_scroll_render',
            'footer'    => 'page',
        )
    );

    // Add theme support for Responsive Videos.
    add_theme_support('jetpack-responsive-videos');

    // Add theme support for Content Options.
    add_theme_support(
        'jetpack-content-options',
        array(
            'post-details' => array(
                'stylesheet' => 'juzar-style',
                'date'       => '.posted-on',
                'categories' => '.cat-links',
                'tags'       => '.tags-links',
                'author'     => '.byline',
                'comment'    => '.comments-link',
            ),
            'featured-images' => array(
                'archive' => true,
                'post'    => true,
                'page'    => true,
            ),
        )
    );
}
add_action('after_setup_theme', 'juzar_jetpack_setup');

/**
 * Custom render function for Infinite Scroll.
 */
function juzar_infinite_scroll_render() {
    while (have_posts()) {
        the_post();
        if (is_search()) :
            get_template_part('template-parts/content', 'search');
        else :
            get_template_part('template-parts/content', get_post_type());
        endif;
    }
}

/**
 * Filter the theme page templates.
 *
 * @param array $templates List of page templates. Keys are filenames, values are translated names.
 * @return array Filtered array of page templates.
 */
function juzar_jetpack_page_templates($templates) {
    $jetpack_templates = array(
        'page-templates/blank.php' => _x('Blank', 'Page template name', 'juzar'),
        'page-templates/fullwidth.php' => _x('Full Width', 'Page template name', 'juzar'),
        'page-templates/landing.php' => _x('Landing Page', 'Page template name', 'juzar'),
    );

    return array_merge($templates, $jetpack_templates);
}
add_filter('theme_page_templates', 'juzar_jetpack_page_templates');

/**
 * Add theme support for the Jetpack Portfolio custom post type.
 */
function juzar_jetpack_portfolio_cpt() {
    if (post_type_exists('jetpack-portfolio')) {
        add_theme_support('jetpack-portfolio');
    }
}
add_action('after_setup_theme', 'juzar_jetpack_portfolio_cpt');

/**
 * Custom CSS for Jetpack's Tiled Galleries.
 */
function juzar_jetpack_tiled_gallery_width() {
    if (!class_exists('Jetpack') || !Jetpack::is_module_active('tiled-gallery')) {
        return;
    }
    ?>
    <style type="text/css">
        .tiled-gallery {
            margin: 2em auto;
        }
        .tiled-gallery img {
            border: none !important;
            box-shadow: none !important;
        }
        .tiled-gallery-caption {
            font-size: 0.9em;
            font-style: italic;
            margin: 0;
            padding: 0.5em;
        }
    </style>
    <?php
}
add_action('wp_head', 'juzar_jetpack_tiled_gallery_width');

/**
 * Customize Jetpack's Related Posts output.
 */
function juzar_jetpack_related_posts_headline($headline) {
    $headline = sprintf(
        '<h3 class="jp-relatedposts-headline"><span>%s</span></h3>',
        esc_html__('Related Posts', 'juzar')
    );
    return $headline;
}
add_filter('jetpack_relatedposts_filter_headline', 'juzar_jetpack_related_posts_headline');

/**
 * Add theme support for Jetpack's site logo.
 */
function juzar_jetpack_site_logo_init() {
    $args = array(
        'header-text' => array(
            'site-title',
            'site-description',
        ),
        'size' => 'medium',
    );
    add_theme_support('site-logo', $args);
}
add_action('after_setup_theme', 'juzar_jetpack_site_logo_init', 11);

/**
 * Add theme support for Jetpack's site logo.
 */
function juzar_jetpack_site_logo_to_site_icon($has_site_icon, $blog_id) {
    if (!$has_site_icon && function_exists('jetpack_has_site_logo')) {
        return jetpack_has_site_logo();
    }
    return $has_site_icon;
}
add_filter('has_site_icon', 'juzar_jetpack_site_logo_to_site_icon', 10, 2);
