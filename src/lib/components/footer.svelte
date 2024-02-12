<script lang="ts">
	import { site } from '$lib/config';
</script>

<footer class="py-6 md:px-8 md:py-0">
	<div class="container flex flex-col items-center justify-center gap-4 md:h-12 md:flex-row">
		<div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
			<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
				Built by{' '}<a
					href={site.links.github}
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Moq
				</a>
			</p>
		</div>
	</div>
</footer>
