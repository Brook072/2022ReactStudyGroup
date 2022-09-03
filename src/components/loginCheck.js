import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./authContext";

export default function LoginCheck(){
    const { token } = useAuth();
    if(!token){
      return (
        <Navigate to='/' replace />
      )
    }else{
      return <Outlet />
    }
  }