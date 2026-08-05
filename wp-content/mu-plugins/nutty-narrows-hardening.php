<?php
/**
 * Plugin Name: Nutty Narrows - Hardening
 * Description: Baseline WordPress hardening for a headless backend — this
 * install's only legitimate traffic is WPGraphQL, the custom contact REST
 * route, and wp-admin, so anything else default WordPress exposes (XML-RPC,
 * REST user enumeration, the theme/plugin file editor, version disclosure)
 * is attack surface with no upside here and is switched off.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// The in-admin theme/plugin file editor is a straight path to remote code
// execution for anyone who gets into wp-admin (e.g. a guessed/leaked
// password) — edit a PHP file, it runs on the next request. Editing
// happens through this repo + deploys instead, so there's no legitimate
// use for it here.
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
	define( 'DISALLOW_FILE_EDIT', true );
}

// XML-RPC isn't used by this site (WPGraphQL is the API surface) and is a
// common target for credential-stuffing (system.multicall lets an
// attacker try hundreds of password guesses in a single request) and
// pingback-based SSRF/amplification.
add_filter( 'xmlrpc_enabled', '__return_false' );

// Don't advertise the exact WordPress version in the (redirected-away)
// front end's <head>, RSS feeds, or asset query strings — makes it
// marginally harder to target this install with a version-specific
// known exploit.
remove_action( 'wp_head', 'wp_generator' );
add_filter( 'the_generator', '__return_empty_string' );
add_filter(
	'style_loader_src',
	function ( $src ) {
		return remove_query_arg( 'ver', $src );
	}
);
add_filter(
	'script_loader_src',
	function ( $src ) {
		return remove_query_arg( 'ver', $src );
	}
);

// The core REST API's /wp/v2/users route lists every author's username by
// default — handing an attacker a ready-made list of valid logins to
// brute-force against wp-admin. Blocks it for unauthenticated requests
// only; logged-in requests (the block editor, etc.) are unaffected.
// WPGraphQL uses its own /graphql endpoint, not this REST namespace, so
// this doesn't touch the frontend's data fetching.
add_filter(
	'rest_authentication_errors',
	function ( $result ) {
		if ( ! empty( $result ) ) {
			return $result;
		}

		if ( is_user_logged_in() ) {
			return $result;
		}

		$route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';

		if ( is_string( $route ) && str_starts_with( $route, '/wp/v2/users' ) ) {
			return new WP_Error(
				'rest_user_cannot_view',
				__( 'Sorry, you are not allowed to list users.', 'nutty-narrows' ),
				array( 'status' => 401 )
			);
		}

		return $result;
	}
);

// A generic wp-login.php error (instead of WordPress's default "Invalid
// username" / "The password you entered is incorrect" split) stops that
// page from being usable to check whether a given username exists at all.
add_filter( 'login_errors', function () {
	return __( 'Incorrect username or password.', 'nutty-narrows' );
} );
