import React from 'react';
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

const navbar = () => {
  const navStyle = { textDecoration:"none", color:"rgb(202, 202, 202)"}
  return (
    <>
        <nav>
            <NavLink style={navStyle} to="/"><span>HOME</span></NavLink>
            <NavLink style={navStyle} to="/profile"><span>PROFILE</span></NavLink>
            <NavLink style={navStyle} to="/login"><span>LOGIN</span></NavLink>
            <NavLink style={navStyle} to="/register"><span>REGISTER</span></NavLink>
        </nav>
    </>
  )
}

export default navbar