import { DomainError, type ErrorCollection } from '$domain/@shared/errors/errors';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';

type Keys = 'poll:title-too-long' | 'poll:description-too-long' | 'poll:slots-overlapping';

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
	slots_overlapping: (overlapping: CreateSlotDto[]) =>
		DomainError(
			{
				key: 'poll:slots-overlapping',
				message: 'The slots are overlapping',
				statusCode: 'bad_data'
			},
			{
				slots: overlapping.map(({ start, end }) => ({ start, end }))
			}
		)
} as const satisfies ErrorCollection<Keys>;

export type PollErrorKeys = Keys;
