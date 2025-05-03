import { merge } from 'lodash';
import userResolvers from './user.resolver';
import postResolvers from './post.resolver';

// Tüm resolver'ları birleştir
const resolvers = merge({}, userResolvers, postResolvers);

export default resolvers; 