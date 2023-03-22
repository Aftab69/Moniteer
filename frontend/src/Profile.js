import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [ name, setName ] = useState("");
  const [ visibility, setVisibility ] = useState({display:"none"});
  const getData = async() =>{
      try{
        const res = await fetch("/profile",{
                    method:"GET",
                    headers:{
                      "Content-Type":"application/json"
                    },
                    credentials:"include"
                  })
        if(res.status===200){
            const data = await res.json();
            setName(data.name)
            setVisibility({display:"block"})
        } else if(res.status===400) {
            navigate("/login")
        }
      } catch(error){
            navigate("/login")
      }
  }
  useEffect(()=>{
    getData()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    <div className='profileMainContainer'>
      <div style={visibility}>
        <h1>Welcome, {name}</h1>
      </div>
      <div className='toggleContainer'>

      </div>
    </div>
    </>
  )
}

export default Profile