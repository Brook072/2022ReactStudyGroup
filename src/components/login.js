import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import useAuth from "./authContext";
import axios from "axios"

export default function Login(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const onSubmit = (submitData) => {
      axios({
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json', 
        },
        method: 'post',
        url:"https://todoo.5xcamp.us/users/sign_in",
        data:{'user':submitData}
        })
      .then((res) => {
        setToken(res.headers.authorization);
      })
      .then(()=>{
        navigate('/todo');
      })
      .catch((err) => {
        if(err.response.status===401){
          alert(err.response.data.error);
        }
      })
    }
    return (
      <div id="loginPage" className="bg-yellow">
          <div className="container loginPage vhContainer ">
              <div className="side">
                  <Link to='/'><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></Link>
                  <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
              </div>
              <div>
                  <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
                      <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
                      <label className="formControls_label" htmlFor="email">Email</label>
                      <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                        {...register("email",{
                          required:{
                            value:true,
                            message:"請輸入電子郵件"
                          },
                          pattern:{
                            value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                            message:"請輸入正確格式之電子郵件",
                          },
                        })}/>
                      {<span>{errors?.email?.message}</span>}
                      <label className="formControls_label" htmlFor="pwd">密碼</label>
                      <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼"
                      {...register("password",{
                        required:{
                          value:true,
                          message:"請輸入密碼"
                        },
                      })} />
                      {<span>{errors?.password?.message}</span>}
                      <input className="formControls_btnSubmit" type="submit" value="登入" />
                      <a className="formControls_btnLink" href="/signUp">註冊帳號</a>
                  </form>
              </div>
          </div>
      </div>
    )
  }