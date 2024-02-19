<script lang="ts">
	import { page } from '$app/stores';
	import { Icons } from '$lib/components';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let animate = $state(true);

	let notFound = $derived($page.status === 404);
</script>

<main class="h-full flex flex-col flex-1 justify-center items-center space-y-6">
	{#if $page}
		<div class="w-full h-full flex justify-center items-center">
			<div class="text-center space-y-4">
				{#if notFound}<Icons.ghost
						class={cn(`motion-reduce:animate-none`, animate && 'animate-ghost')}
					/>
				{/if}
				<h2 class="text-xl">
					{$page.status}
					{#if $page.error}
						{$page.error.message}
					{/if}
				</h2>

				<p class="text-lg">We're sorry, something went wrong.</p>
			</div>
		</div>
		{#if notFound}<Button
				variant="outline"
				size="sm"
				aria-label="Toggle Animation"
				class="cursor-pointer z-10"
				on:click={() => (animate = !animate)}
			>
				{#if animate}
					<Icons.pause class="h-4 w-4" />
				{:else}
					<Icons.play class="h-4 w-4" />
				{/if}
			</Button>
		{/if}
	{/if}
</main>
