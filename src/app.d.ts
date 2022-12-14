// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user?: {
			uid: string,
			userName: string,
			cookie_consent_level: any
		}
	}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface Session {
		user?: {
			uid: string,
			userName: string,
			cookie_consent_level: any
		}
	}
	// interface Stuff {}
}
