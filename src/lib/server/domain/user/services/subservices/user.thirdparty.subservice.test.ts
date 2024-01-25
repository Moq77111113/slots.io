import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import { MockedUserServiceContext } from '../mocks/context.mock';
import type { UserServiceContext } from '../types';
import { UserRegisterSubService } from './user.register.subservice';
import { UserThirdPartyService } from './user.thirdparty.subservice';

describe('Register user with third party', () => {
	let service: ReturnType<typeof UserThirdPartyService>;
	let context: UserServiceContext;

	beforeAll(async () => {
		context = MockedUserServiceContext();
		service = UserThirdPartyService(context);
		await UserRegisterSubService(context).register({
			email: 'uSer@example.com',
			password: 'password123'
		});
	});

	describe('generateAuthRequest', () => {
		it('should throw a provider_not_enabled Domain Error if the provider is not enabled', () => {
			const fn = () => service.generateThirdPartyRequest('facebook');
			expect(fn).toThrow(Error('user:provider-not-enabled'));
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
				'generateThirdPartyRequest'
			).mockImplementation(() => {
				return Promise.resolve(expected);
			});

			const request = await service.generateThirdPartyRequest('mock-provider');
			expect(request).toEqual(expected);
			spy.mockRestore();
		});
	});

	describe('authenticateWithOAuth2', () => {
		it('should throw if the provider is not registered', () => {
			const fn = () =>
				service.authOrRegisterWithThirdParty('google', {
					code: 'invalid-code',
					codeVerifier: 'code-verifier',
					sourceUrl: 'https://example.com/auth'
				});
			expect(fn).toThrow(Error('user:provider-not-enabled'));
		});

		it('should throw an oauth_failed error if something went wrong', () => {
			const providerSpy = spyOn(
				context.infrastructure.authInfrastructure,
				'getProviders'
			).mockImplementation(() => ['nasa']);
			const authSpy = spyOn(
				context.infrastructure.authInfrastructure,
				'authOrRegisterWithThirdParty'
			).mockImplementation(() => {
				throw Error('The provided code is not secure, that is not good 😱');
			});
			const fn = () =>
				service.authOrRegisterWithThirdParty('nasa', {
					code: 'foo',
					codeVerifier: 'bar',
					sourceUrl: 'https://example.com/auth'
				});

			expect(fn).toThrow(Error('user:oauth-failed'));
			providerSpy.mockRestore();
			authSpy.mockRestore();
		});
		it('should return an new user with lastLogin if everything works', async () => {
			const providerSpy = spyOn(
				context.infrastructure.authInfrastructure,
				'getProviders'
			).mockImplementation(() => ['google', 'github', 'nasa']);
			const authSpy = spyOn(
				context.infrastructure.authInfrastructure,
				'authOrRegisterWithThirdParty'
			).mockImplementation(async (args) => {
				const usr = await context.repositories.userRepository.create({
					email: 'from-oauth@example.com',
					locale: 'en_GB',
					language: {
						code: 'en'
					},
					status: 'active',
					thirdPartyAccounts: [
						{
							provider: args.provider,
							accountId: `generated-${args.provider}`
						}
					],
					notificationsChannel: [],
					lastLogin: null
				});
				return usr.id;
			});
			const user = await service.authOrRegisterWithThirdParty('google', {
				code: 'aSuperSecureCode',
				codeVerifier: 'code-verifier',
				sourceUrl: 'https://example.com/auth'
			});
			expect(user.email).toBe('from-oauth@example.com');
			expect(user.lastLogin).not.toBeNull();
			expect(user.id).toBeDefined();
			authSpy.mockRestore();
			providerSpy.mockRestore();
		});
	});
});
