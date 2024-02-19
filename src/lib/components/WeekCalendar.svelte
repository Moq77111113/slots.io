<script lang="ts">
	import { cn } from '$lib/utils';
	import { Icons } from './icons';
	import Button from './ui/button/button.svelte';
	import { Checkbox } from './ui/checkbox';
	type Props = {
		start: Date;
		onSelect: (date: Date) => void;
		class?: string;
	};

	const { start: startInput, onSelect, class: clazz } = $props<Props>();

	let start = $state(startInput);
	const days = $derived.call(() => {
		const days = [];
		for (let i = 0; i < 7; i++) {
			days.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
		}
		return days;
	});

	const nextWeek = () => {
		start = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
	};
	const prevWeek = () => {
		start = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
	};

	const format = (format: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long' }) =>
		Intl.DateTimeFormat('en-US', format).format;

	const formatDayMonth = (date: Date) => format()(date);
	const formatWeekDay = (date: Date) => format({ weekday: 'short' })(date);
	const formatDay = (date: Date) => format({ day: '2-digit' })(date);
</script>

<div class={cn('flex flex-col space-y-2', clazz)}>
	<div class="flex flex-row items-center space-x-2">
		<Button variant="outline" class="border-accent-foreground" size="icon" on:click={prevWeek}
			><Icons.prev /></Button
		>
		<Button variant="outline" class="border-accent-foreground" size="icon" on:click={nextWeek}
			><Icons.next /></Button
		>
		<Button variant="outline" class="border-accent-foreground" on:click={() => (start = new Date())}
			>Today</Button
		>
		<span class="text-xs font-medium"
			>{formatDayMonth(start)} - {formatDayMonth(days[days.length - 1])}</span
		>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-7 w-full space-y-1 md:space-x-1 md:space-y-0">
		{#each days as day (day.getTime())}
			<label
				class=" w-[120px] has-[:checked]:bg-green-600/85 flex flex-col items-center bg-primary border-1 rounded-md text-secondary p-4 space-y-2 mx-auto cursor-pointer hover:bg-gray-300"
			>
				<input
					type="checkbox"
					class="hidden"
					on:change={() => {
						onSelect(day);
					}}
				/>
				<div class="flex flex-col justify-center items-center">
					<span class="text-xs">{formatWeekDay(day)}</span>
					<h3 class="text-base font-medium">{formatDay(day)}</h3>
				</div>
			</label>
		{/each}
	</div>
</div>
