<?php
/**
 * JUZAR - WordPress Theme
 *
 * @package JUZAR
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define theme constants
define('JUZAR_THEME_VERSION', '1.0.0');
define('JUZAR_THEME_DIR', get_template_directory());
define('JUZAR_THEME_URI', get_template_directory_uri());

/**
 * Enqueue theme scripts and styles
 */
function juzar_enqueue_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap', array(), null);
    
    // Enqueue main stylesheet
    wp_enqueue_style('juzar-style', get_stylesheet_uri(), array(), JUZAR_THEME_VERSION);
    
    // Enqueue Vite-compiled CSS (development or production)
    if (defined('WP_DEBUG') && WP_DEBUG) {
        // In development, use Vite dev server
        wp_enqueue_style('juzar-vite-dev', 'http://localhost:3000/css/main.css', array(), null);
    } else {
        // In production, use built assets
        wp_enqueue_style('juzar-main', get_template_directory_uri() . '/dist/css/styles.css', array(), JUZAR_THEME_VERSION);
    }
    
    // Enqueue Three.js from CDN with version locking
    wp_enqueue_script('three-js', 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', array(), '0.160.0', true);
    
    // Enqueue GLTFLoader
    wp_enqueue_script('gltfloader', 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js', array('three-js'), '0.160.0', true);
    
    // Enqueue OrbitControls
    wp_enqueue_script('orbit-controls', 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js', array('three-js'), '0.160.0', true);
    
    // Enqueue custom scripts
    wp_enqueue_script('juzar-navigation', get_template_directory_uri() . '/js/navigation.js', array('jquery'), JUZAR_THEME_VERSION, true);
    
    // Enqueue model viewer component
    wp_enqueue_script('juzar-model-viewer', get_template_directory_uri() . '/js/components/model-viewer.js', array('jquery', 'three-js', 'gltfloader', 'orbit-controls'), JUZAR_THEME_VERSION, true);
    
    // Main JavaScript file - loaded through Vite in development
    if (defined('WP_DEBUG') && WP_DEBUG) {
        // In development, use Vite dev server
        wp_enqueue_script('juzar-vite', 'http://localhost:3000/js/main.js', array('jquery', 'juzar-navigation'), null, true);
    } else {
        // In production, use built assets
        wp_enqueue_script('juzar-main', get_template_directory_uri() . '/dist/js/main.js', array('jquery', 'juzar-navigation'), JUZAR_THEME_VERSION, true);
    }
    
    // Localize script with theme directory for AJAX and other dynamic data
    wp_localize_script(defined('WP_DEBUG') && WP_DEBUG ? 'juzar-vite' : 'juzar-main', 'juzarData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'themeUrl' => get_template_directory_uri(),
        'nonce' => wp_create_nonce('juzar-nonce'),
        'isDebug' => defined('WP_DEBUG') && WP_DEBUG,
    ));
    
    // Add critical CSS for above-the-fold content
    $critical_css = "
        /* Critical CSS for above-the-fold content */
        :root {
            --primary-500: #0ea5e9;
            --primary-600: #0284c7;
            --primary-700: #0369a1;
            --gray-50: #f8fafc;
            --gray-100: #f1f5f9;
            --gray-200: #e2e8f0;
            --gray-900: #0f172a;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            color: var(--gray-900);
            margin: 0;
            padding: 0;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Lexend', system-ui, -apple-system, sans-serif;
            font-weight: 600;
            line-height: 1.2;
            margin-top: 0;
            margin-bottom: 0.5em;
        }
        
        a {
            color: var(--primary-600);
            text-decoration: none;
            transition: color 0.2s ease-in-out;
        }
        
        a:hover {
            color: var(--primary-700);
        }
        
        .container {
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1rem;
            padding-right: 1rem;
        }
        
        @media (min-width: 640px) {
            .container {
                max-width: 640px;
            }
        }
        
        @media (min-width: 768px) {
            .container {
                max-width: 768px;
            }
        }
        
        @media (min-width: 1024px) {
            .container {
                max-width: 1024px;
            }
        }
        
        @media (min-width: 1280px) {
            .container {
                max-width: 1280px;
            }
        }
    ";
    
    wp_add_inline_style('juzar-style', $critical_css);
}
add_action('wp_enqueue_scripts', 'juzar_enqueue_scripts');

/**
 * Theme setup
 */
function juzar_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');
    
    // Let WordPress manage the document title
    add_theme_support('title-tag');
    
    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');
    
    // Add support for core custom logo
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 300,
        'flex-width'  => true,
        'flex-height' => true,
    ));
    
    // Add theme support for selective refresh for widgets
    add_theme_support('customize-selective-refresh-widgets');
    
    // Add support for Block Styles
    add_theme_support('wp-block-styles');
    
    // Add support for full and wide align images
    add_theme_support('align-wide');
    
    // Add support for responsive embedded content
    add_theme_support('responsive-embeds');
    
    // Add HTML5 support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'juzar'),
        'footer'  => esc_html__('Footer Menu', 'juzar'),
    ));
    
    // Add support for editor styles
    add_theme_support('editor-styles');
    add_editor_style('editor-style.css');
    
    // Add image sizes
    add_image_size('juzar-featured', 1200, 675, true); // 16:9 ratio
    add_image_size('juzar-thumbnail', 400, 400, true); // Square thumbnail
}
add_action('after_setup_theme', 'juzar_setup');

/**
 * Register widget areas
 */
function juzar_widgets_init() {
    // Main Sidebar
    register_sidebar(array(
        'name'          => esc_html__('Sidebar', 'juzar'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Add widgets here to appear in your sidebar.', 'juzar'),
        'before_widget' => '<section id="%1$s" class="widget %2$s mb-8">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title text-xl font-semibold mb-4">',
        'after_title'   => '</h3>',
    ));
    
    // Footer Widget Areas
    register_sidebar(array(
        'name'          => esc_html__('Footer 1', 'juzar'),
        'id'            => 'footer-1',
        'description'   => esc_html__('Add widgets here to appear in your footer.', 'juzar'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="text-lg font-semibold text-white mb-4">',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => esc_html__('Footer 2', 'juzar'),
        'id'            => 'footer-2',
        'description'   => esc_html__('Add widgets here to appear in your footer.', 'juzar'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="text-lg font-semibold text-white mb-4">',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => esc_html__('Footer 3', 'juzar'),
        'id'            => 'footer-3',
        'description'   => esc_html__('Add widgets here to appear in your footer.', 'juzar'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="text-lg font-semibold text-white mb-4">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'juzar_widgets_init');

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function juzar_pingback_header() {
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}
add_action('wp_head', 'juzar_pingback_header');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if (defined('JETPACK__VERSION')) {
    require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Load WooCommerce compatibility file.
 */
if (class_exists('WooCommerce')) {
    require get_template_directory() . '/inc/woocommerce.php';
}

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';
