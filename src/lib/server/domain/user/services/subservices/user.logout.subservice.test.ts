import { beforeAll, describe, expect, it, spyOn } from 'bun:test';

import { makeUserId } from '$domain/user/models';

import { MockedUserServiceContext } from '../mocks/context.mock';
import type { UserServiceContext } from '../types';
import { UserLogoutSubService } from './user.logout.service';
import { UserRegisterSubService } from './user.register.subservice';

describe('Logout', () => {
	let service: ReturnType<typeof UserLogoutSubService>;
	let context: UserServiceContext;

	beforeAll(async () => {
		context = MockedUserServiceContext();
		service = UserLogoutSubService(context);
		await UserRegisterSubService(context).register({
			email: 'uSer@example.com',
			password: 'password123'
		});
	});

	it('should call the port with the same userId', async () => {
		const userId = makeUserId('Bernardo');
		const spy = spyOn(context.providers.authProvider, 'logout');

		await service.logout({ userId });
		expect(spy).toHaveBeenCalledWith({ userId });
		spy.mockRestore();
	});
	it('should throw a logout_failed domain Error if the port throws', () => {
		const userId = makeUserId('Bernardo');
		const spy = spyOn(context.providers.authProvider, 'logout').mockImplementation(() => {
			throw Error(`Something went wrong during logout, you're still logged in :/`);
		});

		const fn = () => service.logout({ userId });
		expect(fn).toThrow(Error('user:logout-failed'));
		spy.mockRestore();
	});
});
