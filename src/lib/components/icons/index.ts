import {
	CalendarDays,
	CircleUser,
	Clock,
	type Icon as Lucide,
	Loader2,
	LogOut,
	MapPin,
	Pause,
	Play,
	PlusCircle,
	Projector,
	ShieldCheck,
	ShieldOff,
	ShieldQuestion,
	ArrowLeft,
	ArrowRight,
	MoreHorizontal,
	X
} from 'lucide-svelte';

import Ghost from './ghost.svelte';
import Github from './github.svelte';
import Google from './google.svelte';
import Hamburger from './hamburger.svelte';
import Logo from './logo.svelte';
import WavyDots from './WavyDots.svelte';

export type Icon = Lucide;
export const Icons = {
	prev: ArrowLeft,
	next: ArrowRight,
	logo: Logo,
	hamburger: Hamburger,
	auth: CircleUser,
	spinner: Loader2,
	google: Google,
	github: Github,
	projector: Projector,
	add: PlusCircle,
	remove: X,
	logout: LogOut,
	mapPin: MapPin,
	clock: Clock,
	availability: {
		available: ShieldCheck,
		unavailable: ShieldOff,
		maybe: ShieldQuestion
	},
	calendar: CalendarDays,
	ghost: Ghost,
	pause: Pause,
	play: Play,
	dotX: MoreHorizontal,
	wave: WavyDots
};
