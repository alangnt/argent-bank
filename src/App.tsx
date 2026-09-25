import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home.jsx'
import SignIn from './pages/SignIn.jsx'
import User from './pages/User.jsx'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchProfile, selectUser } from './features/auth/authSlice'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)
  const user = useAppSelector(selectUser)

  // On load/refresh: if a token was persisted but the profile isn't loaded yet,
  // restore the session by fetching the profile.
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile())
    }
  }, [token, user, dispatch])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<User />} />
        </Route>
        {/* Legacy paths from the static mock-up */}
        <Route path="sign-in" element={<Navigate to="/login" replace />} />
        <Route path="user" element={<Navigate to="/profile" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
