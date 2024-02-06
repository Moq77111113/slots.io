import { makeUserId, type User } from '$domain/user/models';
import { type UserSchema, userSchema } from '$infrastructure/schemas/domain/user.schemas';
import type { SbProfile } from '$infrastructure/supabase/supabase';

import { validateData } from '../validate';

export const supabaseToDomain = (profile: SbProfile): User => {
	const [user, error] = validateData<UserSchema>(
		{
			...profile,
			language: {
				code: profile.language
			},
			status: profile.status ? 'active' : 'inactive',
			createdAt: new Date(profile.created_at),
			updatedAt: new Date(profile.updated_at || profile.created_at),
			notificationsChannel: [],
			thirdPartyAccounts: [],
			lastLogin: profile.last_login ? new Date(profile.last_login) : null
		},
		userSchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid user data');
	}
	return {
		...user,
		id: makeUserId(user.id)
	};
};
