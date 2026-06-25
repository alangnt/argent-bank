const TOKEN_KEY = 'argentbank_token'

/** Reads the persisted JWT from local (remembered) or session storage. */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

/**
 * Persists the JWT. `remember` chooses localStorage (survives browser restart)
 * over sessionStorage (cleared when the tab closes).
 */
export function storeToken(token: string, remember: boolean): void {
  clearStoredToken()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

/** Removes the JWT from both storages. */
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
