import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectIsAuthenticated } from '../features/auth/authSlice'

/** Gate for authenticated-only routes; redirects to sign-in otherwise. */
function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default ProtectedRoute
