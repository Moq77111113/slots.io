import { CircleUser, type Icon as Lucide } from 'lucide-svelte';

import Hamburger from './hamburger.svelte';
import Logo from './logo.svelte';
export type Icon = Lucide;
export const Icons = {
	logo: Logo,
	hamburger: Hamburger,
	auth: CircleUser
};
