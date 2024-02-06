import { supabaseToDomain as huddleToDomain } from './huddle.mapper';
import { supabaseToDomain as userToDomain } from './user.mapper';

export const supabaseToDomain = {
	user: userToDomain,
	huddle: huddleToDomain
};
