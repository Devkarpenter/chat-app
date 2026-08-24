import { useEffect, useState } from 'react'
import { ArrowRight, Lock, Mail, MessageCircle } from 'react-feather'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const LoginPage = () => {
  const { user, handleUserLogin } = useAuth()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [navigate, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await handleUserLogin(credentials)
    if (!result.success) setError(result.error)
    setSubmitting(false)
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Nexus community chat">
        <div className="auth-brand"><MessageCircle size={22} /> Nexus</div>
        <div className="auth-hero">
          <span className="eyebrow">One room. Real conversations.</span>
          <h1>Stay close to the people who matter.</h1>
          <p>A focused, friendly space for your community to talk, share, and keep moving together.</p>
          <div className="message-preview"><span className="avatar avatar-purple">A</span><div><strong>Alex</strong><p>Glad you made it — the conversation just started 👋</p></div></div>
        </div>
        <p className="auth-footnote">Private by design · Realtime by default</p>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand"><MessageCircle size={21} /> Nexus</div>
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your account</h2>
          <p className="auth-intro">Pick up right where you left off.</p>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">Email address</label>
            <div className="input-wrap"><Mail size={18} /><input id="email" required autoComplete="email" type="email" placeholder="you@example.com" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} /></div>
            <label className="field-label" htmlFor="password">Password</label>
            <div className="input-wrap"><Lock size={18} /><input id="password" required minLength="8" autoComplete="current-password" type="password" placeholder="Enter your password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /></div>
            <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} {!submitting && <ArrowRight size={18} />}</button>
          </form>
          <p className="auth-switch">New to Nexus? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
