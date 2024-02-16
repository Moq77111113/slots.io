<script lang="ts">
	import { Icons } from '$lib/components';
	import { cn } from '$lib/utils';
	import type { PageServerData } from './$types';

	const format = (
		options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	) => new Intl.DateTimeFormat('en-US', options).format;

	type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

	const getColor = (status: AvailabilityStatus) => {
		switch (status) {
			case 'available':
				return 'bg-green-600';
			case 'unavailable':
				return 'bg-red-500';
			case 'maybe':
				return 'bg-yellow-500';
			default:
				return 'bg-medium-gray';
		}
	};

	const statusOrder = ['available', 'maybe', 'unavailable'] as const;

	type Huddle = PageServerData['huddle'];
	type Slot = Huddle['slots'][number];
	type Availability = Slot['availabilities'][number];

	const weights = (status: AvailabilityStatus) => {
		switch (status) {
			case 'available':
				return 2;
			case 'maybe':
				return 1;
			case 'unavailable':
				return 0;
			default:
				return 0;
		}
	};
	const bestSlot = (slots: Slot[]) => {
		const best = slots.reduce(
			(acc, slot) => {
				const weight = slot.availabilities.reduce(
					(acc, availability) => acc + weights(availability.status),
					0
				);
				if (weight > acc.weight) {
					return { slot, weight };
				}
				return acc;
			},
			{ slot: slots[0], weight: 0 }
		);
		return best.slot;
	};

	export let data: PageServerData;

	$: best = bestSlot(data.huddle.slots);
</script>

<svelte:head>
	<title>{data.huddle.title} - Slots</title>
</svelte:head>

<main class="container max-w-xl h-full flex flex-col flex-1 space-y-8">
	<section class="space-y-2">
		<h1 class="text-3xl font-semibold">{data.huddle.title}</h1>
		<h3 class="text-sm">by {data.huddle.creator?.email}</h3>
	</section>

	<section class="flex space-x-2 items-center">
		<div
			class="h-12 w-12 border border-input bg-medium-gray text-white dark:text-primary flex items-center justify-center rounded-md cursor-pointer"
		>
			<Icons.logout />
		</div>
		<div class="flex flex-col">
			<h3 class="text-lg font-semibold">Context</h3>
			<span class="text-sm text-light-gray">{data.huddle.description}</span>
		</div>
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Details</h3>
		<div class="flex space-x-2">
			<div
				class="h-12 w-12 border border-input bg-medium-gray text-white dark:text-primary flex items-center justify-center rounded-md"
			>
				<Icons.mapPin />
			</div>
			<div class="flex flex-col">
				<h3 class="text-lg font-semibold">Location</h3>
				<span class="text-sm text-light-gray">21 Mary Street - 3rd floor</span>
			</div>
		</div>
		<div class="flex space-x-2">
			<div
				class="h-12 w-12 border border-input bg-medium-gray text-white dark:text-primary flex items-center justify-center rounded-md"
			>
				<Icons.logout />
			</div>
			<div class="flex flex-col">
				<h3 class="text-lg font-semibold">Instructions</h3>
				<span class="text-sm text-light-gray"
					>Join us at the 3rd floor , we'll be waiting for you!
				</span>
			</div>
		</div>
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Organizer</h3>
		<div class="flex space-x-2">
			<div
				class="h-12 w-12 border border-input bg-medium-gray text-white dark:text-primary flex items-center justify-center rounded-full"
			>
				<span>{data.huddle.creator?.email.slice(0, 2).toUpperCase()}</span>
			</div>
			<div class="flex flex-col">
				<h3 class="text-lsmfont-semibold">{data.huddle.creator?.email}</h3>
				<span class="text-sm text-light-gray"
					>{format({ weekday: undefined, month: 'short', year: '2-digit', day: '2-digit' })(
						data.huddle.createdAt
					)}</span
				>
			</div>
		</div>
	</section>

	<section class="flex flex-col space-y-4">
		<h2 class="text-xl font-semibold">Slots</h2>
		{#if data.huddle.slots.length === 0}
			<p class="text-light-gray">No slots provided yet</p>
		{:else}
			{#each data.huddle.slots as slot (slot.id)}
				<div class={cn('flex space-x-4 items-center group')}>
					<div
						class={cn(
							'h-12 w-12 bg-medium-gray text-white dark:text-primary flex items-center justify-center rounded-md group-hover:scale-105 transition-transform duration-200 ease-in-out'
						)}
					>
						<Icons.clock />
					</div>
					<div class="flex flex-col">
						<h3 class="text-lg font-semibold">
							<div class="flex">
								{#each slot.availabilities.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)) as availability}
									<div
										class={cn(
											'h-6 w-6 border border-input bg-medium-gray flex items-center ',
											'justify-center rounded-full',
											'-ml-2 z-10 relative group-hover:ml-0 transition-all duration-200 ease-in-out',
											getColor(availability.status)
										)}
									>
										<span class="text-xs">{availability.user?.email.slice(0, 2).toUpperCase()}</span
										>
									</div>
								{/each}
							</div>
						</h3>
						<span class="text-sm text-light-gray">{format()(slot.start)}</span>
					</div>
				</div>
			{/each}
		{/if}
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Status</h3>
		<span class="text-sm text-light-gray"
			>Best date for the huddle is on {format()(best.start)}</span
		>
	</section>
</main>
