import { type Branded, make } from '$brand';
import type { Entity, Language, Locale } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { NotificationChannel, UserStatus } from '$domain/user/attributes';

export type UserId = Branded<string, 'UserId'>;

const assertsUserId = (id: string): asserts id is UserId => {
	if (typeof id !== 'string') throw new Error('Invalid person id');
};

export const makeUserId = (id: string) => make(id, assertsUserId);

/**
 * @description Aggregate root entity representing a user.
 */
export type User = Entity<
	UserId,
	{
		email: string;
		notificationsChannel: NotificationChannel[];
		thirdPartyAccounts: ThirdPartyAccount[];
		lastLogin: Date | null;
		language: Language;
		locale: Locale;
		password?: string;
		salt?: string;
		accessToken?: string;
		status: UserStatus;
	}
>;
