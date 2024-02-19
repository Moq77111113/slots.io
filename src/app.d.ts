// See https://kit.svelte.dev/docs/types#app

import type { AppContext } from '#/application/context';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			context: AppContext;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
