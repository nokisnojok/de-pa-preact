import { options, Fragment, Component } from '@de-pa/preact';

export function initDevTools() {
	if (typeof window != 'undefined' && window.__PREACT_DEVTOOLS__) {
		window.__PREACT_DEVTOOLS__.attachPreact('10.5.13', options, {
			Fragment,
			Component
		});
	}
}
