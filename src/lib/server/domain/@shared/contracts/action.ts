import type { MaybePromise } from '$domain/@shared/types/promise';

/**
 * @description An action is the implementation of an api port.
 */
export interface Action<Inputs extends unknown[], Output> {
	execute(...input: Inputs): MaybePromise<Output>;
}

export type ActionAdapter<Shape extends Action<unknown[], unknown>, Args> = (...args: Args[]) => Shape;
