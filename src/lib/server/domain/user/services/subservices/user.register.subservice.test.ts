import { beforeAll, describe, expect, it } from 'bun:test';

import { MockedUserServiceContext } from './mocks/context.mock';
import type { UserServiceContext } from '../types';
import { UserRegisterSubService } from './user.register.subservice';

describe('UserRegisterSubService', () => {
	let service: ReturnType<typeof UserRegisterSubService>;
	let context: UserServiceContext;

	beforeAll(() => {
		context = MockedUserServiceContext();
		service = UserRegisterSubService(context);
	});

	it('should register a new user', async () => {
		const user = {
			email: 'test@example.com',
			password: 'password123'
		};

		const registeredUser = await service.register(user);

		expect(registeredUser.email).toBe(user.email);
		expect(registeredUser.id).toBeDefined();
		expect('password' in registeredUser).toBe(false);
	});

	it('should throw an error if the user already exists', () => {
		const user = {
			email: 'test@example.com',
			password: 'password123'
		};

		const fn = () => service.register(user);

		expect(fn).toThrow(new Error('user:duplicated'));
	});

	it('should found duplicate case insensitive emails', () => {
		const user = {
			email: 'TeSt@EXAMPLE.com',
			password: 'password123'
		};

		const fn = () => service.register(user);

		expect(fn).toThrow(new Error('user:duplicated'));
	});
});
