<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { z } from 'zod';

	import { huddleCreateSchema, type HuddleCreateSchema, slotAddSchema } from './schema';

	import type { SuperValidated } from 'sveltekit-superforms';
	import SlotForm from './SlotForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Icons } from '$lib/components';
	import Label from '$lib/components/ui/label/label.svelte';
	interface Props {
		form: SuperValidated<HuddleCreateSchema>;
		form2: SuperValidated<typeof slotAddSchema>;
	}

	let slots = $state<Partial<z.infer<typeof slotAddSchema>>[]>([]);

	const removeSlot = (index: number) => {
		console.log('test');
		slots = slots.filter((_, i) => i !== index);
	};
	const { form } = $props<Props>();
</script>

<Form.Root method="POST" {form} schema={huddleCreateSchema} let:config class="space-y-4 " debug>
	<Form.Field {config} name="title">
		<Form.Item>
			<Form.Label>Huddle Name</Form.Label>
			<Form.Input placeholder="Birthday party" />
			<Form.Description>The name of the huddle or meeting.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Description</Form.Label>
			<Form.Textarea rows={2} placeholder="Hello guys, let's meet up for a birthday party !" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<div class="flex items-center gap-2">
		<Label>Time Slots</Label>

		<Button variant="ghost" size="icon" on:click={() => slots.push({})}><Icons.add /></Button>
	</div>
	<div class="space-y-2 flex flex-col">
		{#each slots as slot, i (i)}
			<div class="flex flex-row items-center space-x-2">
				<Button size="icon-sm" variant="ghost" on:click={() => removeSlot(i)}
					><Icons.remove class="h-2 w-2" /></Button
				>
				<SlotForm bind:data={slot} />
			</div>
		{/each}
	</div>
	<Form.Button>Let's go</Form.Button>
</Form.Root>
