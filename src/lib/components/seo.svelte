<script lang="ts">
	import { page } from '$app/stores';
	import { site } from '$lib/config/site';

	export let title: string = site.name;

	$: title = $page.data?.title ? `${$page.data.title} - ${site.name}` : site.name;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={site.description} />
	<meta name="keywords" content={site.keywords} />
	<meta name="author" content="moq" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={site.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content="" />
	<meta name="twitter:image:alt" content={site.name} />

	<meta property="og:title" content={title} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={site.url + $page.url.pathname} />
	<!-- <meta property="og:image" content="" /> -->
	<meta property="og:image:alt" content={site.name} />
	<!-- <meta property="og:image:width" content="" /> -->
	<!-- <meta property="og:image:height" content="" /> -->
	<meta property="og:description" content={site.description} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="FR_FR" />

	<!-- <link rel="shortcut icon" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" /> -->
</svelte:head>
