import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserLogin from './Components/UserLogin';
import UserRegister from './Components/UserRegister';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Home';
import Users from './Users';
import { BrowserRouter } from "react-router-dom";
import { useContext } from 'react';
import { userContext } from './Components/useContext';

function App() {

  const usr_data = useContext(userContext)
  // console.log("user_data........///",usr_data)
  return (
    <>
   <BrowserRouter>
   
    <Routes>
      <Route path='/' element={<UserRegister/>}/>
      <Route path='/Login' element={<UserLogin/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/home/:currentscreen' element={<Users/>}/>
    </Routes>
   </BrowserRouter>
    
    </>
  );
}

export default App;
