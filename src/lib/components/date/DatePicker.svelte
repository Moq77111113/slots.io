<script lang="ts">
	import { Calendar as CalendarIcon } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		CalendarDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Calendar, type CalendarProps } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	interface Props {
		value: Date | undefined;
		class?: string;
	}

	const fromDate = (_date: Date): DateValue =>
		new CalendarDate(_date.getFullYear(), _date.getMonth() + 1, _date.getDate());

	let { value, class: clazz, ...rest } = $props<Props & CalendarProps>();

	let internal: DateValue | undefined = $state<DateValue | undefined>(
		value ? fromDate(value) : undefined
	);
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				' justify-start text-left font-normal ',
				!internal && 'text-muted-foreground',
				clazz
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{internal ? df.format(internal.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class=" p-0">
		<Calendar
			bind:value={internal}
			initialFocus
			onValueChange={(v) => {
				if (v) {
					value = v.toDate(getLocalTimeZone());
				}
			}}
			{...rest}
		/>
	</Popover.Content>
</Popover.Root>
