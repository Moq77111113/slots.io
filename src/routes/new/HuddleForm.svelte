<script lang="ts">
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { huddleCreateSchema, type HuddleCreateSchema } from './schema';

	import { Icons } from '$lib/components';
	import Button from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { timeStamp } from '$lib/helpers/date';
	import { type DateValue } from '@internationalized/date';
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
	let selected: DateValue[] = [];
	const addSlot = () => {
		formData.update(($form) => {
			$form.slots.push({ start: new Date() });
			return $form;
		});
	};

	const clearSlots = () => {
		formData.update(($form) => {
			$form.slots = [];
			return $form;
		});
		selected = [];
	};

	$: {
		if (!selected) {
			clearSlots();
		} else {
			const added = selected.filter(
				(_) => !$formData.slots.map((_) => _.start.getTime()).includes(timeStamp(_))
			);
			const removed = $formData.slots.filter(
				(_) => !selected.map(timeStamp).includes(timeStamp(_.start))
			);

			if (added.length > 0) {
				// A DateValue was added
				formData.update(($form) => {
					$form.slots.push(...added.map((_) => ({ start: _.toDate('UTC') })));
					return $form;
				});
			}

			if (removed.length > 0) {
				// A DateValue was removed
				formData.update(($form) => {
					removed.forEach((_) => {
						const index = $form.slots.findIndex((s) => timeStamp(s.start) === timeStamp(_.start));
						$form.slots.splice(index, 1);
					});
					return $form;
				});
			}
		}
	}
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
		<Calendar class="col-span-2" variant="full" multiple={true} bind:value={selected} />

		<div class="flex flex-col">
			{#each ($formData.slots || [])
				.slice()
				.sort((a, b) => a.start.getTime() - b.start.getTime()) as slot}
				<div transition:blur class="flex justify-between">
					<span>{slot.start.toString()}</span>
				</div>
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
