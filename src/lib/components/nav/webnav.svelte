<script lang="ts">
	import { page } from '$app/stores';
	import { site } from '$lib/config/site';
	import { cn } from '$lib/utils';
	import { Icons } from '../icons';
</script>

<div class="mr-4 hidden md:flex">
	<a href="/" class="mr-6 flex items-center space-x-2">
		<Icons.logo class="h-6 w-6" />
		<span class="hidden font-bold sm:inline-block">
			{site.name}
		</span>
	</a>
	<nav class="flex items-center gap-6 text-sm"></nav>
</div>
