import { request } from './client'
import type {
  AuthToken,
  LoginPayload,
  SignupPayload,
  UpdateProfilePayload,
  User
} from './types'

/** POST /user/signup — create an account. */
export function signup(payload: SignupPayload): Promise<User> {
  return request<User>('/user/signup', { method: 'POST', body: payload })
}

/** POST /user/login — exchange credentials for a JWT. */
export function login(payload: LoginPayload): Promise<AuthToken> {
  return request<AuthToken>('/user/login', { method: 'POST', body: payload })
}

/** POST /user/profile — fetch the authenticated user's profile. */
export function getProfile(token: string): Promise<User> {
  return request<User>('/user/profile', { method: 'POST', token })
}

/** PUT /user/profile — update the authenticated user's first/last name. */
export function updateProfile(
  token: string,
  payload: UpdateProfilePayload
): Promise<User> {
  return request<User>('/user/profile', { method: 'PUT', body: payload, token })
}
