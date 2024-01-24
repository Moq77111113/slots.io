import { beforeAll, describe, expect, it } from 'bun:test';

import { MockedUserServiceContext } from '../mocks/context.mock';
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

	it('should throw an error if the user already exists', async () => {
		const user = {
			email: 'test@example.com',
			password: 'password123'
		};

		const error = await service
			.register(user)
			.then(() => null)
			.catch((e) => e instanceof Error && e);

		expect(error).toEqual(new Error('An user with email test@example.com already exists'));
	});
});
