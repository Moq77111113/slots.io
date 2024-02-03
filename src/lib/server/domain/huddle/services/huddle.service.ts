import { AvailabilitySubService } from './subservices/huddle.availabilities.subservice';
import { HuddleCreateSubService } from './subservices/huddle.create.subservice';
import { SlotSubService } from './subservices/huddle.slot.subservice';
import type { HuddleServiceContext } from './types';

/**

 * `HuddleService` is the domain service that handles huddle-related operations in our application.
 * It is called by the application layer through the `HuddleApi` interface.
 *
 * `HuddleService` composes several sub-services, each responsible for a specific huddle-related operation.
 * Each sub-service is initialized with the same context to ensure consistent access to shared resources.
 *
 */
export const HuddleService = (context: HuddleServiceContext) => ({
	...HuddleCreateSubService(context),
	...SlotSubService(context),
	...AvailabilitySubService(context)
});
