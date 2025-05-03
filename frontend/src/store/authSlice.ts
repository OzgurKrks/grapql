import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import client from '../apollo/client';
import { gql } from '@apollo/client';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// GraphQL Operations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, errors } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      });

      if (errors) {
        return rejectWithValue(errors[0].message);
      }

      const { token, user } = data.login;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, errors } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { name, email, password }
      });

      if (errors) {
        return rejectWithValue(errors[0].message);
      }

      const { token, user } = data.register;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Logout action
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  
  // Clear Apollo cache when logging out
  await client.resetStore();
  
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 