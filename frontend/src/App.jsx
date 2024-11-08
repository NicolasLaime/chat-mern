import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Router, Routes } from "react-router-dom";
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Home from './pages/home/Home';
import { VerifyUser } from './utils/VerifyUser';

const App = () => {
  return (
    <div className="tp-2 w-screen h-screen flex items-center justify-center">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<VerifyUser/>}>
          <Route path='/' element={<Home/>}/>
        </Route>
      </Routes>
      <ToastContainer /> {/* Asegúrate de incluir este componente */}
    </div>
  )
}

export default App;
