<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import { Icons } from './icons';
	interface Props {
		disabled?: boolean;
		value?: 'available' | 'maybe' | 'unavailable';
	}
	let { disabled = false, value } = $props<Props>();
</script>

<ToggleGroup.Root type="single" bind:disabled bind:value>
	<ToggleGroup.Item
		variant="outline"
		value="available"
		aria-label="Toggle Available"
		class="hover:bg-green-600 group data-[state=on]:bg-green-600"
	>
		<Icons.availability.available class="h-6 w-6 group-hover:text-white" />
	</ToggleGroup.Item>
	<ToggleGroup.Item
		value="maybe"
		aria-label="Toggle Maybe"
		class="hover:bg-amber-600 group data-[state=on]:bg-amber-600"
	>
		<Icons.availability.maybe class="h-6 w-6 group-hover:text-white" />
	</ToggleGroup.Item>
	<ToggleGroup.Item
		value="unavailable"
		aria-label="Toggle Unavailable"
		class="hover:bg-red-600 group data-[state=on]:bg-red-600"
	>
		<Icons.availability.unavailable class="h-6 w-6 group-hover:text-white" />
	</ToggleGroup.Item>
</ToggleGroup.Root>

{value}
