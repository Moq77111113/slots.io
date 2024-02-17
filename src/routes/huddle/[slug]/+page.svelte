<script lang="ts">
	import { Icons } from '$lib/components';
	import type { ComponentType } from 'svelte';
	import type { PageServerData } from './$types';
	import { cn } from '$lib/utils';

	const format = (
		options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	) => new Intl.DateTimeFormat('en-US', options).format;

	type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

	type Huddle = PageServerData['huddle'];
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

	export let data: PageServerData;

	$: best = bestSlot(data.huddle.slots);
</script>

<svelte:head>
	<title>{data.huddle.title} - Slots</title>
</svelte:head>

{#snippet row({icon, heading, content, iconClass}: {icon: ComponentType, heading: string, content: string, iconClass?: string})}
	<div class="flex space-x-2 items-center">
		<div
			class={cn(
				'h-10 w-10 border border-input bg-medium-gray/80 dark:bg-light-gray/20 text-white dark:text-primary flex items-center justify-center rounded-md',
				iconClass
			)}
		>
			<svelte:component this={icon} class={'h-4 w-4'} />
		</div>
		<div class="flex flex-col">
			<h3 class="text-sm font-semibold">{heading}</h3>
			<span class="text-sm text-medium-gray dark:text-light-gray">{content}</span>
		</div>
	</div>
{/snippet}

<main class="container max-w-xl h-full flex flex-col flex-1 space-y-8 p-8">
	<section class="space-y-2">
		<h1 class="text-3xl font-semibold">{data.huddle.title}</h1>
		<span class="text-sm">by {data.huddle.creator?.email}</span>
	</section>

	<section class="flex space-x-2 items-center">
		{@render row({
			icon: Icons.logout,
			heading: 'Context',
			content: data.huddle.description || ''
		})}
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Details</h3>
		{@render row({
			icon: Icons.mapPin,
			heading: 'Location',
			content: '21 Mary Street - 3rd floor'
		})}
		{@render row({
			icon: Icons.logout,
			heading: 'Instructions',
			content: "Join us at the 3rd floor , we'll be waiting for you!"
		})}
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
					>{format({ weekday: undefined, month: 'short', year: 'numeric', day: '2-digit' })(
						data.huddle.createdAt
					)}</span
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
				{@render row({
					icon: Icons.clock,
					iconClass: slot.id === best.id ? 'bg-gradient-to-b from-black to-red-500' : '',
					heading: 'Date and time',
					content: `${format()(slot.start)} · ${
						slot.availabilities.filter((_) => _.status !== 'unavailable').length
					} people available`
				})}
			{/each}
		{/if}
	</section>

	<section class="flex flex-col space-y-6">
		<h3 class="text-lg font-semibold">Status</h3>
		<span class="text-sm text-medium-gray dark:text-light-gray"
			>Best date for the huddle is on {format()(best.start)}</span
		>
	</section>
</main>
