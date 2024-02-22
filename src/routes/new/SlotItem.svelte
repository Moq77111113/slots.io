<script lang="ts">
	import { Icons } from '$lib/components';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';

	import type { HuddleCreateSchema } from './schema';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	type Props = {
		form: SuperForm<HuddleCreateSchema>;
		index: number;
	};

	let form: Props['form'];
	let index: Props['index'];
	export { form, index };

	const { value: slot, errors } = formFieldProxy(form, `slots[${index}]`);

	const availabilities = [
		{
			value: 'available',
			icon: Icons.availability.available,
			class: 'hover:bg-green-600 data-[state=on]:bg-green-600 group'
		},
		{
			value: 'maybe',
			icon: Icons.availability.maybe,
			class: 'hover:bg-amber-600 data-[state=on]:bg-amber-600 group'
		},
		{
			value: 'unavailable',
			icon: Icons.availability.unavailable,
			class: 'hover:bg-red-600 data-[state=on]:bg-red-600 group'
		}
	] as const;
</script>

<div class="flex flex-row items-center space-x-2">
	<div class="flex justify-between items-center w-full">
		<div class="flex flex-col">
			{#if $errors}
				<p class="text-xs font-medium text-destructive">{$errors}</p>
			{/if}
		</div>
		<ToggleGroup type="single" bind:value={$slot.availability}>
			{#each availabilities as { value, class: clazz, icon } (value)}
				<ToggleGroupItem {value} aria-label={`toggle ${value}`} class={clazz}>
					<svelte:component
						this={icon}
						class="h-6 w-6 group-hover:text-white group-data-[state=on]:text-white"
					/>
				</ToggleGroupItem>
			{/each}
		</ToggleGroup>
	</div>
</div>
