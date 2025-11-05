
import { useEffect } from 'react'
import './App.css'
import ForgotPass from './Pages/Auth/ForgotPass'
import Login from './Pages/Auth/Login'
import SignUp from './Pages/Auth/SignUp'
import VerificationPage from './Pages/Auth/VerificationPage'
import Home from './Pages/Home/Home'
import { Route, Routes, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState } from 'recoil'
import { userData } from './atoms/state'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import { getCookie, removeCookie } from './constants/cookiesApis.js'
import axiosInstance from './constants/axiosInstance.js'
import NotFoundPage from './Pages/NotFound/NotFoundPage.jsx'

function App() {
  const [currentUserData, setUserData] = useRecoilState(userData);
  const navigate = useNavigate();
  const fetchUserData = async () => {
    try {
      const token = getCookie('authToken')
      if (token) {
        const res = await axiosInstance.get(`/user/verifyauth`)
        setUserData(res?.data?.user);
      } else {
        setUserData(null);
        navigate('/login');
      }
    } catch (error) {
      setUserData(null);
      removeCookie('authToken');
      if (error.response.data.expiredSession) {
        alert(error.response.data.message);
      }
      navigate('/login');
      console.log(error);
    }
  }


  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Routes>
      <Route path='*' element={<NotFoundPage />}></Route>
      <Route path='/' element={<Home />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signup' element={<SignUp />}></Route>
      <Route path='/forgot/password' element={<ForgotPass />}></Route>
      <Route path='/resetpassword/:token' element={<VerificationPage />}></Route>
      
      <Route path='/dashboard' element={ <Dashboard /> }>
      </Route>
      
    </Routes>

  )
}

export default App
