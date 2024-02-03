import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import type { Availability, AvailabilityStatus } from '$domain/huddle/attributes';
import type { Huddle, SlotId } from '$domain/huddle/models';
import type { HuddleRepository } from '$domain/huddle/ports/spi';
import type { User, UserId } from '$domain/user/models';
import { keys } from '$lib/helpers/types';

import type { HuddleServiceContext } from '../types';
import { MockedHuddleContext } from './mocks/context.mock';
import { AvailabilitySubService } from './huddle.availabilities.subservice';

describe('Slots availabilities ', () => {
	const userId = 'me' as UserId;
	const seed = async (
		repo: HuddleRepository,
		create?: Partial<Parameters<typeof repo.create>[0]>
	) => {
		let huddle = await repo.create({
			title: 'test',
			description: 'test',
			creatorId: userId,
			locked: false,
			...create
		});
		huddle = await repo.addSlot(huddle.id, {
			start: new Date('2024-01-01T00:00:00Z'),
			end: new Date('2024-01-01T23:59:59Z'),
			availabilities: []
		});
		return huddle;
	};

	type AvailabilityService = keyof ReturnType<typeof AvailabilitySubService>;
	const availabilityServices = [
		['setAvailable', 'available'],
		['setMaybeAvailable', 'maybe'],
		['setUnavailable', 'unavailable']
	] satisfies [AvailabilityService, AvailabilityStatus][];
	describe.each(availabilityServices)('%s', (serviceFunction, status) => {
		let seededHuddle: Huddle;
		let service: ReturnType<typeof AvailabilitySubService>;
		let context: HuddleServiceContext;
		beforeAll(async () => {
			context = MockedHuddleContext();
			service = AvailabilitySubService(context);
			seededHuddle = await seed(context.repositories.huddle);
		});

		describe('Assert presence & authorization', () => {
			it('should throw a slot not found exception if the slot does not exists', () => {
				const fn = () => service[serviceFunction]('AnIdThatDoesNotExist' as SlotId);

				expect(fn).toThrow(Error('huddle:slot_not_found'));
			});

			it('should throw an unauthorized exception if the user is not member of the huddle', () => {
				const spy = spyOn(context.apis.meApi, 'getMe').mockImplementation(
					() =>
						({
							id: 'lucifer'
						}) as User
				);
				const fn = () => service[serviceFunction](seededHuddle.slots[0].id);

				expect(fn).toThrow(Error('huddle:not-member'));
				spy.mockRestore();
			});
		});
		describe('Setting availability', () => {
			it('should set the availability of the user to the slot', async () => {
				const createdHuddle = await service[serviceFunction](seededHuddle.slots[0].id);

				const availabilitiesForSlot = createdHuddle.slots[0].availabilities;

				expect(availabilitiesForSlot).toEqual(
					expect.arrayContaining([{ userId, status }]) as Availability[]
				);
			});

			it('should override the availability for the user', async () => {
				const anotherServiceFn = keys(service).filter((_) => _ !== serviceFunction)[0];

				await service[anotherServiceFn](seededHuddle.slots[0].id);
				await service[serviceFunction](seededHuddle.slots[0].id);

				const createdHuddle = await service[serviceFunction](seededHuddle.slots[0].id);

				const availabilitiesForSlot = createdHuddle.slots[0].availabilities;

				expect(availabilitiesForSlot).toEqual(
					expect.arrayContaining([{ userId, status }]) as Availability[]
				);
				expect(availabilitiesForSlot.filter((_) => _.userId === userId).length).toBe(1);
			});

			it('should set the availability for many users', async () => {
				const huddleSpy = spyOn(context.repositories.huddle, 'findBySlotId').mockImplementation(
					() => ({
						...seededHuddle,
						participantIds: ['Mazikeen', 'Amenadiel', 'Lucifer'] as UserId[]
					})
				);
				const spy = spyOn(context.apis.meApi, 'getMe')
					.mockImplementationOnce(() => ({ id: 'Lucifer' }) as User)
					.mockImplementationOnce(() => ({ id: 'Mazikeen' }) as User)
					.mockImplementationOnce(() => ({ id: 'Amenadiel' }) as User);

				const seedOne = await seed(context.repositories.huddle, {
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
				huddleSpy.mockRestore();
			});
		});
	});
});
