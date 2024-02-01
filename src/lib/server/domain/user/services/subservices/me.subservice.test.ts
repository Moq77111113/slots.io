import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import { MockedUserServiceContext } from '../mocks/context.mock';
import type { UserServiceContext } from '../types';
import { MeSubService } from './me.subservice';
import { UserRegisterSubService } from './user.register.subservice';

describe('Retrieve current logged id user with credentials', () => {
	let service: ReturnType<typeof MeSubService>;
	let context: UserServiceContext;

	beforeAll(async () => {
		context = MockedUserServiceContext();
		service = MeSubService(context);
		await UserRegisterSubService(context).register({
			email: 'uSer@example.com',
			password: 'password123'
		});
	});

	it('should return the user when the user is found', async () => {
		const result = await service.getMe();

		expect(result.id).toBeDefined();
	});

	it('should throw an error when the user is not found by the auth provider', () => {
		const spy = spyOn(context.providers.authProvider, 'getMe').mockImplementation(() => {
			return Promise.resolve(null);
		});

		const fn = () => service.getMe();
		expect(fn).toThrow(Error('user:not-found'));
		spy.mockRestore();
	});

	it('should throw an error when the user is found by provider but not the repo', () => {
		const spy = spyOn(context.repositories.userRepository, 'findById').mockImplementation(() => {
			return Promise.resolve(null);
		});

		const fn = () => service.getMe();
		expect(fn).toThrow(Error('user:not-found'));
		spy.mockRestore();
	});

	it('should throw an error when the auth provider throws', () => {
		const spy = spyOn(context.providers.authProvider, 'getMe').mockImplementation(() => {
			throw Error('You got banned 😱');
		});

		const fn = () => service.getMe();
		expect(fn).toThrow(Error('user:not-found'));
		spy.mockRestore();
	});
	it('should throw an error when the user repository throws', () => {
		const spy = spyOn(context.repositories.userRepository, 'findById').mockImplementation(() => {
			throw Error('Database is down ❌');
		});

		const fn = () => service.getMe();
		expect(fn).toThrow(Error('user:not-found'));
		spy.mockRestore();
	});
});
