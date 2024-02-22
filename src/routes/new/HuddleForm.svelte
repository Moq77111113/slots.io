<script lang="ts">
	import { type HuddleCreateSchema } from './schema';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Button from '$lib/components/ui/button/button.svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import { Input } from '$lib/components/ui/input';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Icons } from '$lib/components';
	import { today, type DateValue } from '@internationalized/date';

	interface Props {
		form: SuperValidated<HuddleCreateSchema>;
	}

	let formData: Props['form'];

	export { formData as form };

	const huddleForm = superForm(formData, {
		resetForm: false,
		dataType: 'json'
	});
	const { form, errors, constraints, enhance, message, submitting } = huddleForm;

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
	let value: DateValue[] = [];
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

	{#if $message}
		<p class="text-destructive">{JSON.stringify($message)}</p>{/if}

	{#if $submitting}
		<Button disabled size="icon">
			<Icons.wave />
		</Button>{:else}
		<Button type="submit">Submit</Button>
	{/if}
</form>
<SuperDebug data={$form} />
