import type { MaybePromise } from '$domain/@shared/types/promise';

/**
 * @description An action is the implementation of an api port.
 */
export interface Action<Inputs extends unknown[], Output> {
	execute(...input: Inputs): MaybePromise<Output>;
}
