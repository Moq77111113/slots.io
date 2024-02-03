import { DomainError, type ErrorCollection } from '$domain/@shared/errors/errors';

type Keys =
	| 'poll:title-too-long'
	| 'poll:description-too-long'
	| 'poll:slots-overlapping'
	| 'poll:not-found'
	| 'poll:authorization-required'
	| 'poll:bad-time-range'
	| 'poll:slot_not_found';

export const PollErrors = {
	title_too_long: DomainError({
		key: 'poll:title-too-long',
		message: 'The title is too long',
		statusCode: 'bad_data'
	}),
	description_too_long: DomainError({
		key: 'poll:description-too-long',
		message: 'The description is too long',
		statusCode: 'bad_data'
	}),
	slots_overlapping: (overlapping: { start: Date; end: Date }[]) =>
		DomainError(
			{
				key: 'poll:slots-overlapping',
				message: 'The slots are overlapping',
				statusCode: 'bad_data'
			},
			{
				slots: overlapping.map(({ start, end }) => ({ start, end }))
			}
		),
	not_found: DomainError({
		key: 'poll:not-found',
		message: 'The poll was not found',
		statusCode: 'not_found'
	}),
	authorization_required: DomainError({
		key: 'poll:authorization-required',
		message: 'You are not the owner of the poll',
		statusCode: 'unauthorized'
	}),
	bad_time_range: DomainError({
		key: 'poll:bad-time-range',
		message: 'The time range is invalid',
		statusCode: 'bad_data'
	}),
	slot_not_found: DomainError({
		key: 'poll:slot_not_found',
		message: 'The slot was not found',
		statusCode: 'not_found'
	})
} as const satisfies ErrorCollection<Keys>;

export type PollErrorKeys = Keys;
