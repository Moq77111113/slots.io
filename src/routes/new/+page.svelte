<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import HuddleForm from './HuddleForm.svelte';
	export let data: PageData;
</script>

<main class="container max-w-4xl h-full flex flex-col flex-1 space-y-6 py-4">
	<h2 class="text-xl font-semibold">Create your own Huddle</h2>
	<Separator />

	<HuddleForm form={data.form} />
</main>
