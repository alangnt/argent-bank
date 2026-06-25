// Shapes returned by / sent to the Argent Bank API (http://localhost:3001).

/** Every endpoint wraps its payload in this envelope. */
export interface ApiResponse<T> {
  status: number
  message: string
  body: T
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

export interface SignupPayload {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type LoginPayload = Pick<SignupPayload, 'email' | 'password'>

export interface AuthToken {
  token: string
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
}
