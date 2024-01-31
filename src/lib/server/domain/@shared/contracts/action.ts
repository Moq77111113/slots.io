import type { MaybePromise } from '$domain/@shared/types/promise';

/**
 * @description An action is the implementation of an api port.
 */
export interface Action<Inputs extends unknown[], Output> {
	execute(...input: Inputs): MaybePromise<Output>;
}

type ActionShape<Inputs extends unknown[], Output> = Action<Inputs, Output>;

export type ActionAdapter<Action extends ActionShape<unknown[], unknown>, Args> = (
	...args: Args[]
) => Action;
