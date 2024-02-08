<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import Seo from '$lib/components/seo.svelte';
	import '../app.css';
</script>

<Seo />
<div class="relative flex min-h-screen flex-col bg-background">
	<Header />
	<div class="flex-1">
		<slot />
	</div>
	<Footer />
</div>
