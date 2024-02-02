import { makeUserId, type User } from '$domain/user/models';
import type { MeApi } from '$domain/user/ports/api/user.api';

export const MockedMeApi = (): MeApi => {
	const getMe = (): User => {
		return {
			id: makeUserId('me'),
			email: 'me@myapp.com',
			notificationsChannel: [],
			thirdPartyAccounts: [],
			lastLogin: null,
			language: {
				code: 'fr'
			},
			locale: 'fr_FR',
			status: 'active',
			createdAt: new Date(2024, 0, 1),
			updatedAt: new Date(2024, 1, 1)
		};
	};

	return {
		getMe
	};
};
