import { LogOut, MessageCircle } from 'react-feather'
import { useAuth } from '../utils/AuthContext'

const Header = () => {
  const { user, handleLogout } = useAuth()
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true"><MessageCircle size={20} /></span>
        <div><p className="brand-name">Nexus</p><p className="brand-subtitle">Community chat</p></div>
      </div>
      <div className="profile">
        <span className="avatar" aria-hidden="true">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
        <div className="profile-copy"><strong>{user?.name || 'User'}</strong><span><i className="online-dot" /> Online</span></div>
        <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out" title="Log out"><LogOut size={19} /></button>
      </div>
    </header>
  )
}

export default Header
