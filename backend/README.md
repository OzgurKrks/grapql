# GraphQL API with JWT Authentication

This project is a GraphQL API built with Apollo Server, Express, and MongoDB that includes JWT authentication.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected GraphQL queries and mutations
- User management

## Setup

1. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/graphql-auth-db
   JWT_SECRET=your-super-secure-jwt-secret
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Usage

### Authentication

#### Register a new user

```graphql
mutation {
  register(
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
  ) {
    token
    user {
      id
      name
      email
    }
  }
}
```

#### Login

```graphql
mutation {
  login(email: "john@example.com", password: "password123") {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Protected Queries

For protected queries, you need to include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

#### Get current user

```graphql
query {
  me {
    id
    name
    email
  }
}
```

#### Get all users (protected)

```graphql
query {
  users {
    id
    name
    email
  }
}
```
