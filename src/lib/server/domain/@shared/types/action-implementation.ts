import type { Action as ActionSchape } from '$domain/@shared';

export type ActionImplementation<Action extends ActionSchape<unknown, unknown>> = (
	...args: unknown[]
) => Action;
