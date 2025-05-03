import User, { IUser } from '../models/User';
import { Context } from '../utils/context';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import Post from '../models/Post';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      return User.findById(context.user.id);
    },
    
    users: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      return User.find({});
    }
  },
  
  Mutation: {
    register: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new ApolloError('User already exists with this email', 'USER_ALREADY_EXISTS');
        }
        
        const hashedPassword = await hashPassword(password);
        
        const user = await User.create({
          name,
          email,
          password: hashedPassword
        });
        
        const token = generateToken(user);
        
        return {
          token,
          user
        };
      } catch (error) {
        throw new ApolloError('Registration failed', 'REGISTRATION_FAILED');
      }
    },
    
    login: async (_: any, { email, password }: { email: string, password: string }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Invalid email or password');
        }
        
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
          throw new AuthenticationError('Invalid email or password');
        }
        
        const token = generateToken(user);
        
        return {
          token,
          user
        };
      } catch (error) {
        throw new AuthenticationError('Invalid email or password');
      }
    }
  },

  User: {
    posts: async (parent: IUser) => {
      return Post.find({ author: parent.id });
    }
  }
};

export default resolvers; 