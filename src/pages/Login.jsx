import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import Seo from '../seo/Seo.jsx'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const redirectTo = location.state?.from ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    setError('')
    login(email)
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="page page-narrow">
      <Seo
        title="Log in"
        description="Sign in to reach the private dashboard."
        noindex
        nofollow
      />

      <h1>Log in</h1>
      <p className="lead">Any email and a password of 4+ characters works in this demo.</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="••••••"
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block">
          Log in
        </button>
      </form>
    </section>
  )
}
