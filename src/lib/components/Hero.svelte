<script>
	import { Icons } from './icons';
	import Button from './ui/button/button.svelte';
</script>

<section class="">
	<div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
		<h1
			class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
		>
			Simplify Your Life with Ease !
		</h1>
		<h2
			class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
		>
			The easiest and quickest way to organize anything without any hassle !
		</h2>
		<div
			class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
		>
			<Button
				href="/new"
				variant="default"
				size="xl"
				data-sveltekit-preload-data="hover"
				class="text-lg"
			>
				<Icons.projector class="mr-2" />
				<span>My first slot</span>
			</Button>
		</div>
	</div>
</section>
