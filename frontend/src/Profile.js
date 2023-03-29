import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ timebundle, setTimebundle ] = useState([]);
  const [ visibility, setVisibility ] = useState({display:"none"});
  const [ togglebutton1, setTogglebutton1 ] = useState({background:"white"});
  const [ togglebutton2, setTogglebutton2 ] = useState({background:"white"});
  const [ activityarr, setActivityarr ] = useState([]);
  const [ activityboxvisibility, setActivityboxvisibility ] = useState({visibility:"hidden"})

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
            setTimebundle(data.timeinfo)
            if(data.onlinestatus==="on"){
              document.getElementById("toggleContainer2").style.background = "green";
              document.getElementById("toggleContainer1").style.background = "white";
            } else if(data.onlinestatus==="off"){
              document.getElementById("toggleContainer1").style.background = "grey";
              document.getElementById("toggleContainer2").style.background = "white";
            }
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

  const handleToggle1 = (e) =>{
    e.preventDefault()
    setTogglebutton1({background:"grey"})
    setTogglebutton2({background:"white"})
    document.getElementById("toggleContainer2").style.background = "white";

    //to get time in seconds after midnight
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;
    var totalSec = totalSeconds.toString();

    //to get today's date
    var now2 = new Date();
    var date = now2.getDate();
    var month = now2.getMonth() + 1;
    var year = now2.getFullYear();
    var today = year + "-" + month + "-" + date;
    
    fetch("/offline",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email, 
        onlinestatus:"off",
        toggleofftime:totalSec,
        date:today
      })
    }).then((res)=>{
      if(res.status===200){
        // alert("User offline")
      } else {
        alert("error")
      }
    })

    const refreshPage = () =>{
      window.location.reload(true)
    }
    setTimeout(() => {
      refreshPage();
    }, 1000);
  }
  
  const handleToggle2 = (e) =>{
    e.preventDefault();
    setTogglebutton2({background:"green"})
    setTogglebutton1({background:"white"})
    document.getElementById("toggleContainer1").style.background = "white";

    //to get time in seconds after midnight
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;
    var totalSec = totalSeconds.toString();

    //to get today's date
    var now2 = new Date();
    var date = now2.getDate();
    var month = now2.getMonth() + 1;
    var year = now2.getFullYear();
    var today = year + "-" + month + "-" + date;

    fetch("/online",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email,
        onlinestatus:"on",
        toggleontime:totalSec,
        date:today
      })
    }).then((res)=>{
      if(res.status===200){
        // alert("User online")
      } else {
        alert("error")
      }
    })

    const refreshPage = () =>{
      window.location.reload(true)
    }
    setTimeout(() => {
      refreshPage();
    }, 1000);
  }

  console.log(timebundle)
  //convert total seconds to hours, minutes and seconds
      const getTime = (totaltimesecs)=>{
        const hours = Math.floor(totaltimesecs / 3600);
        const minutes = Math.floor((totaltimesecs - hours * 3600) / 60);
        const remainingSeconds = totaltimesecs - hours * 3600 - minutes * 60;
        const result = hours + " hrs " + minutes + " mins " + remainingSeconds + " s";
        return result;
      }

  //handling activity on clicking date
  const handleActivity = (e)=>{
    e.preventDefault();
    console.log(timebundle);
    
    let i=0;
    while(i<timebundle.length){
      if(timebundle[i].date===e.target.name){
        setActivityarr(timebundle[i].activity)
        break;
      }
      i++;
    }
    setActivityboxvisibility({visibility:"visible"})
  }

  return (
    <>
    <div style={visibility} className='profileMainContainer'>
      <div>
        <h1>Welcome, {name}</h1>
      </div>
      <div className='toggleMainContainer'>
        <div onClick={handleToggle1} className='toggleContainer1' id='toggleContainer1' style={togglebutton1}>
          <p>I'm Offline</p>
        </div>
        <div onClick={handleToggle2} className='toggleContainer2' id='toggleContainer2' style={togglebutton2}>
          <p>I'm Online</p>
        </div>
      </div>
      <div className='timelineandactivityBox'>
        <div className='timelineBox'>
          <h1>Your Timeline</h1>
          <div className='headingBox'>
            <p style={{textDecoration:"underline"}}>Date</p>
            <p style={{textDecoration:"underline",display:"none"}}>Time</p>
          </div>
          <div className='timelinemapBox'>
          {timebundle.map((eachdaydata)=>(
            <>
              <div className='eachdayBox'>
                <div className='dateBox'>{eachdaydata.date}</div>
                <button onClick={handleActivity} name={eachdaydata.date}>&rarr;</button>
                <div className='timeBox' style={{display:"none"}}>{getTime(eachdaydata.totaltime)}</div>
              </div>
            </>
          ))}
          </div>
        </div>
        <div style={activityboxvisibility} className='activityBox'>
          <h1>Your Activities</h1>
          <div className='headingBox'>
            <p style={{textDecoration:"underline"}}>Status</p>
            <p style={{textDecoration:"underline"}}>Time</p>
          </div>
          <div className='activitymapBox'>
          {activityarr.map((eachdaydata)=>(
            <>
              <div className='eachdayBox'>
                <div className='dateBox'>{eachdaydata.statuscheck}</div>
                <div className='timeBox'>{getTime(eachdaydata.statustime)}</div>
              </div>
            </>
          ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile