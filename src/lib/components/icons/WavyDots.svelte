<script lang="ts">
	import { cn } from '$lib/utils';

	const dots = Array(3)
		.fill(0)
		.map((_, i) => i);

	type Props = {
		class?: string;
	};

	let clazz: Props['class'] = undefined;

	export { clazz as class };
</script>

<div class={cn('wave', clazz)}>
	{#each dots as _}<div class="dot"></div>{/each}
</div>

<style>
	@keyframes wave {
		0%,
		60%,
		100% {
			transform: initial;
		}
		30% {
			transform: translateY(-15px);
		}
	}
	.wave {
		@apply flex items-center justify-center;
	}

	.dot {
		@apply w-1 h-1 bg-primary rounded-full inline-block;
		animation: wave 1.2s linear infinite;
	}

	.dot:nth-child(2) {
		animation-delay: -1.1s;
		margin-left: 4px;
	}

	.dot:nth-child(3) {
		animation-delay: -0.9s;
		margin-left: 4px;
	}
</style>
