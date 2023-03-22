import React, { useEffect, useState } from 'react';
import "./Home.css";

const Home = () => {
  const [ fulldata, setFulldata ] = useState([]);
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
  useEffect(()=>{
    getData()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div>All Members :</div>
      {fulldata.map((eachIndividual)=>(
        <>
        <div>{eachIndividual.name}</div>
        </>
      ))}
    </>   
  )
}

export default Home