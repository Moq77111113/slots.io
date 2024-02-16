import {
	CircleUser,
	type Icon as Lucide,
	Loader2,
	PlusCircle,
	Projector,
	ShieldCheck,
	ShieldOff,
	ShieldQuestion,
	X
} from 'lucide-svelte';

import Github from './github.svelte';
import Google from './google.svelte';
import Hamburger from './hamburger.svelte';
import Logo from './logo.svelte';

export type Icon = Lucide;
export const Icons = {
	logo: Logo,
	hamburger: Hamburger,
	auth: CircleUser,
	spinner: Loader2,
	google: Google,
	github: Github,
	projector: Projector,
	add: PlusCircle,
	remove: X,
	availability: {
		available: ShieldCheck,
		unavailable: ShieldOff,
		maybe: ShieldQuestion
	}
};
