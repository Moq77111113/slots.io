<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import '../app.css';
</script>

<Seo />
<div class="relative flex min-h-screen flex-col bg-background">
	<Header />
	<div class="contents flex-1">
		<slot />
	</div>
	<Footer />
</div>
