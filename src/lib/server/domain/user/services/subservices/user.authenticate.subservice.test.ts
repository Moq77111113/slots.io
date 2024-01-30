import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import type { User } from '$domain/user/models';

import { MockedUserServiceContext } from '../mocks/context.mock';
import type { UserServiceContext } from '../types';
import { UserAuthenticateSubService } from './user.authenticate.subservice';
import { UserRegisterSubService } from './user.register.subservice';

describe('Register user with credentials', () => {
	let service: ReturnType<typeof UserAuthenticateSubService>;
	let context: UserServiceContext;

	beforeAll(async () => {
		context = MockedUserServiceContext();
		service = UserAuthenticateSubService(context);
		await UserRegisterSubService(context).register({
			email: 'uSer@example.com',
			password: 'password123'
		});
	});

	it('should return the user if the credentials are correct', async () => {
		const input = {
			email: 'uSer@example.com',
			password: 'password123'
		};

		const loggedIn = await service.authenticate(input);

		expect(loggedIn.email).toBe('user@example.com');
		expect(loggedIn.id).toBeDefined();
		expect('password' in loggedIn).toBe(false);
	});

	it('should throw an user_not_found domain Error if the user does not exist', () => {
		const input = {
			email: 'foo@bar.com',
			password: 'password123'
		};
		const fn = () => service.authenticate(input);

		expect(fn).toThrow(Error('user:not-found'));
	});
	it('should throw a password_not_set domain Error if the user does not have a password ', () => {
		const input = {
			email: 'foo@bar.com',
			password: 'password123'
		};
		const spy = spyOn(context.repositories.userRepository.findBy, 'email').mockImplementation(() =>
			Promise.resolve({
				id: 'foo',
				email: 'foo@bar.com'
			} as User)
		);

		const fn = () => service.authenticate(input);

		expect(fn).toThrow(Error('user:password-not-set'));
		spy.mockRestore();
	});

	it('should throw an invalid_credentials domain Error if port invalidate credentials', () => {
		const input = {
			email: 'uSer@example.com',
			password: 'password321'
		};
		const spy = spyOn(
			context.providers.authProvider,
			'authenticateWithCredentials'
		).mockImplementation(() => {
			throw Error('Bad guy, the password does not match 👿');
		});
		const fn = () => service.authenticate(input);

		expect(fn).toThrow(Error('user:invalid-credentials'));
		spy.mockRestore();
	});
});
