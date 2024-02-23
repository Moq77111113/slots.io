<script lang="ts">
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { huddleCreateSchema, type HuddleCreateSchema } from './schema';

	import { Icons } from '$lib/components';
	import Button from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { today, type DateValue } from '@internationalized/date';
	import { blur } from 'svelte/transition';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface Props {
		form: SuperValidated<Infer<HuddleCreateSchema>>;
	}

	let data: Props['form'];

	export { data as form };

	const huddleForm = superForm(data, {
		validators: zodClient(huddleCreateSchema),
		resetForm: false,
		dataType: 'json'
	});

	const { form: formData, enhance, submitting } = huddleForm;
	const _today = today('UTC').toDate('UTC');

	let value: DateValue[] = [];
</script>

<form method="post" use:enhance class="space-y-4">
	<Form.Field form={huddleForm} name="title">
		<Form.Control let:attrs>
			<Form.Label>Huddle Name</Form.Label>
			<Input {...attrs} bind:value={$formData.title} placeholder="Birthday Party" />
		</Form.Control>
		<Form.Description>This is your public display name.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field form={huddleForm} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Textarea
				{...attrs}
				placeholder="Hello guys, let's meet up for a birthday party !"
				class="resize-none"
				bind:value={$formData.description}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>

	<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
		<Calendar class="col-span-2" variant="full" multiple={true} bind:value />
		<div class="flex flex-col">
			{#each (value || [])
				.slice()
				.sort((a, b) => a.toDate('UTC').getTime() - b.toDate('UTC').getTime()) as date}
				<p transition:blur>
					{date.toString()}
				</p>
			{/each}
		</div>
	</div>

	{#if $submitting}
		<Button disabled size="icon">
			<Icons.wave />
		</Button>
	{:else}
		<Button type="submit">Submit</Button>
	{/if}
</form>

<SuperDebug data={$formData} />
