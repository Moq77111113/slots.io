import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import { type Huddle, makeHuddleId, type SlotId } from '#/domain/huddle/models';
import type { User, UserId } from '#/domain/user/models';

import type { HuddleServiceContext } from '../types';
import { HuddleCreateSubService } from './huddle.create.subservice';
import { SlotSubService } from './huddle.slot.subservice';
import { MockedHuddleContext } from './mocks/context.mock';

describe('Huddle Slots', () => {
	let service: ReturnType<typeof SlotSubService>;
	let context: HuddleServiceContext;
	let createdHuddle: Huddle;
	beforeAll(async () => {
		context = MockedHuddleContext();
		service = SlotSubService(context);

		createdHuddle = await HuddleCreateSubService(context).create({
			title: 'Sidney birthday party',
			slots: []
		});
	});

	describe('Adding Slots', () => {
		describe('Check Presence', () => {
			it('should throw a huddle not found exception if the huddle does not exists', () => {
				const fn = () =>
					service.addSlot(makeHuddleId('2'), {
						start: new Date('2024-01-01T00:00:00Z'),
						end: new Date('2024-01-01T23:59:00Z')
					});

				expect(fn).toThrow(Error('huddle:not-found'));
			});
		});

		describe('Authorization', () => {
			it('should throw an authorization required exception if the user is not creator', () => {
				const spy = spyOn(context.apis.meApi, 'getMe').mockImplementation(
					() =>
						({
							id: '123'
						}) as User
				);

				const fn = () =>
					service.addSlot(createdHuddle.id, {
						start: new Date('2024-01-01T00:00:00Z'),
						end: new Date('2024-01-01T23:59:00Z')
					});

				expect(fn).toThrow(Error('huddle:not-admin'));
				spy.mockRestore();
			});
		});

		describe('Data validation', () => {
			it('should throw a bad-time-range exception if the start date is greater than the end date', () => {
				const fn = () =>
					service.addSlot(createdHuddle.id, {
						start: new Date('2024-01-01T23:59:00Z'),
						end: new Date('2024-01-01T00:00:00Z')
					});

				expect(fn).toThrow(Error('huddle:bad-time-range'));
			});

			it('should throw a bad-time-range exception if the slot duration is less than 1 hour', () => {
				const fn = () =>
					service.addSlot(createdHuddle.id, {
						start: new Date('2024-01-01T23:00:00Z'),
						end: new Date('2024-01-01T23:30:00Z')
					});

				expect(fn).toThrow(Error('huddle:bad-time-range'));
			});

			it('should throw a slots conflict exception if the slot overlaps another ', () => {
				const spy = spyOn(context.repositories.huddle, 'findById').mockImplementation(
					() =>
						({
							id: createdHuddle.id,
							slots: [
								{
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								}
							],
							creatorId: 'me'
						}) as Huddle
				);

				const fn = () =>
					service.addSlot(createdHuddle.id, {
						start: new Date('2024-01-01T10:00:00Z'),
						end: new Date('2024-01-01T13:00:00Z')
					});

				expect(fn).toThrow(Error('huddle:slots-overlapping'));
				spy.mockRestore();
			});
		});

		describe('Add Slot', () => {
			it('should add the new slot to the huddle', async () => {
				const spy = spyOn(context.repositories.huddle, 'findById').mockImplementation(
					() =>
						({
							id: createdHuddle.id,
							slots: [
								{
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								}
							],
							creatorId: 'me'
						}) as Huddle
				);

				const slot = {
					start: new Date('2024-01-02T10:00:00Z'),
					end: new Date('2024-01-02T20:00:00Z'),
					availability: {
						status: 'maybe'
					}
				} as const;

				const huddle = await service.addSlot(createdHuddle.id, slot);

				expect(huddle.creatorId).toEqual('me' as UserId);
				expect(
					huddle.slots.find(
						(_) =>
							_.start.getTime() === slot.start.getTime() && _.end.getTime() === slot.end.getTime()
					)
				).toBeDefined();
				spy.mockRestore();
			});
		});
	});

	describe('Removing Slots', () => {
		describe('Check Presence', () => {
			it('should throw a huddle not found exception if the huddle does not exists', () => {
				const fn = () => service.removeSlot(makeHuddleId('2'), '1' as SlotId);

				expect(fn).toThrow(Error('huddle:not-found'));
			});

			it('should throw a slot not found exception if the slot does not exists', () => {
				const spy = spyOn(context.repositories.huddle, 'findById').mockImplementation(
					() =>
						({
							id: createdHuddle.id,
							slots: [
								{
									id: '1',
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								}
							],
							creatorId: 'me'
						}) as Huddle
				);

				const fn = () => service.removeSlot(createdHuddle.id, '2' as SlotId);

				expect(fn).toThrow(Error('huddle:slot_not_found'));
				spy.mockRestore();
			});
		});

		describe('Authorization', () => {
			it('should throw an authorization required exception if the user is not creator', () => {
				const spy = spyOn(context.apis.meApi, 'getMe').mockImplementation(
					() =>
						({
							id: '123'
						}) as User
				);

				const fn = () => service.removeSlot(createdHuddle.id, '2' as SlotId);

				expect(fn).toThrow(Error('huddle:not-admin'));
				spy.mockRestore();
			});
		});

		describe('Remove Slot', () => {
			it('should remove the slot from the huddle', async () => {
				console.log('createdHuddle', createdHuddle);
				const huddle = await service.removeSlot(createdHuddle.id, createdHuddle.slots[0].id);

				expect(huddle.creatorId).toEqual('me' as UserId);
				expect(huddle.slots.find((_) => _.id === '1')).toBeUndefined();
			});
		});
	});
});
