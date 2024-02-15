<script lang="ts">
	import Availability from '$lib/components/Availability.svelte';
	import * as Form from '$lib/components/ui/form';

	import { huddleCreateSchema, type HuddleCreateSchema } from './schema';

	import type { SuperValidated } from 'sveltekit-superforms';

	interface Props {
		form: SuperValidated<HuddleCreateSchema>;
	}
	const { form } = $props<Props>();
</script>

<Form.Root method="POST" {form} schema={huddleCreateSchema} let:config class="space-y-4" debug>
	<Form.Field {config} name="title">
		<Form.Item>
			<Form.Label>Huddle Name</Form.Label>
			<Form.Input placeholder="Birthday party" />
			<Form.Description>The name of the huddle or meeting.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Description</Form.Label>
			<Form.Textarea
				rows={2}
				placeholder="Team meeting to discuss project updates and next steps."
			/>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button>Let's go</Form.Button>
</Form.Root>
