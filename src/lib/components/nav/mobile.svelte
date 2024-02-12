<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { site, nav } from '$lib/config';
	import { Icons } from '../icons';
	import MobileLink from '$lib/components/link/mobile.svelte';

	let open = false;
</script>

<div class="mr-6 flex items-center space-x-2 md:hidden">
	<Sheet.Root bind:open>
		<Sheet.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				class="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
			>
				<Icons.hamburger class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</Sheet.Trigger>
		<Icons.logo class="h-6 w-6" />
		<Sheet.Content side="left" class="pr-0">
			<MobileLink href="/" class="flex items-center" bind:open>
				<Icons.logo class="mr-2 h-6 w-6" />
				<span class="font-bold">{site.name}</span>
			</MobileLink>
			<div class="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 overflow-auto">
				<div class="flex flex-col space-y-3">
					{#each nav.links as navItem, index (navItem + index.toString())}
						{#if navItem.href}
							<MobileLink href={navItem.href} bind:open class="text-foreground">
								{navItem.name}
							</MobileLink>
						{/if}
					{/each}
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
