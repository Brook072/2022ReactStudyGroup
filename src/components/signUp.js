import { Link, useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form"
import useAuth from "./authContext";
import axios from "axios"

export default function SignUp(){
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const { setToken } = useAuth();
    const navigate= useNavigate();
    const onSubmit = (submitData) => {
        delete submitData.pwdCheck
        axios({
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json', 
        },
        method: 'post',
        url:"https://todoo.5xcamp.us/users",
        data:{'user':submitData}
        })
        .then((res) => {
        setToken(res.headers.authorization);
        alert('註冊成功！')
        })
        .then(()=>{
        navigate('/todo');
        })
        .catch( (err) => {
        if(err.response.status===422){
            alert(`註冊失敗:${err.response.data.error[0]}`)
        }
        })
    }
    return(
        <div id="signUpPage" className="bg-yellow">
            <div className="container signUpPage vhContainer">
                <div className="side">
                    <Link to="/"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></Link>
                    <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
                </div>
                <div>
                    <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="formControls_txt">註冊帳號</h2>
                        <label className="formControls_label" htmlFor="email">Email</label>
                        <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                        {...register("email",{
                            required:{
                            value:true,
                            message: "請輸入電子郵件"
                            },
                            pattern:{
                            value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                            message:"請輸入正確格式之電子郵件",
                            },
                        })} />
                        {<span>{errors?.email?.message}</span>}
                        <label className="formControls_label" htmlFor="name">您的暱稱</label>
                        <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱"
                        {...register("nickname",{
                            required:{
                            value:true,
                            message: "請輸入暱稱"
                            }
                        })}/>
                        {<span>{errors?.nickname?.message}</span>}
                        <label className="formControls_label" htmlFor="pwd">密碼</label>
                        <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼"
                        {...register("password",{
                            required:{
                            value:true,
                            message: "請輸入密碼"
                            },
                            minLength:{
                            value: 8,
                            message: "密碼長度最少8位"
                            }
                        })} />
                        {<span>{errors?.password?.message}</span>}
                        <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
                        <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼"
                        {...register("pwdCheck",{
                            required:{
                            value:true,
                            message: "請再次輸入密碼"
                            },
                            validate:{
                            identicalCheck:()=> getValues('password') === getValues('pwdCheck')||'所輸入密碼不一致！'
                            }
                        })} />
                        {<span>{errors?.pwdCheck?.message}</span>}
                        <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
                    </form>
                </div>
            </div>
        </div>
    )
}