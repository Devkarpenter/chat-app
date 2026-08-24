import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const PrivateRoutes = () => {
  const { user } = useAuth()
  const location = useLocation()
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoutes
