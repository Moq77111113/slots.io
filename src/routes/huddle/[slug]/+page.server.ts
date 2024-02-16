import { type Huddle, makeHuddleId, makeSlotId, type Slot } from '$domain/huddle/models';
import { makeUserId, type User } from '$domain/user/models';

import type { PageServerLoad } from './$types';

const createUser = (name: string): User => ({
	id: makeUserId((Math.random() * 10 * Math.random() * 100).toString()),
	email: `${name.toLowerCase()}@gmail.com`,
	lastLogin: new Date(),
	status: 'active',
	notificationsChannel: [],
	thirdPartyAccounts: [],
	language: {
		code: 'fr'
	},
	locale: 'fr_FR',
	createdAt: new Date(),
	updatedAt: new Date()
});

const users = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'].map(createUser);

const createSlot = (date: Date): Slot => ({
	id: makeSlotId(`slot-id-${date.getTime()}`),
	start: date,
	end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
	availabilities: users.map((_) => ({
		userId: _.id,
		user: _,
		status: Math.random() > 0.5 ? 'available' : Math.random() > 0.5 ? 'unavailable' : 'maybe'
	})),
	createdAt: new Date(),
	updatedAt: new Date()
});

const addDays = (date: Date, days: number) => {
	const copy = new Date(Number(date));
	copy.setDate(date.getDate() + days);
	return copy;
};

const fakeHuddle = (): Huddle => ({
	id: makeHuddleId('fake-huddle-id'),
	title: 'Birthday Party',
	description: 'Come celebrate my birthday !',
	creatorId: users[0].id,
	creator: users[0],
	slots: [new Date(), addDays(new Date(), 1), addDays(new Date(), 5), addDays(new Date(), 6)].map(
		createSlot
	),
	locked: false,
	participantIds: [],
	participants: users.slice(1),
	createdAt: new Date(),
	updatedAt: new Date()
});

export const load: PageServerLoad = () => {
	return {
		huddle: fakeHuddle()
	};
};
