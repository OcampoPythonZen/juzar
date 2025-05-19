<?php
/**
 * Customizer additions
 *
 * @package JUZAR
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function juzar_customize_register($wp_customize) {
    // Add theme options panel
    $wp_customize->add_panel('juzar_theme_options', array(
        'title'    => esc_html__('Theme Options', 'juzar'),
        'priority' => 130,
    ));

    // Add site identity section
    $wp_customize->get_section('title_tagline')->panel = 'juzar_theme_options';
    $wp_customize->get_section('title_tagline')->priority = 1;

    // Add colors section
    $wp_customize->get_section('colors')->panel = 'juzar_theme_options';
    $wp_customize->get_section('colors')->title = esc_html__('Color Scheme', 'juzar');
    $wp_customize->get_section('colors')->priority = 2;

    // Add header image section
    $wp_customize->get_section('header_image')->panel = 'juzar_theme_options';
    $wp_customize->get_section('header_image')->priority = 3;

    // Add background image section
    $wp_customize->get_section('background_image')->panel = 'juzar_theme_options';
    $wp_customize->get_section('background_image')->priority = 4;

    // Add footer section
    $wp_customize->add_section('juzar_footer_options', array(
        'title'    => esc_html__('Footer', 'juzar'),
        'panel'    => 'juzar_theme_options',
        'priority' => 20,
    ));

    // Add footer copyright text
    $wp_customize->add_setting('juzar_footer_copyright', array(
        'default'           => sprintf(esc_html__('© %d %s. All rights reserved.', 'juzar'), date('Y'), get_bloginfo('name')),
        'sanitize_callback' => 'wp_kses_post',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('juzar_footer_copyright', array(
        'label'   => esc_html__('Copyright Text', 'juzar'),
        'section' => 'juzar_footer_options',
        'type'    => 'textarea',
    ));

    // Add social media section
    $wp_customize->add_section('juzar_social_media', array(
        'title'    => esc_html__('Social Media', 'juzar'),
        'panel'    => 'juzar_theme_options',
        'priority' => 30,
    ));

    // Social media URLs
    $social_platforms = array(
        'facebook'  => esc_html__('Facebook URL', 'juzar'),
        'twitter'   => esc_html__('Twitter URL', 'juzar'),
        'instagram' => esc_html__('Instagram URL', 'juzar'),
        'linkedin'  => esc_html__('LinkedIn URL', 'juzar'),
        'youtube'   => esc_html__('YouTube URL', 'juzar'),
        'github'    => esc_html__('GitHub URL', 'juzar'),
    );

    foreach ($social_platforms as $platform => $label) {
        $wp_customize->add_setting('juzar_' . $platform . '_url', array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
            'transport'         => 'postMessage',
        ));

        $wp_customize->add_control('juzar_' . $platform . '_url', array(
            'label'   => $label,
            'section' => 'juzar_social_media',
            'type'    => 'url',
        ));
    }

    // Add 3D model viewer section
    $wp_customize->add_section('juzar_model_viewer', array(
        'title'    => esc_html__('3D Model Viewer', 'juzar'),
        'panel'    => 'juzar_theme_options',
        'priority' => 40,
    ));

    // Model file upload
    $wp_customize->add_setting('juzar_model_file', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control(new WP_Customize_Upload_Control(
        $wp_customize,
        'juzar_model_file',
        array(
            'label'    => esc_html__('3D Model File (.glb)', 'juzar'),
            'section'  => 'juzar_model_viewer',
            'settings' => 'juzar_model_file',
            'mime_type' => 'model/gltf-binary',
        )
    ));

    // Model scale
    $wp_customize->add_setting('juzar_model_scale', array(
        'default'           => '1',
        'sanitize_callback' => 'absint',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('juzar_model_scale', array(
        'label'       => esc_html__('Model Scale', 'juzar'),
        'description' => esc_html__('Adjust the size of the 3D model (1 = 100%)', 'juzar'),
        'section'     => 'juzar_model_viewer',
        'type'        => 'number',
        'input_attrs' => array(
            'min'  => 1,
            'max'  => 10,
            'step' => 0.1,
        ),
    ));

    // Enable auto-rotation
    $wp_customize->add_setting('juzar_model_auto_rotate', array(
        'default'           => false,
        'sanitize_callback' => 'juzar_sanitize_checkbox',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('juzar_model_auto_rotate', array(
        'label'   => esc_html__('Enable Auto-Rotation', 'juzar'),
        'section' => 'juzar_model_viewer',
        'type'    => 'checkbox',
    ));

    // Add selective refresh for live preview
    $wp_customize->selective_refresh->add_partial('juzar_footer_copyright', array(
        'selector'        => '.site-info',
        'render_callback' => 'juzar_display_footer_copyright',
    ));
}
add_action('customize_register', 'juzar_customize_register');

/**
 * Sanitize checkbox values.
 */
function juzar_sanitize_checkbox($checked) {
    return ( ( isset($checked) && true == $checked ) ? true : false );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function juzar_customize_preview_js() {
    wp_enqueue_script(
        'juzar-customizer',
        get_template_directory_uri() . '/js/customizer.js',
        array('customize-preview'),
        '20151215',
        true
    );
}
add_action('customize_preview_init', 'juzar_customize_preview_js');

/**
 * Load dynamic logic for the customizer controls.
 */
function juzar_customize_controls_js() {
    wp_enqueue_script(
        'juzar-customize-controls',
        get_template_directory_uri() . '/js/customize-controls.js',
        array('jquery', 'customize-controls'),
        '20181110',
        true
    );
}
add_action('customize_controls_enqueue_scripts', 'juzar_customize_controls_js');

/**
 * Display the footer copyright text.
 */
function juzar_display_footer_copyright() {
    $copyright = get_theme_mod('juzar_footer_copyright');
    if ($copyright) {
        echo '<div class="site-info">' . wp_kses_post($copyright) . '</div>';
    }
}
