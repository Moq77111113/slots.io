import type { ErrorHandler } from '$domain/@shared/errors';

type SharedContext = {
	errorHandler: ErrorHandler;
};

export type ActionContext = {
	shared: SharedContext;
};
