import { readable } from 'svelte/store';

export const mediaQuery = (mediaQueryString: string) => {
	const matches = readable<boolean>(false, (set) => {
		if (typeof window === 'undefined') return;

		const media = window.matchMedia(mediaQueryString);

		set(media.matches);

		const handler = (e: MediaQueryListEvent) => {
			set(e.matches);
		};

		media.addEventListener('change', handler);

		return () => {
			media.removeEventListener('change', handler);
		};
	});

	return matches;
};
