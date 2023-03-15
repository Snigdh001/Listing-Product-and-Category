import React, { useState } from 'react'
import './css/Login.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { loginUser } from '../auth'
import { Navigate, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
   const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{1,5}$/i;
   const  passregex = /^[A-Za-z0-9!@#$%^&*()_]{6,16}$/i;
  const [Error, setError] = useState({ email: "", password: ""});
  const checkEmail = (email: string) => {
    if (email === "") {
        
        setError((prevState) => { return { ...prevState, "email": "Email is Required" } })
        return false
    }
    else {
        if (emailregex.test(email) === false) {
            setError((prevState) => { return { ...prevState, "email": "Please Enter Valid Email (abc@xyz.com)" } })
            return false;
        }
        else {
          setError((prevState) => { return { ...prevState, "email": "" } })
            return true;
        }
    }
  }
  const checkPass = (password: string) => {
    if (password === "") {
        
        setError((prevState) => { return { ...prevState, "password": "password is Required" } })
        return false
    }
    else {
        if (passregex.test(password) === false) {
            setError((prevState) => { return { ...prevState, "password": "Please Enter Valid password (min 6 digits" } })
            return false;
        }
        else {
          setError((prevState) => { return { ...prevState, "password": "" } })
            return true;
        }
    }
  }
  const login = async (e: any) => {
    e.preventDefault()

    const formdata = new FormData(e.currentTarget)
    const data = {
      email: formdata.get('email') as string,
      password: formdata.get('password') as string,
    }
    if(checkEmail(data.email)&& checkPass(data.password))
    {

      const result = await loginUser(data)
      console.warn(result)
      if (result.data.messages.success === "true") {
        // console.log(result.data);
        let session = {
          id: result.data.messages.id as string,
        }
  
  
        localStorage.setItem("Session", JSON.stringify(session));
        alert("Logged In Successfully! : )");
        navigate('/user');
  
      }
      else {
        alert("Credential Not Found / Login Failed : (");
      }
    }
    else console.error("Invalid Email");
    
    

  }
  return (
    <div className='body'>
      <div className="container m-2 p-2" style={{ backgroundColor: 'yellowgreen', borderRadius: "10px", width: "30rem", height: "30rem" }}>
        <label htmlFor="Login">Login</label>
        <form action="" onSubmit={login} method="post">
          <div className="inputbody m-2 p-2 ">
            <div className='m-2 p-2'>
              <label htmlFor="Email" className='m-1 p-1'>Email</label>
              <input type="email" className='m-1 p-1' onChange={()=>{setError((prevState) => { return { ...prevState, "email": "" } })}} name='email' />

              <p className='text-danger p-2 m-2 ' >{Error.email}</p>
            </div>
            <div>
              <label htmlFor="password" className='m-1 p-1'>Password</label>
              <input type="password" name="password" className='m-1 p-1' onChange={()=>{setError((prevState) => { return { ...prevState, "password": "" } })}} id="password"  />
              <p className='text-danger p-2 m-2 ' >{Error.password}</p>
            </div>
            <button type="submit" className='btn btn-primary m-2 p-2' style={{ width: "150px" }}>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login