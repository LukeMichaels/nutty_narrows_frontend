<?php
/**
 * This WordPress install only needs to serve two kinds of traffic: WPGraphQL
 * (data for the Next.js frontend) and REST/AJAX/webhook traffic. Everything
 * else — pages, archives, the homepage, etc. — is rendered by the Next.js
 * frontend instead, so any front-end template render gets redirected there.
 * This keeps casual visitors and well-behaved crawlers off the backend
 * domain.
 *
 * Deliberately does nothing for API/admin/cron/ajax requests: those are
 * either handled by WordPress core before template_redirect ever fires
 * (REST, GraphQL, wp-cron, admin-ajax) or served directly by the web server
 * without touching PHP at all (static assets under wp-content/wp-includes),
 * so this hook never sees them regardless.
 */

add_action( 'template_redirect', function () {
	if (
		( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| ( defined( 'GRAPHQL_HTTP_REQUEST' ) && GRAPHQL_HTTP_REQUEST )
		|| is_admin()
		|| wp_doing_ajax()
		|| wp_doing_cron()
	) {
		return;
	}

	// wp_safe_redirect() validates the target host against WordPress's
	// allowed-redirect-hosts list and silently falls back to admin_url() if
	// it doesn't recognize it — which it never will here, since the
	// frontend lives on a different domain (or localhost:3000 locally).
	// wp_redirect() skips that check, which is fine since the target host
	// is a hardcoded trusted constant; only the path comes from the
	// request, and it's forwarded as-is to our own frontend, not used to
	// pick the host.
	//
	// Override NN_FRONTEND_URL in wp-config.php per environment, e.g.
	// define( 'NN_FRONTEND_URL', 'https://nutty-narrows.vercel.app' );
	$frontend_url = defined( 'NN_FRONTEND_URL' ) ? NN_FRONTEND_URL : 'http://localhost:3000';
	$request_path = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '/';
	wp_redirect( rtrim( $frontend_url, '/' ) . $request_path, 301 );
	exit;
} );
