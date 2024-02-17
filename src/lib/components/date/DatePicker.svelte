<script lang="ts">
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
	import { Icons } from '../icons';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	interface Props {
		value: Date | undefined;
		class?: string;
		minValue?: Date;
		maxValue?: Date;
	}

	const fromDate = (_date: Date): DateValue =>
		new CalendarDate(_date.getFullYear(), _date.getMonth() + 1, _date.getDate());

	let {
		value,
		class: clazz,
		minValue,
		maxValue,
		...rest
	} = $props<Props & Omit<CalendarProps, 'minValue' | 'maxValue'>>();

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
			<Icons.calendar class="mr-2 h-4 w-4" />
			{internal ? df.format(internal.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="p-0" side="top">
		<Calendar
			bind:value={internal}
			onValueChange={(v) => {
				if (v) {
					value = v.toDate('UTC');
				}
			}}
			minValue={minValue && fromDate(minValue)}
			maxValue={maxValue && fromDate(maxValue)}
			{...rest}
		/>
	</Popover.Content>
</Popover.Root>
