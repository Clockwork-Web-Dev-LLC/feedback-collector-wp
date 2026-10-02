/**
 * Branding tab: pick a logo from the Media Library and keep the preview in step
 * with the logo field (empty = the header label shows as text).
 */
( function () {
	var input = document.getElementById( 'fbc-b-logo_url' );
	var preview = document.getElementById( 'fbc-b-logo-preview' );
	var pick = document.getElementById( 'fbc-b-logo-pick' );
	if ( ! input || ! preview ) {
		return;
	}

	function refresh() {
		var node;
		if ( input.value ) {
			node = document.createElement( 'img' );
			node.src = input.value;
			node.alt = '';
		} else {
			node = document.createElement( 'em' );
			node.textContent = preview.dataset.none || '';
		}
		preview.replaceChildren( node );
	}
	input.addEventListener( 'change', refresh );

	if ( ! pick || ! window.wp || ! window.wp.media ) {
		if ( pick ) {
			pick.style.display = 'none';
		}
		return;
	}
	var frame;
	pick.addEventListener( 'click', function () {
		frame = frame || window.wp.media( { title: pick.textContent, library: { type: 'image' }, multiple: false } );
		frame.off( 'select' ).on( 'select', function () {
			input.value = frame.state().get( 'selection' ).first().get( 'url' );
			refresh();
		} );
		frame.open();
	} );
} )();
