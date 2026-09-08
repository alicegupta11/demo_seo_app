import { useAuth } from '../auth/AuthContext.jsx'
import Seo from '../seo/Seo.jsx'

const stats = [
  { label: 'Projects', value: '12' },
  { label: 'Open tasks', value: '37' },
  { label: 'Team members', value: '5' },
  { label: 'Uptime', value: '99.9%' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <section className="page">
      <Seo title="Dashboard" description="Your private dashboard." noindex nofollow />

      <span className="badge badge-private">Private page</span>
      <h1>Welcome back, {user.name}</h1>
      <p className="lead">
        You are signed in as <code>{user.email}</code>. Log out and come back to this URL to
        see the redirect in action.
      </p>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
