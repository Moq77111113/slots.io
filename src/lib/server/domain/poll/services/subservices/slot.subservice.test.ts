import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import { makePollId, type Poll, type SlotId } from '$domain/poll/models';
import type { User, UserId } from '$domain/user/models';

import type { PollServiceContext } from '../types';
import { MockedPollContext } from './mocks/context.mock';
import { PollCreateSubService } from './poll.create.subservice';
import { SlotSubService } from './slot.subservice';

describe('Poll Slots', () => {
	let service: ReturnType<typeof SlotSubService>;
	let context: PollServiceContext;
	let createdPoll: Poll;
	beforeAll(async () => {
		context = MockedPollContext();
		service = SlotSubService(context);

		createdPoll = await PollCreateSubService(context).create({
			title: 'Sidney birthday party',
			slots: []
		});
	});

	describe('Adding Slots', () => {
		describe('Check Presence', () => {
			it('should throw a poll not found exception if the poll does not exists', () => {
				const fn = () =>
					service.addSlot(makePollId('2'), {
						start: new Date('2024-01-01T00:00:00Z'),
						end: new Date('2024-01-01T23:59:00Z')
					});

				expect(fn).toThrow(Error('poll:not-found'));
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
					service.addSlot(createdPoll.id, {
						start: new Date('2024-01-01T00:00:00Z'),
						end: new Date('2024-01-01T23:59:00Z')
					});

				expect(fn).toThrow(Error('poll:authorization-required'));
				spy.mockRestore();
			});
		});

		describe('Data validation', () => {
			it('should throw a bad-time-range exception if the start date is greater than the end date', () => {
				const fn = () =>
					service.addSlot(createdPoll.id, {
						start: new Date('2024-01-01T23:59:00Z'),
						end: new Date('2024-01-01T00:00:00Z')
					});

				expect(fn).toThrow(Error('poll:bad-time-range'));
			});

			it('should throw a bad-time-range exception if the slot duration is less than 1 hour', () => {
				const fn = () =>
					service.addSlot(createdPoll.id, {
						start: new Date('2024-01-01T23:00:00Z'),
						end: new Date('2024-01-01T23:30:00Z')
					});

				expect(fn).toThrow(Error('poll:bad-time-range'));
			});

			it('should throw a slots conflict exception if the slot overlaps another ', () => {
				const spy = spyOn(context.repositories.poll, 'findById').mockImplementation(
					() =>
						({
							id: createdPoll.id,
							slots: [
								{
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								}
							],
							creatorId: 'me'
						}) as Poll
				);

				const fn = () =>
					service.addSlot(createdPoll.id, {
						start: new Date('2024-01-01T10:00:00Z'),
						end: new Date('2024-01-01T13:00:00Z')
					});

				expect(fn).toThrow(Error('poll:slots-overlapping'));
				spy.mockRestore();
			});
		});

		describe('Add Slot', () => {
			it('should add the new slot to the poll', async () => {
				const spy = spyOn(context.repositories.poll, 'findById').mockImplementation(
					() =>
						({
							id: createdPoll.id,
							slots: [
								{
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								}
							],
							creatorId: 'me'
						}) as Poll
				);

				const slot = {
					start: new Date('2024-01-02T10:00:00Z'),
					end: new Date('2024-01-02T20:00:00Z'),
					availability: {
						status: 'maybe'
					}
				} as const;

				const poll = await service.addSlot(createdPoll.id, slot);

				expect(poll.creatorId).toEqual('me' as UserId);
				expect(
					poll.slots.find(
						(_) =>
							_.start.getTime() === slot.start.getTime() && _.end.getTime() === slot.end.getTime()
					)
				).toBeDefined();
				expect(poll.slots.length).toEqual(2);
				spy.mockRestore();
			});
		});
	});

	describe('Removing Slots', () => {
		describe('Check Presence', () => {
			it('should throw a poll not found exception if the poll does not exists', () => {
				const fn = () => service.removeSlot(makePollId('2'), '1' as SlotId);

				expect(fn).toThrow(Error('poll:not-found'));
			});

			it('should throw a slot not found exception if the slot does not exists', () => {
				const spy = spyOn(context.repositories.poll, 'findById').mockImplementation(
					() =>
						({
							id: createdPoll.id,
							slots: [
								{
									id: '1',
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								}
							],
							creatorId: 'me'
						}) as Poll
				);

				const fn = () => service.removeSlot(createdPoll.id, '2' as SlotId);

				expect(fn).toThrow(Error('poll:slot_not_found'));
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

				const fn = () => service.removeSlot(createdPoll.id, '2' as SlotId);

				expect(fn).toThrow(Error('poll:authorization-required'));
				spy.mockRestore();
			});
		});

		describe('Remove Slot', () => {
			it('should remove the slot from the poll', async () => {
				const spy = spyOn(context.repositories.poll, 'findById').mockImplementation(
					() =>
						({
							id: createdPoll.id,
							slots: [
								{
									id: '1',
									start: new Date('2024-01-01T00:00:00Z'),
									end: new Date('2024-01-01T23:59:00Z')
								},
								{
									id: '2',
									start: new Date('2024-01-02T10:00:00Z'),
									end: new Date('2024-01-02T20:00:00Z')
								}
							],
							creatorId: 'me'
						}) as Poll
				);

				const poll = await service.removeSlot(createdPoll.id, '1' as SlotId);

				expect(poll.creatorId).toEqual('me' as UserId);
				expect(poll.slots.find((_) => _.id === '1')).toBeUndefined();
				expect(poll.slots.length).toEqual(1);
				spy.mockRestore();
			});
		});
	});
});
