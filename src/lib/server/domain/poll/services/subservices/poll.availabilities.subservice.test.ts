import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import type { Availability, AvailabilityStatus } from '$domain/poll/attributes';
import type { Poll, SlotId } from '$domain/poll/models';
import type { PollRepository } from '$domain/poll/ports/spi';
import type { User, UserId } from '$domain/user/models';
import { keys } from '$lib/helpers/types';

import type { PollServiceContext } from '../types';
import { MockedPollContext } from './mocks/context.mock';
import { AvailabilitySubService } from './poll.availabilities.subservice';

describe('Slots availabilities ', () => {
	const userId = 'me' as UserId;
	const seed = async (
		repo: PollRepository,
		create?: Partial<Parameters<typeof repo.create>[0]>
	) => {
		let poll = await repo.create({
			title: 'test',
			description: 'test',
			creatorId: userId,
			locked: false,
			...create
		});
		poll = await repo.addSlot(poll.id, {
			start: new Date('2024-01-01T00:00:00Z'),
			end: new Date('2024-01-01T23:59:59Z'),
			availabilities: []
		});
		return poll;
	};

	type AvailabilityService = keyof ReturnType<typeof AvailabilitySubService>;
	const availabilityServices = [
		['setAvailable', 'available'],
		['setMaybeAvailable', 'maybe'],
		['setUnavailable', 'unavailable']
	] satisfies [AvailabilityService, AvailabilityStatus][];
	describe.each(availabilityServices)('%s', (serviceFunction, status) => {
		let seededPoll: Poll;
		let service: ReturnType<typeof AvailabilitySubService>;
		let context: PollServiceContext;
		beforeAll(async () => {
			context = MockedPollContext();
			service = AvailabilitySubService(context);
			seededPoll = await seed(context.repositories.poll);
		});

		describe('Assert presence & authorization', () => {
			it('should throw a slot not found exception if the slot does not exists', () => {
				const fn = () => service[serviceFunction]('AnIdThatDoesNotExist' as SlotId);

				expect(fn).toThrow(Error('poll:slot_not_found'));
			});

			it('should throw an unauthorized exception if the user is not member of the poll', () => {
				const spy = spyOn(context.apis.meApi, 'getMe').mockImplementation(
					() =>
						({
							id: 'lucifer'
						}) as User
				);
				const fn = () => service[serviceFunction](seededPoll.slots[0].id);

				expect(fn).toThrow(Error('poll:not-member'));
				spy.mockRestore();
			});
		});
		describe('Setting availability', () => {
			it('should set the availability of the user to the slot', async () => {
				const createdPoll = await service[serviceFunction](seededPoll.slots[0].id);

				const availabilitiesForSlot = createdPoll.slots[0].availabilities;

				expect(availabilitiesForSlot).toEqual(
					expect.arrayContaining([{ userId, status }]) as Availability[]
				);
			});

			it('should override the availability for the user', async () => {
				const anotherServiceFn = keys(service).filter((_) => _ !== serviceFunction)[0];

				await service[anotherServiceFn](seededPoll.slots[0].id);
				await service[serviceFunction](seededPoll.slots[0].id);

				const createdPoll = await service[serviceFunction](seededPoll.slots[0].id);

				const availabilitiesForSlot = createdPoll.slots[0].availabilities;

				expect(availabilitiesForSlot).toEqual(
					expect.arrayContaining([{ userId, status }]) as Availability[]
				);
				expect(availabilitiesForSlot.filter((_) => _.userId === userId).length).toBe(1);
			});

			it('should set the availability for many users', async () => {
				const pollSpy = spyOn(context.repositories.poll, 'findBySlotId').mockImplementation(() => ({
					...seededPoll,
					participantIds: ['Mazikeen', 'Amenadiel', 'Lucifer'] as UserId[]
				}));
				const spy = spyOn(context.apis.meApi, 'getMe')
					.mockImplementationOnce(() => ({ id: 'Lucifer' }) as User)
					.mockImplementationOnce(() => ({ id: 'Mazikeen' }) as User)
					.mockImplementationOnce(() => ({ id: 'Amenadiel' }) as User);

				const seedOne = await seed(context.repositories.poll, {
					title: `Hell`
				});

				await service[serviceFunction](seedOne.slots[0].id);
				await service[serviceFunction](seedOne.slots[0].id);
				const {
					slots: [slot]
				} = await service[serviceFunction](seedOne.slots[0].id);

				expect(slot.availabilities).toHaveLength(3);
				expect(slot.availabilities).toEqual(
					expect.arrayContaining([
						{ userId: 'Lucifer', status },
						{ userId: 'Mazikeen', status },
						{ userId: 'Amenadiel', status }
					]) as Availability[]
				);
				spy.mockRestore();
				pollSpy.mockRestore();
			});
		});
	});
});
