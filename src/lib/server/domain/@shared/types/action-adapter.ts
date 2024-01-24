import type { Action as ActionShape } from '$domain/@shared';

export type ActionAdapter<Action extends ActionShape<unknown[], unknown>, Args> = (
	...args: Args[]
) => Action;
