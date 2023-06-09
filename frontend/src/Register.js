import React, { useState } from 'react';
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  let navigate = useNavigate();
  const [ data, setData ] = useState({
    "name":"",
    "email":"",
    "password":"",
    "cpassword":"",
    "role":"",
    "company":""
  })
  const handleChange = (e) =>{
    if(e.target.name==="company"){
      setData({...data,[e.target.name]:e.target.value.toLowerCase()});
    } else {
      setData({...data,[e.target.name]:e.target.value});
    }
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    const { name, email, password, cpassword, role, company } = data;
    fetch("https://moniteer-backend.infinityymedia.com/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        name, email, password, cpassword, role, company
      })
    }).then((res)=>{
      if(res.status===200){
        alert("User successfully registered")
        navigate("/login");
      } else if(res.status===400){
        alert("Please fill your form")
      } else if(res.status===401){
        alert("Email already exists")
      } else if(res.status===402){
        alert("The password confirmation does not match")
      } else if(res.status===403){
        alert("Admin already exists")
      }
    })
  }
  console.log(data)
  return (
    <>
      <div className='registerpageContainer'>
          <form method='POST' onSubmit={handleSubmit} className='registerinfoContainer'>
              <p>Full Name :</p>
              <input type="text" name='name' onChange={handleChange} />
              <p>Email :</p>
              <input type="email" name='email' onChange={handleChange} />

              <p>Role :</p>
              <label style={{padding:5}}>
              <input type="radio" name="role" value="admin" onChange={handleChange} />
              Admin
              </label>
              <label style={{padding:5}}>
              <input type="radio" name="role" value="member" onChange={handleChange} />
              Member
              </label>
              <p>Company :</p>
              <input type="text" name='company' onChange={handleChange} />

              <p>Password :</p>
              <input type="password" name='password' onChange={handleChange} />
              <p>Confirm Password :</p>
              <input type="password" name='cpassword' onChange={handleChange} />
              <button type='submit'>Login</button>
          </form>
      </div>
    </>
  )
}

export default Register