import type { Action as ActionShape } from '$domain/@shared';

export type ActionAdapter<Scenario extends ActionShape<unknown[], unknown>, Args> = (
	...args: Args[]
) => Scenario;
