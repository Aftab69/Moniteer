import React, { useEffect, useState } from 'react';
import "./Home.css";

const Home = () => {
  const [ fulldata, setFulldata ] = useState([]);
  const [ availablemembers, setAvailablemembers ] = useState([]);
  const getData = async() =>{
    try{
      const res = await fetch("/home",{
                  method:"GET",
                  headers:{
                    "Content-Type":"application/json"
                  }
                })
      if(res.status===200){
          const data = await res.json();
          setFulldata(data);  
          console.log(data);
      }     
    } catch(error){
          console.log(error);
    }
  }
  const getAvailable = async()=>{
    const res = await fetch("/available",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
    })
    if(res.status===200){
    const data = await res.json();
    setAvailablemembers(data);  
    console.log(data);
    } 
  }
  useEffect(()=>{
    getData()
    getAvailable()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div>All Members :</div>
      {fulldata.map((eachIndividual)=>(
        <>
        <div>{eachIndividual.name}</div>
        </>
      ))}
      <div>Online Members:</div>
      {availablemembers.map((eachIndividual)=>(
        <>
        <div>{eachIndividual.name}</div>
        </>
      ))}
    </>   
  )
}

export default Home