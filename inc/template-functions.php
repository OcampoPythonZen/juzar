<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package JUZAR
 */

if (!function_exists('juzar_body_classes')) :
    /**
     * Adds custom classes to the array of body classes.
     *
     * @param array $classes Classes for the body element.
     * @return array
     */
    function juzar_body_classes($classes) {
        // Adds a class of hfeed to non-singular pages.
        if (!is_singular()) {
            $classes[] = 'hfeed';
        }

        // Adds a class of no-sidebar when there is no sidebar present.
        if (!is_active_sidebar('sidebar-1')) {
            $classes[] = 'no-sidebar';
        }

        // Add a class if the site has a custom logo.
        if (has_custom_logo()) {
            $classes[] = 'has-custom-logo';
        }

        // Add a class if the site has a custom header image.
        if (has_header_image()) {
            $classes[] = 'has-header-image';
        }

        // Add a class if the site is in dark mode (you'll need to implement the logic for this).
        if (get_theme_mod('dark_mode', false)) {
            $classes[] = 'dark-mode';
        }

        return $classes;
    }
    add_filter('body_class', 'juzar_body_classes');
endif;

if (!function_exists('juzar_pingback_header')) :
    /**
     * Add a pingback url auto-discovery header for single posts, pages, or attachments.
     */
    function juzar_pingback_header() {
        if (is_singular() && pings_open()) {
            printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
        }
    }
    add_action('wp_head', 'juzar_pingback_header');
endif;

if (!function_exists('juzar_excerpt_more')) :
    /**
     * Replaces the excerpt "read more" text by a link.
     */
    function juzar_excerpt_more($more) {
        if (!is_single()) {
            $more = sprintf(
                '... <a class="read-more" href="%1$s">%2$s</a>',
                esc_url(get_permalink(get_the_ID())),
                sprintf(
                    /* translators: %s: Name of current post */
                    esc_html__('Continue reading %s', 'juzar'),
                    '<span class="screen-reader-text">' . get_the_title(get_the_ID()) . '</span>'
                )
            );
        }
        return $more;
    }
    add_filter('excerpt_more', 'juzar_excerpt_more');
endif;

if (!function_exists('juzar_excerpt_length')) :
    /**
     * Change excerpt length.
     */
    function juzar_excerpt_length($length) {
        return 20; // Number of words to show in excerpt
    }
    add_filter('excerpt_length', 'juzar_excerpt_length', 999);
endif;

if (!function_exists('juzar_add_editor_styles')) :
    /**
     * Add custom editor styles.
     */
    function juzar_add_editor_styles() {
        add_editor_style([
            'assets/css/editor-style.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        ]);
    }
    add_action('admin_init', 'juzar_add_editor_styles');
endif;

if (!function_exists('juzar_skip_link_focus_fix')) :
    /**
     * Fix skip link focus in IE11.
     *
     * This does not enqueue the script because it is tiny and because it is only for IE11,
     * thus it does not warrant having an entire dedicated blocking script being loaded.
     *
     * @link https://git.io/vWdr2
     */
    function juzar_skip_link_focus_fix() {
        // The following is minified via `terser --compress --mangle -- js/skip-link-focus-fix.js`.
        ?>
        <script>
        /(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var t,e=location.hash.substring(1);/^[A-z0-9_-]+$/.test(e)&&(t=document.getElementById(e))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())},!1);
        </script>
        <?php
    }
    add_action('wp_print_footer_scripts', 'juzar_skip_link_focus_fix');
endif;

if (!function_exists('juzar_add_async_defer_attributes')) :
    /**
     * Add async/defer attributes to enqueued scripts that have the specified script_execution flag.
     *
     * @param string $tag    The script tag.
     * @param string $handle The script handle.
     * @return string Script HTML string.
     */
    function juzar_add_async_defer_attributes($tag, $handle) {
        foreach (['async', 'defer'] as $attr) {
            if (!wp_scripts()->get_data($handle, $attr)) {
                continue;
            }
            // Prevent adding attribute when already added in #12009.
            if (!preg_match("\s$attr(?:\s|$)/", $tag)) {
                $tag = preg_replace(':(?=></script>):', " $attr", $tag, 1);
            }
            // Only allow async or defer, not both.
            break;
        }
        return $tag;
    }
    add_filter('script_loader_tag', 'juzar_add_async_defer_attributes', 10, 2);
endif;

if (!function_exists('juzar_get_social_links')) :
    /**
     * Get social media links from theme mods.
     *
     * @return array Array of social media links.
     */
    function juzar_get_social_links() {
        $socials = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github'];
        $links = [];

        foreach ($socials as $social) {
            $url = get_theme_mod('juzar_' . $social . '_url');
            if ($url) {
                $links[$social] = [
                    'url' => $url,
                    'label' => sprintf(esc_html__('Follow us on %s', 'juzar'), ucfirst($social)),
                    'icon' => $social,
                ];
            }
        }

        return apply_filters('juzar_social_links', $links);
    }
endif;
