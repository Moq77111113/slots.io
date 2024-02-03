import { beforeAll, describe, expect, it } from 'bun:test';

import type { Poll, SlotId } from '$domain/poll/models';
import type { PollRepository } from '$domain/poll/ports/spi';
import type { UserId } from '$domain/user/models';

import type { PollServiceContext } from '../types';
import { MockedPollContext } from './mocks/context.mock';
import { AvailabilitySubService } from './poll.availabilities.subservice';

describe('Slots availabilities ', () => {
	let service: ReturnType<typeof AvailabilitySubService>;
	let context: PollServiceContext;
	const userId = 'me' as UserId;
	const seed = async (repo: PollRepository) => {
		let poll = await repo.create({
			title: 'test',
			description: 'test',
			creatorId: userId,
			locked: false
		});
		poll = await repo.addSlot(poll.id, {
			start: new Date('2024-01-01T00:00:00Z'),
			end: new Date('2024-01-01T23:59:59Z'),
			availabilities: []
		});
		return poll;
	};
	let poll: Poll;
	beforeAll(async () => {
		context = MockedPollContext();
		service = AvailabilitySubService(context);
		poll = await seed(context.repositories.poll);
	});

	type AvailabilityService = keyof ReturnType<typeof AvailabilitySubService>;
	const availabilityServices = [
		'setAvailable',
		'setMaybeAvailable',
		'setUnavailable'
	] satisfies AvailabilityService[];
	describe.each(availabilityServices)('%s', (serviceFunction) => {
		describe('Check availabilities', () => {
			it('should throw a poll not found exception if the slot does not exists', () => {
				const fn = () => service[serviceFunction]('AnIdThatDoesNotExist' as SlotId);

				expect(fn).toThrow(Error('poll:slot_not_found'));
			});
		});
	});
});
