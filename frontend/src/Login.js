import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [ data,setData ] = useState({
    "email":"",
    "password":""
  }) 
  const handleChange = (e) =>{
    setData({...data,[e.target.name]:e.target.value})
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    const { email, password } = data;
    fetch("/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,password
      })
    }).then((res)=>{
      if(res.status===200){
        alert("User successfully logged in")
        navigate("/profile")
      } else if(res.status===400){
        alert("Please fill your form")
      } else if(res.status===401){
        alert("Invalid credentials")
      }
    })
  }

  return (
    <>
      <div className='loginpageContainer'>
          <form method='POST' onSubmit={handleSubmit} className='logininfoContainer'>
              <p>Email :</p>
              <input type="email" name='email' onChange={handleChange}/>
              <p>Password :</p>
              <input type="password" name='password' onChange={handleChange}/>
              <button type='submit'>Login</button>
          </form>
      </div>
    </>
  )
}

export default Login