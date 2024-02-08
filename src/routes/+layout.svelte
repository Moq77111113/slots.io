<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import '../app.css';
</script>

<div class="relative flex min-h-screen flex-col bg-background">
	<Header />
	<div class="flex-1">
		<slot />
	</div>
</div>
