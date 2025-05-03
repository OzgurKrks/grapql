import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    post(id: ID!): Post
    posts: [Post]
    myPosts: [Post]
  }

  extend type Mutation {
    createPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
  }
`;

export default typeDefs; 