import type { Button as ButtonPrimitive } from 'bits-ui';
import { tv, type VariantProps } from 'tailwind-variants';
import Root from './button.svelte';

const buttonVariants = tv({
	base: 'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10',
			'icon-sm': 'h-6 w-6 p-0'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

type Override<T> = T & {
	variant?: Variant;
	size?: Size;
};
type Props = Override<ButtonPrimitive.Props>;

type Events = ButtonPrimitive.Events;

export {
	//
	Root as Button,
	buttonVariants,
	Root,
	type Events as ButtonEvents,
	type Props as ButtonProps,
	type Events,
	type Props
};
