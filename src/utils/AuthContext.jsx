import { createContext, useContext, useEffect, useState } from 'react'
import { ID } from 'appwrite'
import { useNavigate } from 'react-router-dom'
import { account, PROJECT_ID } from '../appwriteConfig'

const AuthContext = createContext(null)
const messageFromError = (error, fallback) => error?.message || fallback

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      if (!PROJECT_ID) {
        setLoading(false)
        return
      }
      try {
        setUser(await account.get())
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleUserLogin = async (credentials) => {
    if (!PROJECT_ID) return { success: false, error: 'Appwrite is not configured. Add your project ID to the .env file.' }
    try {
      await account.createEmailPasswordSession(credentials.email.trim(), credentials.password)
      setUser(await account.get())
      navigate('/', { replace: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: messageFromError(error, 'We could not sign you in. Please check your details.') }
    }
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
    } catch (error) {
      console.error('Unable to close the remote session:', error)
    } finally {
      setUser(null)
      navigate('/login', { replace: true })
    }
  }

  const handleRegister = async (credentials) => {
    if (!PROJECT_ID) return { success: false, error: 'Appwrite is not configured. Add your project ID to the .env file.' }
    if (credentials.password1 !== credentials.password2) return { success: false, error: 'Your passwords do not match.' }
    try {
      await account.create(ID.unique(), credentials.email.trim(), credentials.password1, credentials.name.trim())
      return { success: true }
    } catch (error) {
      return { success: false, error: messageFromError(error, 'We could not create your account. Please try again.') }
    }
  }

  if (loading) return <div className="loading-screen"><span className="loader" /><p>Opening Nexus…</p></div>

  return <AuthContext.Provider value={{ user, handleUserLogin, handleLogout, handleRegister }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export default AuthContext
