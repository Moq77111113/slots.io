import type { MaybePromise } from '$domain/@shared/types/promise';

export interface Action<Input, Output> {
	execute(input: Input): MaybePromise<Output>;
}
