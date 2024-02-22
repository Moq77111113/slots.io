<script lang="ts" context="module">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	type Variant = 'small' | 'full';
	type Props<T extends boolean> = Omit<CalendarPrimitive.Props<T>, 'multiple'> & {
		variant: Variant;
		multiple: T | undefined;
	};

	export type Value<T extends boolean> = Props<T>['value'];
</script>

<script lang="ts" generics="T extends boolean">
	import { cn } from '$lib/utils';
	import * as Calendar from '.';

	let value: Props<T>['value'] = undefined;
	let variant: Props<T>['variant'] = 'small';
	let placeholder: Props<T>['placeholder'] = undefined;
	let weekdayFormat: Props<T>['weekdayFormat'] = undefined;
	let multiple: Props<T>['multiple'] = undefined;
	let clazz: Props<T>['class'];
	let onValueChange: Props<T>['onValueChange'] = undefined;

	export {
		value,
		variant,
		placeholder,
		weekdayFormat,
		multiple,
		className as class,
		onValueChange
	};
</script>

<CalendarPrimitive.Root
	bind:value
	bind:placeholder
	{...$$restProps}
	{weekdayFormat}
	{multiple}
	{onValueChange}
	class={cn('p-3', variant === 'full' ? 'justify-between' : 'w-fit', clazz)}
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
