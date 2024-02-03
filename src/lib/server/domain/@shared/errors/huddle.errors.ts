import { DomainError, type ErrorCollection } from '$domain/@shared/errors/errors';

type Keys =
	| 'huddle:title-too-long'
	| 'huddle:description-too-long'
	| 'huddle:slots-overlapping'
	| 'huddle:not-found'
	| 'huddle:not-admin'
	| 'huddle:not-member'
	| 'huddle:bad-time-range'
	| 'huddle:slot_not_found';

export const HuddleErrors = {
	title_too_long: DomainError({
		key: 'huddle:title-too-long',
		message: 'The title is too long',
		statusCode: 'bad_data'
	}),
	description_too_long: DomainError({
		key: 'huddle:description-too-long',
		message: 'The description is too long',
		statusCode: 'bad_data'
	}),
	slots_overlapping: (overlapping: { start: Date; end: Date }[]) =>
		DomainError(
			{
				key: 'huddle:slots-overlapping',
				message: 'The slots are overlapping',
				statusCode: 'bad_data'
			},
			{
				slots: overlapping.map(({ start, end }) => ({ start, end }))
			}
		),
	not_found: DomainError({
		key: 'huddle:not-found',
		message: 'The huddle was not found',
		statusCode: 'not_found'
	}),
	admin_required: DomainError({
		key: 'huddle:not-admin',
		message: 'You are not the owner of the huddle',
		statusCode: 'forbidden'
	}),
	not_member: DomainError({
		key: 'huddle:not-member',
		message: 'You are not a member of the huddle',
		statusCode: 'forbidden'
	}),
	bad_time_range: DomainError({
		key: 'huddle:bad-time-range',
		message: 'The time range is invalid',
		statusCode: 'bad_data'
	}),
	slot_not_found: DomainError({
		key: 'huddle:slot_not_found',
		message: 'The slot was not found',
		statusCode: 'not_found'
	})
} as const satisfies ErrorCollection<Keys>;

export type HuddleErrorKeys = Keys;
