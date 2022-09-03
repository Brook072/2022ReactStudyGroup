import './App.css';
import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { AuthContext } from './components/authContext';
import Login from './components/login';
import SignUp from './components/signUp'
import LoginCheck from './components/loginCheck';
import ToDoList from './components/todolist';

function App() {
  const [token,setToken] = useState(null)
  return (
    <AuthContext.Provider value={{token,setToken}}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route element={<LoginCheck />}>
          <Route path="/todo" element={<ToDoList />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}
export default App;
