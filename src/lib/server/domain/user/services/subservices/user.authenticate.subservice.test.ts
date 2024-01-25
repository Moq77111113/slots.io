import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import type { User } from '$domain/user/models';

import { MockedUserServiceContext } from '../mocks/context.mock';
import type { UserServiceContext } from '../types';
import { UserAuthenticateSubService } from './user.authenticate.subservice';
import { UserRegisterSubService } from './user.register.subservice';

describe('UserRegisterSubService', () => {
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

	describe('with credentials', () => {
		it('should return the user if the credentials are correct', async () => {
			const input = {
				email: 'uSer@example.com',
				password: 'password123'
			};

			const loggedIn = await service.authenticateWithCredentials(input);

			expect(loggedIn.email).toBe('user@example.com');
			expect(loggedIn.id).toBeDefined();
			expect('password' in loggedIn).toBe(false);
		});

		it('should throw an user_not_found domain Error if the user does not exist', () => {
			const input = {
				email: 'foo@bar.com',
				password: 'password123'
			};
			const fn = () => service.authenticateWithCredentials(input);

			expect(fn).toThrow(Error('User not found'));
		});
		it('should throw a password_not_set domain Error if the user does not have a password ', () => {
			const input = {
				email: 'foo@bar.com',
				password: 'password123'
			};
			const spy = spyOn(context.repositories.userRepository.findBy, 'email').mockImplementation(
				() =>
					Promise.resolve({
						id: 'foo',
						email: 'foo@bar.com'
					} as User)
			);

			const fn = () => service.authenticateWithCredentials(input);

			expect(fn).toThrow(Error('User password is not set'));
			spy.mockRestore();
		});

		it('should throw an invalid_credentials domain Error if port invalidate credentials', () => {
			const input = {
				email: 'uSer@example.com',
				password: 'password321'
			};
			const spy = spyOn(
				context.infrastructure.authInfrastructure,
				'authenticateWithCredentials'
			).mockImplementation(() => {
				throw new Error('Bad guy, the password does not match 👿');
			});
			const fn = () => service.authenticateWithCredentials(input);

			expect(fn).toThrow(Error('Invalid credentials'));
			spy.mockRestore();
		});
	});

	describe('oauth', () => {
		describe('generateAuthRequest', () => {
			it('should throw an error if the provider is not enabled', () => {
				const fn = () => service.generateAuthRequest('this-one-does-not-exist');
				expect(fn).toThrow(Error('The provider this-one-does-not-exist is not enabled'));
			});

			it('should return an auth request for a valid provider', async () => {
				const expected = {
					authUrl: 'https://example.com/auth',
					codeVerifier: 'code-verifier',
					provider: 'mock-provider',
					request: 'request',
					state: 'state'
				};
				const spy = spyOn(
					context.infrastructure.authInfrastructure,
					'generateAuthRequest'
				).mockImplementation(() => {
					return Promise.resolve(expected);
				});

				const request = await service.generateAuthRequest('mock-provider');
				expect(request).toEqual(expected);
				spy.mockRestore();
			});
		});
	});
});
