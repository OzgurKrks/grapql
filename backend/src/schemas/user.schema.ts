import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

export default typeDefs; 