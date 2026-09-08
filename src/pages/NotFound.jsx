import { Link } from 'react-router-dom'
import Seo from '../seo/Seo.jsx'

export default function NotFound() {
  return (
    <section className="page page-narrow">
      <Seo title="Page not found" description="That page does not exist." noindex />

      <h1>404</h1>
      <p className="lead">That page does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
    </section>
  )
}
