<script lang="ts">
	import { Icons } from '$lib/components';
	import { format } from '$lib/helpers/date';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';
	import Row from './Row.svelte';

	type Huddle = PageData['huddle'];
	type Slot = Huddle['slots'][number];
	type Availability = Slot['availabilities'][number];

	const weights = (status: Availability['status']) => {
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

	export let data: PageData;

	$: best = bestSlot(data.huddle.slots);

	$: isOwner = data.huddle.creator?.id === data.me?.id;

	const sections = {
		context: {
			icon: Icons.logout,
			heading: 'Context',
			content: data.huddle.description || ''
		},
		location: {
			icon: Icons.mapPin,
			heading: 'Location',
			content: '21 Mary Street - 3rd floor'
		},
		instructions: {
			icon: Icons.logout,
			heading: 'Instructions',
			content: "Join us at the 3rd floor , we'll be waiting for you!"
		},
		slot: (slot: Slot) => ({
			icon: Icons.clock,
			iconClass: slot.id === best.id ? 'bg-gradient-to-b from-black to-red-500' : '',
			heading: 'Date and time',
			content: `${format(slot.start, 'ddd DD MMMM YYYY')} · ${
				slot.availabilities.filter((_) => _.status !== 'unavailable').length
			} people available`
		})
	} as const;
</script>

<svelte:head>
	<title>{data.huddle.title} - Slots</title>
</svelte:head>

<main class="container max-w-xl h-full flex flex-col flex-1 space-y-8 p-8">
	<section class="space-y-2">
		<h1 class="text-3xl font-semibold">{data.huddle.title}</h1>
		<span class={cn('text-sm')}
			>by {data.huddle.creator?.email}
			{#if isOwner}<small class="text-xs">{' '}(you)</small>{/if}</span
		>
	</section>

	<section class="flex space-x-2 items-center">
		<Row {...sections.context} />
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Details</h3>
		<Row {...sections.location} />

		<Row {...sections.instructions} />
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Organizer</h3>

		<div class="flex space-x-2">
			<div
				class="h-10 w-10 border border-input bg-medium-gray/80 dark:bg-light-gray/20 text-white dark:text-primary flex items-center justify-center rounded-full"
			>
				<span class="text-xs">{data.huddle.creator?.email.slice(0, 2).toUpperCase()}</span>
			</div>
			<div class="flex flex-col">
				<h3 class="text-sm font-semibold">{data.huddle.creator?.email}</h3>
				<span class="text-sm text-medium-gray dark:text-light-gray"
					>{format(data.huddle.createdAt, 'short-date')}</span
				>
			</div>
		</div>
	</section>

	<section class="flex flex-col space-y-4">
		<h2 class="text-xl font-semibold">Slots</h2>
		{#if data.huddle.slots.length === 0}
			<p class="text-light-gray">No time slot provided yet</p>
		{:else}
			{#each data.huddle.slots.sort((a, b) => a.start.getTime() - b.start.getTime()) as slot (slot.id)}
				<Row {...sections.slot(slot)} />
			{/each}
		{/if}
	</section>

	{#if best}
		<section class="flex flex-col space-y-6">
			<h3 class="text-lg font-semibold">Status</h3>
			<span class="text-sm text-medium-gray dark:text-light-gray"
				>Best date for the huddle is on {format(best.start, 'long-date')}
			</span>
		</section>
	{/if}
</main>
