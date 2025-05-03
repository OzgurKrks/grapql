import Post, { IPost } from '../models/Post';
import { Context } from '../utils/context';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import mongoose from 'mongoose';

export const resolvers = {
  Query: {
    post: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Bu işlem için giriş yapmalısınız');
      }
      
      return Post.findById(id).populate('author');
    },
    
    posts: async () => {
      return Post.find().populate('author').sort({ createdAt: -1 });
    },
    
    myPosts: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Bu işlem için giriş yapmalısınız');
      }
      
      return Post.find({ author: context.user.id }).populate('author').sort({ createdAt: -1 });
    }
  },
  
  Mutation: {
    createPost: async (_: any, { title, content }: { title: string, content: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Post oluşturmak için giriş yapmalısınız');
      }
      
      try {
        // Post oluştur
        const newPost = await Post.create({
          title,
          content,
          author: context.user.id
        });
        
        // Oluşturulan postu ID ile bul ve author alanını populate et
        const populatedPost = await Post.findById(newPost._id).populate('author');
        
        if (!populatedPost) {
          throw new ApolloError('Post oluşturuldu fakat getirilemedi', 'POST_FETCH_FAILED');
        }
        
        return populatedPost;
      } catch (error) {
        console.error('Post oluşturma hatası:', error);
        throw new ApolloError('Post oluşturulurken bir hata oluştu', 'POST_CREATION_FAILED');
      }
    },
    
    updatePost: async (_: any, { id, title, content }: { id: string, title?: string, content?: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Post güncellemek için giriş yapmalısınız');
      }
      
      try {
        const post = await Post.findById(id);
        
        if (!post) {
          throw new ApolloError('Post bulunamadı', 'POST_NOT_FOUND');
        }
        
        const authorId = post.author as unknown as mongoose.Types.ObjectId | string;
        
        if (authorId.toString() !== context.user.id) {
          throw new AuthenticationError('Bu postu güncelleme yetkiniz yok');
        }
        
        const updateData: { title?: string, content?: string } = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).populate('author');
        
        return updatedPost;
      } catch (error) {
        if (error instanceof ApolloError || error instanceof AuthenticationError) {
          throw error;
        }
        throw new ApolloError('Post güncellenirken bir hata oluştu', 'POST_UPDATE_FAILED');
      }
    },
    
    deletePost: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Post silmek için giriş yapmalısınız');
      }
      
      try {
        const post = await Post.findById(id);
        
        if (!post) {
          throw new ApolloError('Post bulunamadı', 'POST_NOT_FOUND');
        }
        
        const authorId = post.author as unknown as mongoose.Types.ObjectId | string;
        
        if (authorId.toString() !== context.user.id) {
          throw new AuthenticationError('Bu postu silme yetkiniz yok');
        }
        
        await Post.findByIdAndDelete(id);
        
        return true;
      } catch (error) {
        if (error instanceof ApolloError || error instanceof AuthenticationError) {
          throw error;
        }
        throw new ApolloError('Post silinirken bir hata oluştu', 'POST_DELETE_FAILED');
      }
    }
  },
  
  Post: {
    id: (parent: any) => parent._id || parent.id,
    author: async (parent: any) => {
      if (parent.author && typeof parent.author !== 'string' && parent.author._id) {
        return parent.author;
      }
      
      const post = await Post.findById(parent._id || parent.id).populate('author');
      return post?.author;
    }
  }
};

export default resolvers; 