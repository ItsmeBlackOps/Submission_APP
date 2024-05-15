// AdminRoutes.jsx

import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContent'

const AdminRoutes = () => {
    const { user } = useAuth()

    // Check if user exists and if the user's role is 'Admin'
    return user && user.labels[0] === 'admin' ? <Outlet/> : <Navigate to="/"/>
}

export default AdminRoutes