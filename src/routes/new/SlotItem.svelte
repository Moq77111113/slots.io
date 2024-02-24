<script lang="ts">
	import { Icons } from '$lib/components';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';

	import { format } from '$lib/helpers/date';
	import { type Infer, type SuperForm } from 'sveltekit-superforms';
	import type { HuddleCreateSchema } from './schema';

	type Props = {
		form: SuperForm<Infer<HuddleCreateSchema>>;
		index: number;
	};

	export let value: Infer<HuddleCreateSchema>['slots'][number];

	// export { form, index };

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

<div class="flex flex-col w-full">
	<div class="flex flex-row items-center justify-between w-full space-x-1">
		<span>{format(value.start, 'short-date')}</span>

		<ToggleGroup type="single" bind:value={value.availability}>
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
