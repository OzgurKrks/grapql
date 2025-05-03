import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = "secret";

// Generate JWT token
export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Context function for Apollo Server
export const getUser = (token: string): any => {
  if (!token) return null;
  
  try {
    // Remove "Bearer " prefix if present
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
    return verifyToken(tokenValue);
  } catch (error) {
    return null;
  }
}; 