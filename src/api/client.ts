import type { ApiResponse } from './types'

const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'

/** Thrown when the API responds with a non-2xx status. */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  /** Bearer token for the authenticated endpoints. */
  token?: string
}

/**
 * Issues a JSON request against the API and unwraps the `{ status, message,
 * body }` envelope, returning just `body`. Throws `ApiError` on failure.
 */
export async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  })

  const data = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || !data) {
    throw new ApiError(
      data?.message ?? response.statusText ?? 'Request failed',
      response.status
    )
  }

  return data.body
}
