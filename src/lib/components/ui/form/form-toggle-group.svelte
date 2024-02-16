<script lang="ts">
	import { getFormField } from 'formsnap';
	import type { VariantProps } from 'tailwind-variants';
	import type { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';

	import type { toggleVariants } from '$lib/components/ui/toggle';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	type T = $$Generic<'single' | 'multiple'>;
	type $$Props = ToggleGroupPrimitive.Props<T> & VariantProps<typeof toggleVariants>;

	const { attrStore, setValue, name, value } = getFormField();

	export let onValueChange: $$Props['onValueChange'] = undefined;
</script>

<ToggleGroup.Root
	{...$attrStore}
	onValueChange={(v) => {
        onValueChange?.(v as any)
		setValue(v);
	}}
	{...$$restProps}
>
	<slot />
	<input hidden {name} value={$value} />
</ToggleGroup.Root>
