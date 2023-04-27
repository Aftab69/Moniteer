import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navStyle = { textDecoration:"none", color:"rgb(202, 202, 202)"}
  const [ loginvisibility, setLoginvisibility ] = useState({visibility:"visible"});
  const [ logoutvisibility, setLogoutvisibility ] = useState({visibility:"hidden"});

  const authenticateforaccount = async() =>{
    try{
      const res = await fetch("https://moniteer-backend.infinityymedia.com/authenticateforaccount",{
                  method:"GET",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  credentials:"include"
                })
      if(res.status===200){
        // eslint-disable-next-line
          const data = await res.json();
          // setProfiledata(data);
          // setUserdata(data);
          setLoginvisibility({visibility:"hidden"})
          setLogoutvisibility({visibility:"visible"})
          // console.log(profiledata)
      } else if(res.status===400){
        
      }
    } catch(error){
          console.log(error);
    }
  }

useEffect(()=>{
    authenticateforaccount()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
        <nav>
            <NavLink style={navStyle} to="/"><span>HOME</span></NavLink>
            <NavLink style={navStyle} to="/profile"><span>PROFILE</span></NavLink>
            <NavLink style={navStyle} to="/login"><span style={loginvisibility}>LOGIN</span></NavLink>
            <NavLink style={navStyle} to="/register"><span>REGISTER</span></NavLink>
            <button style={logoutvisibility}>LOG OUT</button>
            {/* <NavLink style={navStyle} to="/admin"><span>ADMIN</span></NavLink> */}
        </nav>
    </>
  )
}

export default Navbar