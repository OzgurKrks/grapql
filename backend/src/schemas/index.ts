import { gql } from 'apollo-server-express';
import userTypeDefs from './user.schema';
import postTypeDefs from './post.schema';

// Base schema
const baseTypeDefs = gql`
  type Query {
    _: Boolean
  }
  
  type Mutation {
    _: Boolean
  }
`;

// Tüm şemaları birleştir
export const typeDefs = [baseTypeDefs, userTypeDefs, postTypeDefs];

export default typeDefs; 