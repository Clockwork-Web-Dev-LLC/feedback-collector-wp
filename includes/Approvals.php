<?php
/**
 * Client approval: a reviewer ticks "Approved" on an item to say "yes, make this change".
 *
 * Separate from status (which tracks the team's progress): approval is the client's sign-off,
 * so a client lead can work through everyone's feedback and approve what should be done.
 * The checkbox's name is configurable (Feedback → Settings), e.g. "PIVI approved".
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Approval flag on items.
 */
final class Approvals {

	public const OPT_LABEL = 'fbcol_approval_label';
	public const LABEL_MAX = 40;

	/**
	 * The checkbox's name, e.g. "PIVI approved" (default "Approved").
	 */
	public static function label(): string {
		$label = trim( (string) get_option( self::OPT_LABEL, '' ) );
		return '' !== $label ? $label : __( 'Approved', 'feedback-collector' );
	}

	/**
	 * Saves the checkbox's name ('' restores the default).
	 *
	 * @param string $label Name.
	 */
	public static function set_label( string $label ): void {
		$label = mb_substr( trim( sanitize_text_field( $label ) ), 0, self::LABEL_MAX );
		if ( '' === $label ) {
			delete_option( self::OPT_LABEL );
			return;
		}
		update_option( self::OPT_LABEL, $label, false );
	}

	/**
	 * Whether an item is approved.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function is_approved( array $item ): bool {
		return ! empty( $item['approved_at'] ) && '0000-00-00 00:00:00' !== $item['approved_at'];
	}

	/**
	 * Who approved an item ('' when not approved or the user is gone).
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function approver_name( array $item ): string {
		if ( ! self::is_approved( $item ) ) {
			return '';
		}
		$user = get_userdata( (int) ( $item['approved_by'] ?? 0 ) );
		return $user ? $user->display_name : '';
	}

	/**
	 * Approves or un-approves an item as the current user, and notes it in the thread.
	 * Doing what's already done changes nothing (and logs nothing).
	 *
	 * @param int  $id Item ID.
	 * @param bool $on Approve.
	 * @return bool Whether the item exists.
	 */
	public static function set( int $id, bool $on ): bool {
		$item = Items::get( $id );
		if ( ! $item ) {
			return false;
		}
		if ( self::is_approved( $item ) === $on ) {
			return true;
		}
		Items::update(
			$id,
			$on
				? array(
					'approved_at' => current_time( 'mysql', true ),
					'approved_by' => get_current_user_id(),
				)
				: array(
					'approved_at' => null,
					'approved_by' => 0,
				)
		);
		Items::add_comment(
			$id,
			$on
				/* translators: %s: approval name, e.g. "PIVI approved" */
				? sprintf( __( 'marked this “%s”', 'feedback-collector' ), self::label() )
				/* translators: %s: approval name, e.g. "PIVI approved" */
				: sprintf( __( 'removed “%s”', 'feedback-collector' ), self::label() ),
			'activity'
		);
		return true;
	}
}
