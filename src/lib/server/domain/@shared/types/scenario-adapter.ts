import type { Scenario as ScenarioShape } from '$domain/@shared';

export type ScenarioAdapter<Scenario extends ScenarioShape<unknown[], unknown>, Args> = (
	...args: Args[]
) => Scenario;
