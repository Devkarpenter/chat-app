import { useState } from 'react'
import { ArrowRight, Lock, Mail, MessageCircle, User } from 'react-feather'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const RegisterPage = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password1: '', password2: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const { handleRegister } = useAuth()
  const updateField = (event) => setCredentials({ ...credentials, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    if (credentials.password1 !== credentials.password2) {
      setStatus({ type: 'error', message: 'Your passwords do not match.' })
      return
    }
    setSubmitting(true)
    const result = await handleRegister(credentials)
    setSubmitting(false)
    if (result.success) {
      setStatus({ type: 'success', message: 'Account created successfully. You can sign in now.' })
      setCredentials({ name: '', email: '', password1: '', password2: '' })
    } else setStatus({ type: 'error', message: result.error })
  }

  const fields = [
    { name: 'name', label: 'Full name', type: 'text', placeholder: 'Your name', autoComplete: 'name', Icon: User },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email', Icon: Mail },
    { name: 'password1', label: 'Password', type: 'password', placeholder: 'At least 8 characters', autoComplete: 'new-password', Icon: Lock },
    { name: 'password2', label: 'Confirm password', type: 'password', placeholder: 'Repeat your password', autoComplete: 'new-password', Icon: Lock },
  ]

  return (
    <main className="auth-page">
      <section className="auth-visual register-visual" aria-label="Join Nexus">
        <div className="auth-brand"><MessageCircle size={22} /> Nexus</div>
        <div className="auth-hero"><span className="eyebrow">Your community is waiting</span><h1>Start talking. Keep connected.</h1><p>Create your account in a few seconds and join a simple, distraction-free conversation.</p><div className="member-stack"><span>M</span><span>J</span><span>S</span><strong>Join the conversation</strong></div></div>
        <p className="auth-footnote">Fast · Friendly · Realtime</p>
      </section>
      <section className="auth-panel">
        <div className="auth-card register-card">
          <div className="mobile-brand"><MessageCircle size={21} /> Nexus</div>
          <span className="eyebrow">Get started</span><h2>Create your account</h2><p className="auth-intro">A better conversation is one step away.</p>
          {status.message && <div className={`notice notice-${status.type}`} role="alert">{status.message}</div>}
          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label, Icon, ...field }) => <div key={name}><label className="field-label" htmlFor={name}>{label}</label><div className="input-wrap"><Icon size={18} /><input id={name} name={name} required minLength={name.includes('password') ? 8 : undefined} value={credentials[name]} onChange={updateField} {...field} /></div></div>)}
            <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'} {!submitting && <ArrowRight size={18} />}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
