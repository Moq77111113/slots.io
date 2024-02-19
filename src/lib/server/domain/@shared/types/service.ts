import type { ErrorHandler } from '#/domain/@shared/errors';

type SharedContext = {
	errorHandler: ErrorHandler;
};

export type ServiceContext = {
	shared: SharedContext;
};
