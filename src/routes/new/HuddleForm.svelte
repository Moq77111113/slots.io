<script lang="ts">
	import { Icons } from '$lib/components';
	import Button from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getTimestamp } from '$lib/helpers/date';
	import { getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { blur } from 'svelte/transition';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SlotItem from './SlotItem.svelte';
	import { huddleCreateSchema, type HuddleCreateSchema } from './schema';
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

	let tz = getLocalTimeZone();
	let selected: DateValue[] = [];

	const onValueChange = (calDates: DateValue[] | undefined) => {
		if (!calDates) {
			formData.set({
				...$formData,
				slots: []
			});

			return;
		}

		const added = calDates.filter(
			(calDate) =>
				!$formData.slots
					.map((_) => getTimestamp(_.start))
					.includes(getTimestamp(calDate.toDate(tz)))
		);

		const removed = $formData.slots.filter(
			(slot) =>
				!calDates
					.map((calDate) => getTimestamp(calDate.toDate(tz)))
					.includes(getTimestamp(slot.start))
		);

		if (added.length) {
			formData.update(($form) => {
				$form.slots.push(
					...added.map((date) => ({
						start: date.toDate(tz)
					}))
				);
				return $form;
			});
		}

		if (removed.length) {
			formData.update(($form) => {
				$form.slots = $form.slots.filter(
					(_) => !removed.map((slot) => getTimestamp(slot.start)).includes(getTimestamp(_.start))
				);
				return $form;
			});
		}
	};
</script>

<form method="post" use:enhance class="space-y-4">
	<Form.Field form={huddleForm} name="title">
		<Form.Control let:attrs>
			<Form.Label>Huddle Name</Form.Label>
			<Input {...attrs} bind:value={$formData.title} placeholder="Birthday Party" />
		</Form.Control>

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

	<div class="grid grid-cols-2 md:grid-cols-3 space-x-2 space-y-2 md:h-80">
		<Calendar
			class="col-span-2"
			variant="full"
			multiple={true}
			bind:value={selected}
			{onValueChange}
		/>
		<Form.Fieldset
			form={huddleForm}
			name={`slots`}
			class="col-span-2 md:col-span-1 flex flex-col space-y-2 max-h-80 overflow-auto w-full"
		>
			{#each $formData.slots as _, i}
				<div transition:blur class="w-full">
					<Form.ElementField form={huddleForm} name={`slots[${i}].start`}>
						<Form.Control>
							<input type="hidden" value={_.start} />
						</Form.Control>

						<Form.FieldErrors />
					</Form.ElementField>

					<Form.ElementField
						form={huddleForm}
						name={`slots[${i}].availability`}
						class="flex justify-between"
					>
						<Form.Control>
							<SlotItem bind:value={_} />
						</Form.Control>

						<Form.FieldErrors />
					</Form.ElementField>
				</div>
			{/each}
		</Form.Fieldset>
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
