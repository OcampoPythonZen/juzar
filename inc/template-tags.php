<?php
/**
 * Custom template tags for this theme
 *
 * @package JUZAR
 */

if (!function_exists('juzar_posted_on')) :
    /**
     * Prints HTML with meta information for the current post-date/time.
     */
    function juzar_posted_on() {
        $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
        if (get_the_time('U') !== get_the_modified_time('U')) {
            $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
        }

        $time_string = sprintf(
            $time_string,
            esc_attr(get_the_date(DATE_W3C)),
            esc_html(get_the_date()),
            esc_attr(get_the_modified_date(DATE_W3C)),
            esc_html(get_the_modified_date())
        );

        $posted_on = sprintf(
            /* translators: %s: post date. */
            esc_html_x('Posted on %s', 'post date', 'juzar'),
            '<a href="' . esc_url(get_permalink()) . '" rel="bookmark">' . $time_string . '</a>'
        );

        echo '<span class="posted-on">' . $posted_on . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }
endif;

if (!function_exists('juzar_posted_by')) :
    /**
     * Prints HTML with meta information for the current author.
     */
    function juzar_posted_by() {
        $byline = sprintf(
            /* translators: %s: post author. */
            esc_html_x('by %s', 'post author', 'juzar'),
            '<span class="author vcard"><a class="url fn n" href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">' . esc_html(get_the_author()) . '</a></span>'
        );

        echo '<span class="byline"> ' . $byline . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }
endif;

if (!function_exists('juzar_entry_footer')) :
    /**
     * Prints HTML with meta information for the categories, tags and comments.
     */
    function juzar_entry_footer() {
        // Hide category and tag text for pages.
        if ('post' === get_post_type()) {
            /* translators: used between list items, there is a space after the comma */
            $categories_list = get_the_category_list(esc_html__(', ', 'juzar'));
            if ($categories_list) {
                /* translators: 1: list of categories. */
                printf('<span class="cat-links">' . esc_html__('Posted in %1$s', 'juzar') . '</span>', $categories_list); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            }

            /* translators: used between list items, there is a space after the comma */
            $tags_list = get_the_tag_list('', esc_html_x(', ', 'list item separator', 'juzar'));
            if ($tags_list) {
                /* translators: 1: list of tags. */
                printf(' <span class="tags-links">' . esc_html__('Tagged %1$s', 'juzar') . '</span>', $tags_list); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            }
        }

        if (!is_single() && !post_password_required() && (comments_open() || get_comments_number())) {
            echo ' <span class="comments-link">';
            comments_popup_link(
                sprintf(
                    wp_kses(
                        /* translators: %s: post title */
                        __('Leave a Comment<span class="screen-reader-text"> on %s</span>', 'juzar'),
                        array(
                            'span' => array(
                                'class' => array(),
                            ),
                        )
                    ),
                    wp_kses_post(get_the_title())
                )
            );
            echo '</span>';
        }

        edit_post_link(
            sprintf(
                wp_kses(
                    /* translators: %s: Name of current post. Only visible to screen readers */
                    __('Edit <span class="screen-reader-text">%s</span>', 'juzar'),
                    array(
                        'span' => array(
                            'class' => array(),
                        ),
                    )
                ),
                wp_kses_post(get_the_title())
            ),
            ' <span class="edit-link">',
            '</span>'
        );
    }
endif;

if (!function_exists('juzar_post_thumbnail')) :
    /**
     * Displays an optional post thumbnail.
     *
     * Wraps the post thumbnail in an anchor element on index views, or a div
     * element when on single views.
     */
    function juzar_post_thumbnail($size = 'post-thumbnail') {
        if (post_password_required() || is_attachment() || !has_post_thumbnail()) {
            return;
        }

        if (is_singular()) :
            ?>
            <div class="post-thumbnail">
                <?php the_post_thumbnail($size); ?>
            </div><!-- .post-thumbnail -->
        <?php else : ?>
            <a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                <?php
                the_post_thumbnail(
                    $size,
                    array(
                        'alt' => the_title_attribute(
                            array(
                                'echo' => false,
                            )
                        ),
                    )
                );
                ?>
            </a>
            <?php
        endif; // End is_singular().
    }
endif;

if (!function_exists('juzar_the_posts_navigation')) :
    /**
     * Print the next and previous posts navigation.
     *
     * @param array $args Optional. See get_the_posts_pagination() for available arguments.
     */
    function juzar_the_posts_navigation($args = array()) {
        echo juzar_get_the_posts_navigation($args); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }
endif;

if (!function_exists('juzar_get_the_posts_navigation')) :
    /**
     * Retrieve the next and previous posts navigation.
     *
     * @param array $args Optional. See get_the_posts_pagination() for available arguments.
     * @return string Markup for posts navigation.
     */
    function juzar_get_the_posts_navigation($args = array()) {
        $navigation = '';
        $args       = wp_parse_args(
            $args,
            array(
                'prev_text'          => esc_html__('Older posts', 'juzar'),
                'next_text'          => esc_html__('Newer posts', 'juzar'),
                'screen_reader_text' => esc_html__('Posts navigation', 'juzar'),
            )
        );

        $next_link = get_previous_posts_link($args['next_text']);
        $prev_link = get_next_posts_link($args['prev_text']);

        if ($prev_link || $next_link) {
            $navigation = _navigation_markup(
                $prev_link . $next_link,
                'pagination',
                $args['screen_reader_text']
            );
        }

        return $navigation;
    }
endif;
