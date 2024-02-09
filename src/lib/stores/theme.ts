import { writable } from 'svelte/store';

const noopStorage = {
	getItem: (_key: string) => null,

	setItem: (_key: string, _value: string) => {}
};
const isBrowser = typeof document !== 'undefined';

export const createLocalStorageTheme = (key = 'theme') => {
	const defaultValue = 'system' as const;

	const storage = isBrowser ? localStorage : noopStorage;
	const initialValue = storage.getItem(key);

	let value = isValidMode(initialValue) ? initialValue : defaultValue;

	const themeStore = writable(value, () => {
		if (!isBrowser) return;

		const handler = (e: StorageEvent) => {
			if (e.key !== key) return;
			const newValue = e.newValue;
			if (isValidMode(newValue)) {
				set((value = newValue));
			} else {
				set((value = defaultValue));
			}
		};
		addEventListener('storage', handler);
		return () => {
			removeEventListener('storage', handler);
		};
	});
	const { subscribe, set } = themeStore;

	const unsubscribe = subscribe((value) => {
		if (!isBrowser) return;
		const html = window.document.documentElement;
		html.classList.remove('dark', 'light');
		html.classList.add(value);
		storage.setItem(key, value);
	});

	const toggle = () => {
		set((value = value === 'dark' ? 'light' : 'dark'));
	};
	return {
		...themeStore,
		unsubscribe,
		toggle
	};
};

const isValidMode = (mode: unknown): mode is 'dark' | 'light' => {
	return mode === 'dark' || mode === 'light';
};
