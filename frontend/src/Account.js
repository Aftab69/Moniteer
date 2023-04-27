import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Account.css"

const Account = () => {

    const navigate = useNavigate();
    const [ userdata, setUserdata ] = useState([]);
    const [ pagevisibility, setPagevisibility ] = useState({visibility:"hidden"});

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
          setPagevisibility({visibility:"visible"})
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
    <div className='accountpagedetailsContainer' style={pagevisibility}>
    <p>Personal details: </p>
    <p>Name : {userdata.name}</p>
    <p>Email : {userdata.email}</p>
    <p>Company : {userdata.company}</p>
    </div>
  </>
  )
}

export default Account