<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageServerData } from './$types';
	import Form from './HuddleForm.svelte';

	export let data: PageServerData;
</script>

<main class="container max-w-lg h-full flex flex-col flex-1 gap-6">
	<h2 class="text-xl font-semibold">Create you own Huddle</h2>
	<Separator />
	<Form form={data.form} />
</main>
