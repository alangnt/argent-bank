import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as userApi from '../../api/user'
import { ApiError } from '../../api/client'
import type { User } from '../../api/types'
import type { RootState } from '../../store'
import { clearStoredToken, getStoredToken, storeToken } from './tokenStorage'

interface AuthState {
  token: string | null
  user: User | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  token: getStoredToken(),
  user: null,
  status: 'idle',
  error: null
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message
  }
  return 'Something went wrong'
}

export const loginUser = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string; rememberMe: boolean },
  { rejectValue: string }
>('auth/login', async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const { token } = await userApi.login({ email, password })
    storeToken(token, rememberMe)
    const user = await userApi.getProfile(token)
    return { token, user }
  } catch (error) {
    return rejectWithValue(errorMessage(error))
  }
})

export const fetchProfile = createAsyncThunk<
  User,
  void,
  { state: RootState; rejectValue: string }
>('auth/fetchProfile', async (_, { getState, rejectWithValue }) => {
  const { token } = getState().auth
  if (!token) {
    return rejectWithValue('Not authenticated')
  }
  try {
    return await userApi.getProfile(token)
  } catch (error) {
    return rejectWithValue(errorMessage(error))
  }
})

export const updateUserProfile = createAsyncThunk<
  User,
  { firstName?: string; lastName?: string },
  { state: RootState; rejectValue: string }
>('auth/updateProfile', async (payload, { getState, rejectWithValue }) => {
  const { token } = getState().auth
  if (!token) {
    return rejectWithValue('Not authenticated')
  }
  try {
    return await userApi.updateProfile(token, payload)
  } catch (error) {
    return rejectWithValue(errorMessage(error))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearStoredToken()
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearError(state) {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Login failed'
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchProfile.rejected, state => {
        // Token is missing/invalid/expired — drop the stale session.
        clearStoredToken()
        state.token = null
        state.user = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload ?? 'Update failed'
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.token)
