import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  logout,
  selectIsAuthenticated,
  selectUser
} from '../features/auth/authSlice'

function Layout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)

  function handleLogout() {
    dispatch(logout())
    navigate('/')
  }

  return (
    <>
      <nav className="main-nav">
        <Link className="main-nav-logo" to="/">
          <img
            className="main-nav-logo-image"
            src="./img/argentBankLogo.png"
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link className="main-nav-item" to="/user">
                <i className="fa fa-user-circle"></i>
                {user?.firstName ?? 'Account'}
              </Link>
              <button
                type="button"
                className="main-nav-item main-nav-button"
                onClick={handleLogout}
              >
                <i className="fa fa-sign-out"></i>
                Sign Out
              </button>
            </>
          ) : (
            <Link className="main-nav-item" to="/sign-in">
              <i className="fa fa-user-circle"></i>
              Sign In
            </Link>
          )}
        </div>
      </nav>
      <Outlet />
      <footer className="footer">
        <p className="footer-text">Copyright 2020 Argent Bank</p>
      </footer>
    </>
  )
}

export default Layout
