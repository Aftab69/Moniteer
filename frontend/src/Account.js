import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Account.css"

const Account = () => {

    const navigate = useNavigate();
    const [ userdata, setUserdata ] = useState([]);

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
          const data = await res.json();
          // setProfiledata(data);
          setUserdata(data);
          console.log(userdata)
          // console.log(profiledata)
      } else if(res.status===400){
          navigate("/login")
      }
    } catch(error){
          console.log(error);
          navigate("/login");
    }
  }

useEffect(()=>{
    authenticateforaccount()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
  <>
    <div>Personal Details:</div>
    <p>{userdata.name}</p>
  </>
  )
}

export default Account