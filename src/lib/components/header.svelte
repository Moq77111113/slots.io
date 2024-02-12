<script lang="ts">
	import { MobileNav, WebNav } from '$lib/components';

	import ThemeSwitcher from './ThemeSwitcher.svelte';
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
			</nav>
		</div>
	</div>
</header>
