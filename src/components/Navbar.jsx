import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        Demo<span>App</span>
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        {/* Private destination: keep crawlers from following it. */}
        <NavLink to="/dashboard" rel="nofollow">
          Dashboard
        </NavLink>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-primary" rel="nofollow">
            Log in
          </NavLink>
        )}
      </div>
    </header>
  )
}
