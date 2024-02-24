<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';

	type Props = { icon: ComponentType; heading: string; content: string; iconClass?: string };

	let icon: Props['icon'];
	let heading: Props['heading'];
	let content: Props['content'];
	let iconClass: Props['iconClass'] = '';

	export { icon, heading, content, iconClass };
	// TODO: Migrate to snippet when svelte 5 is released
</script>

<div class="flex space-x-2 items-center">
	<div
		class={cn(
			'h-10 w-10 border border-input bg-medium-gray/80 dark:bg-light-gray/20 text-white dark:text-primary flex items-center justify-center rounded-md',
			iconClass
		)}
	>
		<svelte:component this={icon} class={'h-4 w-4'} />
	</div>
	<div class="flex flex-col">
		<h3 class="text-sm font-semibold">{heading}</h3>
		<span class="text-sm text-medium-gray dark:text-light-gray">{content}</span>
	</div>
</div>
