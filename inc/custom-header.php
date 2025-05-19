<?php
/**
 * Custom Header feature
 *
 * @package JUZAR
 */

/**
 * Set up the WordPress core custom header feature.
 *
 * @uses juzar_header_style()
 */
function juzar_custom_header_setup() {
    add_theme_support(
        'custom-header',
        apply_filters(
            'juzar_custom_header_args',
            array(
                'default-image'      => '',
                'default-text-color' => '000000',
                'width'              => 1920,
                'height'             => 800,
                'flex-height'        => true,
                'wp-head-callback'   => 'juzar_header_style',
                'video'              => true,
            )
        )
    );
}
add_action('after_setup_theme', 'juzar_custom_header_setup');

if (!function_exists('juzar_header_style')) :
    /**
     * Styles the header image and text displayed on the blog.
     *
     * @see juzar_custom_header_setup().
     */
    function juzar_header_style() {
        $header_text_color = get_header_textcolor();
        $header_image = get_header_image();

        // If we get this far, we have custom styles. Let's do this.
        ?>
        <style type="text/css">
        <?php
        // Has the text been hidden?
        if (!display_header_text()) :
            ?>
            .site-title,
            .site-description {
                position: absolute;
                clip: rect(1px, 1px, 1px, 1px);
                }
            <?php
            // If the user has set a custom color for the text use that.
        else :
            ?>
            .site-title a,
            .site-description {
                color: #<?php echo esc_attr($header_text_color); ?>;
            }
        <?php endif; ?>

        <?php if ($header_image) : ?>
            .site-header {
                background-image: url(<?php echo esc_url($header_image); ?>);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }
        <?php endif; ?>
        </style>
        <?php
    }
endif;

/**
 * Customize video play/pause button in the custom header.
 */
function juzar_video_controls($settings) {
    $settings['l10n']['play'] = '<span class="screen-reader-text">' . esc_html__('Play background video', 'juzar') . '</span>' . juzar_get_svg(array('icon' => 'play'));
    $settings['l10n']['pause'] = '<span class="screen-reader-text">' . esc_html__('Pause background video', 'juzar') . '</span>' . juzar_get_svg(array('icon' => 'pause'));
    return $settings;
}
add_filter('header_video_settings', 'juzar_video_controls');

/**
 * Add custom header image to the admin dashboard.
 */
function juzar_admin_header_image() {
    $style = 'style="color:#fff;background-color:#1a1a1a;padding:2em 0;text-align:center;"';
    $header_image = get_header_image();
    
    if ($header_image) :
        $header_image_style = 'style="background-image:url(' . esc_url($header_image) . ');background-size:cover;background-position:center;padding:4em 0;"';
    else :
        $header_image_style = '';
    endif;
    
    ?>
    <div id="headimg" <?php echo $header_image_style; ?>>
        <div class="displaying-header-text">
            <h1 class="displaying-header-text">
                <a id="name" <?php echo $style; ?> onclick="return false;" href="<?php echo esc_url(home_url('/')); ?>">
                    <?php bloginfo('name'); ?>
                </a>
            </h1>
            <div class="displaying-header-text" id="desc" <?php echo $style; ?>>
                <?php bloginfo('description'); ?>
            </div>
        </div>
    </div>
    <?php
}
