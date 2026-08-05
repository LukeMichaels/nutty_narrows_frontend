<?php
/**
 * Nutty Narrows theme functions.
 *
 * This theme only renders the wp-admin editor preview — everything else is
 * handled by the headless frontend.
 */

if ( ! function_exists( 'nutty_narrows_support' ) ) :

	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * @return void
	 */
	function nutty_narrows_support() {
		add_editor_style( array( 'style.css', 'assets/css/global.css' ) );
		load_theme_textdomain( 'nutty-narrows' );
	}

endif;

add_action( 'after_setup_theme', 'nutty_narrows_support' );

if ( ! function_exists( 'nutty_narrows_enqueue_styles' ) ) :

	/**
	 * Enqueue theme stylesheets.
	 *
	 * @return void
	 */
	function nutty_narrows_enqueue_styles() {
		$theme_version = wp_get_theme()->get( 'Version' );

		wp_enqueue_style(
			'nutty-narrows-style',
			get_template_directory_uri() . '/style.css',
			array(),
			$theme_version
		);

		wp_enqueue_style(
			'nutty-narrows-global',
			get_theme_file_uri( '/assets/css/global.css' ),
			array( 'nutty-narrows-style' ),
			$theme_version
		);
	}

endif;

add_action( 'wp_enqueue_scripts', 'nutty_narrows_enqueue_styles' );
