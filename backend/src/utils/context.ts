import { Request } from 'express';
import { getUser } from './auth';

export interface Context {
  user: any | null;
  req: Request;
}

export const createContext = ({ req }: { req: Request }): Context => {
  const token = req.headers.authorization || '';
  
  const user = getUser(token);
  
  return { user, req };
}; 