<script lang="ts">
	import { Icons } from '$lib/components';

	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';

	interface Props {
		data: {
			start?: Date;
			availability?: 'available' | 'maybe' | 'unavailable';
		};
		disabled?: boolean;
	}
	let { disabled = false, data } = $props<Props>();

	const items = [
		{
			value: 'available',
			ariaLabel: 'Toggle Available',
			icon: Icons.availability.available,
			class: 'hover:bg-green-600 data-[state=on]:bg-green-600 group'
		},
		{
			value: 'maybe',
			ariaLabel: 'Toggle Maybe',
			icon: Icons.availability.maybe,
			class: 'hover:bg-amber-600 data-[state=on]:bg-amber-600 group'
		},
		{
			value: 'unavailable',
			ariaLabel: 'Toggle Unavailable',
			icon: Icons.availability.unavailable,
			class: 'hover:bg-red-600 data-[state=on]:bg-red-600 group'
		}
	] as const;
</script>

<div class="flex justify-between items-center w-full">
	<Input class="w-auto" type="date" bind:value={data.start} />
	<ToggleGroup type="single" bind:disabled bind:value={data.availability}>
		{#each items as { value, ariaLabel, class: clazz, icon } (value)}
			<ToggleGroupItem {value} aria-label={ariaLabel} class={clazz}>
				<svelte:component
					this={icon}
					class="h-6 w-6 group-hover:text-white group-data-[state=on]:text-white"
				/>
			</ToggleGroupItem>
		{/each}
	</ToggleGroup>
</div>
