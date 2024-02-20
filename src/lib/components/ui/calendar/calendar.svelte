<script lang="ts" context="module">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	type Variant = 'small' | 'full';
	export type Props = Omit<CalendarPrimitive.Props, 'value'> & { variant?: Variant };
</script>

<script lang="ts">
	import * as Calendar from '.';
	import { cn } from '$lib/utils';

	type $$Props = CalendarPrimitive.Props<boolean> & {
		variant?: Variant;
	};
	type $$Events = CalendarPrimitive.Events;

	export let variant: Props['variant'] = 'small';
	export let value: $$Props['value'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;
	export let weekdayFormat: $$Props['weekdayFormat'] = 'short';
	export let multiple: $$Props['multiple'] = false;
	let className: $$Props['class'] = undefined;

	export { className as class };
</script>

<CalendarPrimitive.Root
	bind:value
	bind:placeholder
	{...$$restProps}
	{weekdayFormat}
	{multiple}
	class={cn('p-3', variant === 'full' ? 'justify-between' : 'w-fit', className)}
	on:keydown
	let:months
	let:weekdays
>
	<Calendar.Header>
		<Calendar.PrevButton />
		<Calendar.Heading />
		<Calendar.NextButton />
	</Calendar.Header>
	<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
		{#each months as month, i (i)}
			<Calendar.Grid>
				<Calendar.GridHead>
					<Calendar.GridRow class="flex">
						{#each weekdays as weekday}
							<Calendar.HeadCell class={cn(variant === 'full' && 'w-full')}>
								{weekday.slice(0, 2)}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="w-full mt-2">
							{#each weekDates as date}
								<Calendar.Cell {date} class={cn(variant === 'full' && 'w-full')}>
									<Calendar.Day {date} month={month.value} />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</div>
</CalendarPrimitive.Root>
