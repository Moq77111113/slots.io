import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$domain: 'src/lib/server/domain',
			$application: 'src/lib/server/application',
			$infrastructure: 'src/lib/server/infrastructure',
			'$domain/*': 'src/lib/server/domain/*',
			'$application/*': 'src/lib/server/application/*',
			'$infrastructure/*': 'src/lib/server/infrastructure/*',
			$brand: 'src/lib/server/domain/@shared/utils/brand.ts'
		}
	}
};

export default config;
