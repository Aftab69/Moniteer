import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ visibility, setVisibility ] = useState({display:"none"});
  const [ togglebutton1, setTogglebutton1 ] = useState({background:"white"});
  const [ togglebutton2, setTogglebutton2 ] = useState({background:"white"});
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
            setEmail(data.email)
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

  const handleToggle1 = () =>{
    setTogglebutton1({background:"grey"})
    setTogglebutton2({background:"white"})

    fetch("/online",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email, onlinestatus:"off"
      })
    }).then((res)=>{
      if(res.status===200){
        alert("User offline")
      } else {
        alert("error")
      }
    })

  }
  const handleToggle2 = () =>{
    setTogglebutton2({background:"green"})
    setTogglebutton1({background:"white"})

    fetch("/online",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email, onlinestatus:"on"
      })
    }).then((res)=>{
      if(res.status===200){
        alert("User online")
      } else {
        alert("error")
      }
    })

  }

  return (
    <>
    <div className='profileMainContainer'>
      <div style={visibility}>
        <h1>Welcome, {name}</h1>
      </div>
      <div className='toggleMainContainer'>
        <div onClick={handleToggle1} className='toggleContainer1' style={togglebutton1}>
          <p>I'm Offline</p>
        </div>
        <div onClick={handleToggle2} className='toggleContainer2' style={togglebutton2}>
          <p>I'm Online</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile