import type { MaybePromise } from '$domain/@shared/types/promise';

export interface Scenario<Inputs extends unknown[], Output> {
	execute(...input: Inputs): MaybePromise<Output>;
}
