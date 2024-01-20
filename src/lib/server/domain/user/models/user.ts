import type { Branded } from '$brand';
import type { Entity, Locale, Language } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { NotificationChannel } from '../attributes/notification-channel';

export type UserId = Branded<string, 'UserId'>;

export type User = Entity<
	UserId,
	{
		username: string;
		email: string;
		notificationsChannel: NotificationChannel[];
		thirdPartyAccounts: ThirdPartyAccount[];
		timeZone: unknown; // TODO: replace by TimeZoneId
		lastLogin: Date | null;
		language: Language;
		locale: Locale;
	}
>;
