import { PollCreateSubService } from './subservices/poll.create.subservice';
import type { PollServiceContext } from './types';

/**

 * `PollService` is the domain service that handles poll-related operations in our application.
 * It is called by the application layer through the `PollApi` interface.
 *
 * `PollService` composes several sub-services, each responsible for a specific poll-related operation such as creating a poll, updating a poll, etc.
 * Each sub-service is initialized with the same context to ensure consistent access to shared resources.
 *
 */
export const PollService = (context: PollServiceContext) => ({
	...PollCreateSubService(context)
});
