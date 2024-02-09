<script lang="ts">
	import { Icons, MobileNav, WebNav } from '$lib/components';
	import { routing } from '$lib/config';

	import { cn } from '$lib/utils';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { buttonVariants } from './ui/button';
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 max-w-screen-2xl items-center">
		<WebNav />
		<MobileNav />
		<div class="flex flex-1 items-center space-x-2 justify-end">
			<nav class="flex items-center">
				<ThemeSwitcher />
				<a href={routing.auth.signIn} target="_blank" rel="noreferrer">
					<div
						class={cn(
							buttonVariants({
								size: 'sm',
								variant: 'ghost'
							}),
							'w-9 px-0'
						)}
					>
						<Icons.auth class="h-5 w-5 fill-none" />
						<span class="sr-only">Log-in</span>
					</div>
				</a>
			</nav>
		</div>
	</div>
</header>
