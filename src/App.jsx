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
function App() {

  return (
    <Router>
      
        <AuthProvider>
          <Header/>
          
          <Routes>
            <Route path="/login" element={<Login/>}/>
            {/* <Route path="/register" element={<Register/>}/> */}
              <Route path="/" element={<Home/>}/>
              <Route path="/SignUp" element={<SignUp/>}></Route>
            <Route element={<ComplianceRoutes/>}>  
            <Route path='/Email' element= {<ReferenceFormat/>}/>
            <Route path='/Templates' element= {<EmailTemplates/>}/>
            </Route>
            <Route element={<PrivateRoutes />}>

              <Route path="/profile" element={<Profile/>}/>
              <Route path="/form" element={<InterviewForm/>}/>
              <Route path="/tasks" element={<QuickFilterOutsideOfGrid/>}/>
              <Route path="/candidate" element={<Candidate_List/>}/>
              <Route element={<ManagerRoutes />}> 


              
            </Route>
            </Route>
          </Routes>
        </AuthProvider>
    </Router>
  )
}


const StyledQuickFilterInsideOfGrid = () => (
  <StyledEngineProvider injectFirst>
    <QuickFilterInsideOfGrid />
  </StyledEngineProvider>
);

export default App