<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { mediaQuery } from '$lib/stores/mediaquery';
	let open = false;

	const isDesktop = mediaQuery('(min-width: 768px)');

	interface Props {
		title: string;
		description?: string;
	}
	let title: Props['title'];
	let description: Props['description'];

	export { title, description };
</script>

{#if $isDesktop}
	<Dialog.Root bind:open>
		<Dialog.Trigger asChild let:builder>
			<slot name="trigger" {builder}>
				<Button variant="outline" builders={[builder]}>Open</Button>
			</slot>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
				{#if description}<Dialog.Description>{description}</Dialog.Description>
				{/if}
			</Dialog.Header>
			<slot />
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root>
		<Drawer.Trigger asChild let:builder>
			<slot name="trigger" {builder}>
				<Button variant="outline" builders={[builder]}>Open</Button>
			</slot>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>{title}</Drawer.Title>
				{#if description}<Drawer.Description>
						{description}
					</Drawer.Description>
				{/if}
			</Drawer.Header>
			<slot />
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<slot name="close" {builder}>
						<Button variant="outline" builders={[builder]}>Cancel</Button></slot
					>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
