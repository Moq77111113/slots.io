type SharedContext = Record<string, never>;

export type ActionContext = {
	shared: SharedContext;
};
