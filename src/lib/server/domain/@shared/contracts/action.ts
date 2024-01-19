import type { MaybePromise } from '$domain/@shared/types/promise';

export interface Action<Inputs extends unknown[], Output> {
	execute(...input: Inputs): MaybePromise<Output>;
}
