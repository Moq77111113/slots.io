import { LoginUserAction } from '#/application/actions';
import type { AppContext } from '#/application/context';

import type { LayoutServerLoad } from './$types';

const forceAuth = async (context: AppContext) => {
	const Login = LoginUserAction(context);
	const result = await Login.execute({
		email: 'quentin.moessner+foo@gmail.com',
		password: 'B1fadba5'
	});

	return { me: result };
};
export const load: LayoutServerLoad = async ({ locals }) => {
	const { context } = locals;
	const { me } = await forceAuth(context);
	return { me };
};
