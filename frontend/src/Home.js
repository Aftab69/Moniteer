import React, { useEffect, useState } from 'react';
import "./Home.css";

const Home = () => {
  const [ fulldata, setFulldata ] = useState([]);
  const [ availablemembers, setAvailablemembers ] = useState([]);
  const [ membertimearr, setMembertimearr ] = useState([]);
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

  //get member timeline
  const handleTimeline = (e) =>{
    e.preventDefault();
    console.log(e.target.name)
    console.log(fulldata.length)

    let i=0; 
    while(i<fulldata.length){
      if(fulldata[i].email===e.target.name){
        let timeArr = fulldata[i].timeinfo;
        setMembertimearr(timeArr);
        break;
      }
      i++;
    }
  }
  //convert total seconds to hours, minutes and seconds
  const getTime = (totaltimesecs)=>{
    const hours = Math.floor(totaltimesecs / 3600);
    const minutes = Math.floor((totaltimesecs - hours * 3600) / 60);
    const remainingSeconds = totaltimesecs - hours * 3600 - minutes * 60;
    const result = hours + " hrs " + minutes + " mins " + remainingSeconds + " s";
    return result;
  }
  
  console.log(membertimearr)
  return (
    <>
      <div>All Members :</div>
      {fulldata.map((eachIndividual)=>(
        <>
        <div>{eachIndividual.name}</div>
        <button onClick={handleTimeline} name={eachIndividual.email}>View</button>
        </>
      ))}
      <div>Online Members:</div>
      {availablemembers.map((eachIndividual)=>(
        <>
        <div>{eachIndividual.name}</div>
        <button onClick={handleTimeline} name={eachIndividual.email}>View</button>
        </>
      ))}

      {membertimearr.map((eachDay)=>(
        <>
        <div className='eachdayBox'>
          <div className='dateBox'>{eachDay.date}</div>
          <div className='timeBox'>{getTime(eachDay.totaltime)}</div>
        </div>
      </>
      ))}
    </>   
  )
}

export default Home