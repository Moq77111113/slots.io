<script lang="ts">
	import { type HuddleCreateSchema } from './schema';

	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Button from '$lib/components/ui/button/button.svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Icons } from '$lib/components';

	import SlotItem from './SlotItem.svelte';
	import { today } from '@internationalized/date';

	interface Props {
		form: SuperValidated<HuddleCreateSchema>;
	}

	const { form: formData } = $props<Props>();
	const huddleForm = superForm(formData, {
		resetForm: false,
		dataType: 'json'
	});
	const { form, errors, constraints, enhance, message } = huddleForm;

	const _today = today('UTC').toDate('UTC');
	const addSlot = () => {
		form.update((_) => {
			if (!_.slots.length) {
				_.slots = [];
			}
			_.slots.push({ start: _today });
			return _;
		});
	};

	const removeSlot = (idx: number) => {
		form.update((_) => ({
			..._,
			slots: _.slots.filter((_slot, i) => i !== idx)
		}));
	};
</script>

<form method="post" use:enhance class="space-y-4">
	<div class="space-y-2">
		<Label>Huddle Name</Label>
		<Input
			name="title"
			placeholder="Birthday party"
			aria-invalid={$errors.title ? 'true' : undefined}
			bind:value={$form.title}
		/>
		<p class="text-xs text-muted-foreground">The name of the huddle or meeting.</p>
		{#if $errors.title}
			<p class="text-xs font-medium text-destructive">{$errors.title}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label>Description</Label>
		<Textarea
			name="description"
			rows={2}
			placeholder="Hello guys, let's meet up for a birthday party !"
			aria-invalid={$errors.description ? 'true' : undefined}
			bind:value={$form.description}
			{...$constraints.description}
		/>
		{#if $errors.description}
			<p class="text-xs font-medium text-destructive">{$errors.title}</p>
		{/if}
	</div>

	<div class="flex items-center gap-y-2">
		<Label>Time Slots</Label>

		<Button variant="ghost" size="icon" on:click={addSlot}><Icons.add /></Button>
	</div>

	<div class="space-y-2 flex flex-col">
		{#each $form.slots as _, i (i)}
			<div class="flex flex-row items-center space-x-2">
				<Button size="icon-sm" variant="ghost" on:click={() => removeSlot(i)}
					><Icons.remove class="h-2 w-2" /></Button
				>
				<SlotItem form={huddleForm} index={i} />
			</div>
		{/each}
	</div>

	{#if $message}
		<p class="text-destructive">{JSON.stringify($message)}</p>{/if}
	<Button type="submit">Submit</Button>
</form>
<SuperDebug data={$form} />
