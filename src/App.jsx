// import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContent'
import Header from './Pages/Header'
import Home from './Pages/Home'
import Profile from './Pages/SignUp'
import Login from './Pages/Login'
import InterviewForm from './Pages/InterviewForm'
import AdminRoutes from './utils/AdminRoutes'
import QuickFilterOutsideOfGrid from './Pages/Tasks'
// import QuickFilterInsideOfGrid from './Pages/demo'
import { StyledEngineProvider } from '@mui/material/styles';
import Candidate_List from './Pages/Candidate'
import ManagerRoutes from './utils/ManagerRoutes'
import SignUp from './Pages/SignUp'
import ReferenceFormat from './Pages/Compliance/referece'
import ComplianceRoutes from './utils/ComplianceRoutes'
import EmailTemplates from './Pages/Compliance/emailTemplates'
import Box from '@mui/joy/Box';
import Interview_List from './Pages/Interview'
import NewCandidate from './Pages/CreateCandidate'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/NewCandidate" element={<NewCandidate />} />
            <Route element={<ComplianceRoutes />}>
              <Route path="/Email" element={<ReferenceFormat />} />
              <Route path="/Templates" element={<EmailTemplates />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/form" element={<InterviewForm />} />
              <Route path="/submissions" element={<QuickFilterOutsideOfGrid />} />
              <Route path="/interviews" element={<Interview_List />} />
              <Route path="/candidate" element={<Candidate_List />} />
              <Route element={<ManagerRoutes />}>
              </Route>
            </Route>
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;