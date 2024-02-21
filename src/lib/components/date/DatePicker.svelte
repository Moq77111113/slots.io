<script lang="ts" generics="T extends boolean">
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { Icons } from '../icons';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	interface Props {
		class?: string;
		value: DateValue | undefined;
	}

	let { class: clazz, value } = $props<Props>();
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(' justify-start text-left font-normal ', !value && 'text-muted-foreground', clazz)}
			builders={[builder]}
		>
			<Icons.calendar class="mr-2 h-4 w-4" />
			Pick a date
		</Button>
	</Popover.Trigger>
	<Popover.Content class="p-0" side="top">
		<Calendar bind:value />
	</Popover.Content>
</Popover.Root>
