<?php
/**
 * Theme functions and definitions
 */

function theme_enqueue_scripts() {
    // Enqueue styles
    wp_enqueue_style('main-style', get_stylesheet_uri());
    
    // Enqueue Three.js from CDN
    wp_enqueue_script('three-js', 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', array(), '0.160.0', true);
    
    // Enqueue GLTFLoader
    wp_enqueue_script('gltfloader', 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js', array('three-js'), '0.160.0', true);
    
    // Enqueue OrbitControls
    wp_enqueue_script('orbit-controls', 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js', array('three-js'), '0.160.0', true);
    
    // Enqueue custom scripts
    wp_enqueue_script('main-js', get_template_directory_uri() . '/js/main.js', array('jquery', 'three-js'), '1.0.0', true);
    
    // Localize script with theme directory for AJAX and other dynamic data
    wp_localize_script('main-js', 'themeData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'themeUrl' => get_template_directory_uri(),
    ));
}
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');

// Theme setup
function theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    
    // Register menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'theme-text-domain'),
        'footer' => __('Footer Menu', 'theme-text-domain'),
    ));
}
add_action('after_setup_theme', 'theme_setup');

// Register widget areas
function theme_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'theme-text-domain'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in your sidebar.', 'theme-text-domain'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'theme_widgets_init');
