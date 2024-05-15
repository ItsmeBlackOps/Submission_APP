import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContent'

const PrivateRoutes = () => {
    const {user} = useAuth()

    return user ? <Outlet/> : <Navigate to="/"/>
}

export default PrivateRoutes