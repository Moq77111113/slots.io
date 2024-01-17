import type { Action as ActionShape } from '$domain/@shared';

export type ActionImplementation<Action extends ActionShape<unknown, unknown>, Args> = (
	...args: Args[]
) => Action;
