import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import type { CreatePollDto } from '$domain/poll/dto/in/poll-input';

import { MockedPollContext } from '../mocks/context.mock';
import type { PollServiceContext } from '../types';
import { PollCreateSubService } from './poll.create.subservice';

describe('Creating poll', () => {
	let service: ReturnType<typeof PollCreateSubService>;
	let context: PollServiceContext;

	beforeAll(() => {
		context = MockedPollContext();
		service = PollCreateSubService(context);
	});

	describe('Authorization', () => {
		it('should throw an error if the user is not logged in or does not exists', () => {
			const spy = spyOn(context.apis.meApi, 'getMe').mockImplementation(() => {
				throw new Error('user:unauthorized');
			});

			const fn = () =>
				service.create({
					title: 'Sidney birthday party',
					description:
						"Hi, guys ! I'm organizing a party for Sidney's birthday. Please fill the poll to let me know when you're available.",
					slots: []
				});

			expect(fn).toThrow(Error('user:unauthorized'));

			spy.mockRestore();
		});
	});

	describe('Data validation', () => {
		it('should throw an error if the title is too long', () => {
			const fn = () =>
				service.create({
					title: 'Hi'.repeat(100),
					description:
						"Hi, guys ! I'm organizing a party for Sidney's birthday. Please fill the poll to let me know when you're available.",
					slots: []
				});

			expect(fn).toThrow(Error('poll:title-too-long'));
		});

		it('should throw an error if the description is too long', () => {
			const fn = () =>
				service.create({
					title: 'Sidney birthday party',
					description: 'Hi'.repeat(255),
					slots: []
				});

			expect(fn).toThrow(Error('poll:description-too-long'));
		});

		it('should throw an error if some slots are overlapping', () => {
			const fn = () =>
				service.create({
					title: 'Sidney birthday party',
					slots: [
						{
							start: new Date('2021-01-01T10:00:00.000Z'),
							end: new Date('2021-01-01T11:00:00.000Z')
						},
						{
							start: new Date('2021-01-01T10:30:00.000Z'),
							end: new Date('2021-01-01T11:30:00.000Z')
						}
					]
				});

			expect(fn).toThrow(Error('poll:slots-overlapping'));
		});

		it('should allow to pass slots that are adjacent', () => {
			const fn = () =>
				service.create({
					title: 'Sidney birthday party',
					slots: [
						{
							start: new Date('2021-01-01T10:00:00.000Z'),
							end: new Date('2021-01-01T11:00:00.000Z')
						},
						{
							start: new Date('2021-01-01T11:00:00.000Z'),
							end: new Date('2021-01-01T12:00:00.000Z')
						}
					]
				});

			expect(fn).not.toThrow();
		});
	});

	describe('Poll creation', () => {
		it('should return a new poll without slots', async () => {
			const me = await context.apis.meApi.getMe();
			const body = {
				title: 'Sidney birthday party',
				description:
					"Hi, guys ! I'm organizing a party for Sidney's birthday. Please fill the poll to let me know when you're available.",
				slots: []
			} satisfies CreatePollDto;
			const { id, creatorId, title, description } = await service.create(body);

			expect(id).toBeDefined();
			expect(creatorId).toEqual(me.id);
			expect(title).toBe(body.title);
			expect(description).toBe(body.description);
		});

		it('should return a new poll with slots', async () => {
			const me = await context.apis.meApi.getMe();
			const body = {
				title: 'Sidney birthday party',
				description:
					"Hi, guys ! I'm organizing a party for Sidney's birthday. Please fill the poll to let me know when you're available.",
				slots: [
					{
						start: new Date('2021-01-01T10:00:00.000Z'),
						end: new Date('2021-01-01T11:00:00.000Z'),
						availability: {
							status: 'available'
						}
					},
					{
						start: new Date('2021-01-01T11:00:00.000Z'),
						end: new Date('2021-01-01T12:00:00.000Z')
					}
				]
			} satisfies CreatePollDto;
			const { id, creatorId, title, description, slots } = await service.create(body);
			expect(id).toBeDefined();
			expect(creatorId).toEqual(me.id);
			expect(title).toBe(body.title);
			expect(description).toBe(body.description);
			expect(slots).toHaveLength(2);
		});
	});
});
