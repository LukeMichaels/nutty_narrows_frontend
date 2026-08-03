<?php
/**
 * Plugin Name: Nutty Narrows - Contact API
 * Description: A single REST endpoint the headless frontend's contact form
 * posts to. No accounts, tokens, or orders here — just email delivery.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NN_CONTACT_API_NAMESPACE', 'nutty-narrows/v1' );

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			NN_CONTACT_API_NAMESPACE,
			'/contact',
			array(
				'methods'             => 'POST',
				'callback'            => 'nn_submit_contact_form',
				'permission_callback' => '__return_true',
			)
		);
	}
);

/**
 * Handles the contact form POST and sends it on via wp_mail().
 *
 * @param WP_REST_Request $request The incoming request.
 *
 * @return WP_REST_Response|WP_Error
 */
function nn_submit_contact_form( WP_REST_Request $request ) {
	// Honeypot: real visitors never fill this in, so any value here means bot.
	if ( ! empty( $request->get_param( 'website' ) ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	$name    = sanitize_text_field( (string) $request->get_param( 'name' ) );
	$email   = sanitize_email( (string) $request->get_param( 'email' ) );
	$subject = sanitize_text_field( (string) $request->get_param( 'subject' ) );
	$message = sanitize_textarea_field( (string) $request->get_param( 'message' ) );

	if ( '' === $name || '' === $email || ! is_email( $email ) || '' === $message ) {
		return new WP_Error(
			'nn_contact_invalid',
			__( 'Please provide your name, a valid email, and a message.', 'nutty-narrows' ),
			array( 'status' => 400 )
		);
	}

	$to      = defined( 'NN_CONTACT_EMAIL' ) ? NN_CONTACT_EMAIL : get_option( 'admin_email' );
	$subject_line = sprintf(
		'[Nutty Narrows Contact Form] %s',
		'' !== $subject ? $subject : __( 'New message', 'nutty-narrows' )
	);
	$body = sprintf(
		"Name: %s\nEmail: %s\nSubject: %s\n\n%s",
		$name,
		$email,
		'' !== $subject ? $subject : '(none)',
		$message
	);
	$headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );

	$sent = wp_mail( $to, $subject_line, $body, $headers );

	if ( ! $sent ) {
		return new WP_Error(
			'nn_contact_send_failed',
			__( 'Sorry, something went wrong sending your message. Please try again.', 'nutty-narrows' ),
			array( 'status' => 500 )
		);
	}

	return new WP_REST_Response( array( 'ok' => true ), 200 );
}
