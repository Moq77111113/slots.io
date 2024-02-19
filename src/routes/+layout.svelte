<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import '../app.css';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Seo />

<div class="relative flex min-h-screen flex-col bg-background">
	<Header />
	{#if data.me}<span>Hello {data.me.email}</span>
	{/if}
	<div class="contents flex-1">
		<slot />
	</div>
	<Footer />
</div>
