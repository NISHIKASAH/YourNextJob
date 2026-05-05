import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import axios from 'axios'
import {useDispatch} from "react-redux";
import { setUserData } from './redux/userSlice.js'
import InterviewPage  from "./pages/InterviewPage.jsx"


export const ServerUrl  = "http://localhost:8000"
const App = () => {
const dispatch = useDispatch();

  useEffect(()=>{
    const  getUser = async()=>{
      try{
         const result =  await axios.get(ServerUrl + "/api/user/current-user" , {
        withCredentials : true
      });
      dispatch(setUserData(result.data));

      console.log(result.data);
      }catch(err){
        console.log(err);
      }
    }
    getUser();

  } , [])
  return (
   <Routes>
    <Route  path='/' element= {<Home/>} />
    <Route path='/auth' element={<Auth/>} />
    <Route path='/interview' element={<InterviewPage/>}/>
   </Routes>
  )
}

export default App
