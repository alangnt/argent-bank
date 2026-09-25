import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearError, loginUser, selectAuth } from '../features/auth/authSlice'

function SignIn() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, status, error } = useAppSelector(selectAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Already signed in → skip the form.
  useEffect(() => {
    if (token) {
      navigate('/profile')
    }
  }, [token, navigate])

  // Drop any stale error message when leaving the page.
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await dispatch(loginUser({ email, password, rememberMe }))
    if (loginUser.fulfilled.match(result)) {
      navigate('/profile')
    }
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>
          <div className="input-remember">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={event => setRememberMe(event.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          {error && (
            <p className="sign-in-error" style={{ color: '#cc0000' }}>
              {error}
            </p>
          )}

          <button
            className="sign-in-button"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default SignIn
