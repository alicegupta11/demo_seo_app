import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import JsonLd from '../seo/JsonLd.jsx'
import Seo from '../seo/Seo.jsx'
import { seoRoutes } from '../seo/routes.js'
import { webPageSchema } from '../seo/structuredData.js'

const meta = seoRoutes.find((route) => route.path === '/')

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="page">
      <Seo description={meta.description} />
      <JsonLd
        data={webPageSchema({
          title: meta.title,
          description: meta.description,
          path: meta.path,
        })}
      />

      <span className="badge">Public page</span>
      <h1>
        A tiny React demo with <span className="accent">public</span> and{' '}
        <span className="accent">private</span> routes.
      </h1>
      <p className="lead">
        Home and About are open to everyone. The Dashboard is behind a protected route, so
        visiting it without a session sends you to the login screen first.
      </p>

      <div className="cta-row">
        <Link to="/about" className="btn btn-primary">
          Read about it
        </Link>
        <Link
          to={isAuthenticated ? '/dashboard' : '/login'}
          className="btn btn-outline"
          rel="nofollow"
        >
          {isAuthenticated ? 'Open dashboard' : 'Try the private page'}
        </Link>
      </div>

      <div className="card-grid">
        <article className="card">
          <h3>Public</h3>
          <p>Home and About render for any visitor, logged in or not.</p>
        </article>
        <article className="card">
          <h3>Private</h3>
          <p>Dashboard is wrapped in a route guard that checks the auth state.</p>
        </article>
        <article className="card">
          <h3>Remembered</h3>
          <p>Your session is kept in localStorage, so a refresh keeps you signed in.</p>
        </article>
      </div>
    </section>
  )
}
