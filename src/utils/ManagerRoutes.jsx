// AdminRoutes.jsx

import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContent'

const ManagerRoutes = () => {
    const { user } = useAuth()

    // Check if user exists and if the user's role is 'Admin'
    return user && (user.labels.includes('Manager') || user.labels.includes('admin')) ? <Outlet/> : <Navigate to="/"/>
}

export default ManagerRoutes