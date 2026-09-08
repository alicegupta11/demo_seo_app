import JsonLd from '../seo/JsonLd.jsx'
import Seo from '../seo/Seo.jsx'
import { seoRoutes } from '../seo/routes.js'
import { breadcrumbSchema } from '../seo/structuredData.js'

const meta = seoRoutes.find((route) => route.path === '/about')

export default function About() {
  return (
    <section className="page">
      <Seo title={meta.title} description={meta.description} type="article" />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: meta.title, path: meta.path },
        ])}
      />

      <span className="badge">Public page</span>
      <h1>About this demo</h1>
      <p className="lead">
        A minimal React + Vite app built to show how routing and access control fit together
        with React Router.
      </p>

      <div className="card-grid">
        <article className="card">
          <h3>Routing</h3>
          <p>
            React Router v7 maps each URL to a page component, with a catch-all route for
            unknown paths.
          </p>
        </article>
        <article className="card">
          <h3>Auth state</h3>
          <p>
            A context provider holds the current user and exposes <code>login</code> and{' '}
            <code>logout</code> to the whole tree.
          </p>
        </article>
        <article className="card">
          <h3>Route guard</h3>
          <p>
            <code>ProtectedRoute</code> renders an <code>Outlet</code> when authenticated and
            redirects to login otherwise.
          </p>
        </article>
      </div>

      <table className="route-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Page</th>
            <th>Access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>/</code>
            </td>
            <td>Home</td>
            <td>
              <span className="pill pill-public">Public</span>
            </td>
          </tr>
          <tr>
            <td>
              <code>/about</code>
            </td>
            <td>About</td>
            <td>
              <span className="pill pill-public">Public</span>
            </td>
          </tr>
          <tr>
            <td>
              <code>/dashboard</code>
            </td>
            <td>Dashboard</td>
            <td>
              <span className="pill pill-private">Private</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
