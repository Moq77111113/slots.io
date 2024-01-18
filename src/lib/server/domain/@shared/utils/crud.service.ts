import type { BaseEntity } from '$domain/@shared/types';
import type { Repository } from '$domain/@shared/contracts/repository';

export const makeCommonCrudService = <
	Repo extends Repository<Entity, Input, Filters>,
	Entity extends BaseEntity,
	Input,
	Filters
>(
	repository: Repo
) => {
	const findOne = async (id: string) => {
		return await repository.findOne(id);
	};

	const findAll = async (filters?: Filters) => {
		return await repository.findAll(filters);
	};

	const create = async (input: Input) => {
		return await repository.create(input);
	};
	const patch = async (id: string, input: Partial<Input>) => {
		return await repository.patch(id, input);
	};

	const update = async (id: string, input: Input) => {
		return await repository.update(id, input);
	};

	const remove = async (id: string) => {
		return await repository.remove(id);
	};

	return {
		create,
		findOne,
		findAll,
		update,
		patch,
		remove
	};
};
