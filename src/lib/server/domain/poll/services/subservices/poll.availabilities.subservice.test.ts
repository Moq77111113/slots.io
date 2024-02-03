import { beforeAll, describe } from 'bun:test';

import type { PollServiceContext } from '../types';
import { MockedPollContext } from './mocks/context.mock';
import { AvailabilitySubService } from './poll.availabilities.subservice';

describe('Slots availabilites ', () => {
	let service: ReturnType<typeof AvailabilitySubService>;
	let context: PollServiceContext;

	beforeAll(() => {
		context = MockedPollContext();
		service = AvailabilitySubService(context);
	});
});
