import type { MaybePromise } from '$domain/@shared';
import type { HashPasswordDto } from '$domain/user/dtos/in/authentication.input';

export type HashCommand = {
	generateSalt: () => MaybePromise<string>;
	hashPassword: (args: HashPasswordDto) => MaybePromise<string>;
	comparePassword: (password: string, hashedPassword: string) => MaybePromise<boolean>;
};

/**
 * Currently is is not used
 */
export type HashInfrastructure = HashCommand;
