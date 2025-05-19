<?php
/**
 * Header template part
 * 
 * @package JUZAR
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" role="banner">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="site-branding">
            <?php
            if (has_custom_logo()) {
                the_custom_logo();
            } else {
                ?>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="text-2xl font-bold">
                    <?php bloginfo('name'); ?>
                </a>
                <?php
            }
            ?>
        </div>

        <!-- Mobile Menu Button -->
        <button class="md:hidden focus:outline-none" id="mobile-menu-button" aria-expanded="false" aria-controls="primary-menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            <span class="sr-only"><?php esc_html_e('Menu', 'juzar'); ?></span>
        </button>

        <!-- Desktop Navigation -->
        <nav class="hidden md:block" role="navigation" aria-label="<?php esc_attr_e('Primary Menu', 'juzar'); ?>">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class'     => 'flex space-x-8',
                'container'      => false,
            ));
            ?>
        </nav>
    </div>

    <!-- Mobile Navigation -->
    <div class="md:hidden hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class'     => 'flex flex-col space-y-2',
                'container'      => false,
            ));
            ?>
        </div>
    </div>
</header>

<main class="site-content" role="main">
