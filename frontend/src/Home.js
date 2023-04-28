import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css";


const Home = () => {
  const navigate = useNavigate();
  // const [ profiledata, setProfiledata ] = useState([]);
  const [ fulldata, setFulldata ] = useState([]);
  // const [ availablemembers, setAvailablemembers ] = useState([]);
  const [ membertimearr, setMembertimearr ] = useState([]);
  const [ pagevisibility, setPagevisibility ] = useState({visibility:"hidden"});
  const [ timelinevisibility, setTimelinevisibility ] = useState({visibility:"hidden"});
  const [ activitiesvisibility, setActivitiesvisibility ] = useState({visibility:"hidden"});
  const [ activityarr, setActivityarr ] = useState([]);

  const [ companyname, setCompanyname ] = useState("");
  const [ membername, setMembername ] = useState("");
  const [ memberdata, setMemberdata ] = useState({
      company:"",
      name: ""
  });

  // const authenticate = () =>{
  //   fetch("https://moniteer-backend.infinityymedia.com/authenticate",{
  //     method:"GET",
  //     headers:{
  //       "Content-Type":"application/json"
  //     }
  //   }).then((res)=>res.json()).then((data)=>{
  //     console.log("hi");
  //     console.log(data);
  //   })
  // } 
  let profiledata = [];
  const authenticate = async() =>{
    try{
      const res = await fetch("https://moniteer-backend.infinityymedia.com/authenticate",{
                  method:"GET",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  credentials:"include"
                })
      if(res.status===200){
          const data = await res.json();
          // setProfiledata(data);
          profiledata.push(data);
          setCompanyname(data.company);
          setPagevisibility({visibility:"visible"})
          // console.log(data)
          // console.log(profiledata)
      } else if(res.status===400){
          navigate("/")
      }
    } catch(error){
          console.log(error);
          navigate("/");
    }
  }

  const getData = async() =>{
    try{
      await authenticate();
      const res = await fetch("https://moniteer-backend.infinityymedia.com/home",{
                  method:"GET",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  credentials:"include"
                })
      if(res.status===201){
          const data = await res.json();
          // const newArr = data.filter((eachInd)=>(
          //   eachInd.company===profiledata.company
          // ))
          // console.log(data);
          let newArr = [];
          for(let i=0; i<data.length; i++){
            if(data[i].company===profiledata[0].company){
              // console.log("yes")
              newArr.push(data[i])
            } else {
              // console.log("no")
            }
          }
          // console.log(newArr);
          setFulldata(newArr);  
      }     
    } catch(error){
          console.log(error);
    }
  }

  
  // const getAvailable = async()=>{
  //   const res = await fetch("https://moniteer-backend.infinityymedia.com/available",{
  //     method:"GET",
  //     headers:{
  //       "Content-Type":"application/json"
  //     }
  //   })
  //   if(res.status===200){
  //   const data = await res.json();
  //   setAvailablemembers(data);  
  //   console.log(data);
  //   } 
  // }
  useEffect(()=>{
    authenticate()
    getData()
    // getAvailable()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  //get member timeline
  const handleTimeline = (e) =>{
    e.preventDefault();
    // console.log(e.target.name)
    // console.log(fulldata.length)

    let i=0; 
    while(i<fulldata.length){
      if(fulldata[i].email===e.target.name){
        let timeArr = fulldata[i].timeinfo;
        setMembertimearr(timeArr);
        break;
      }
      i++;
    }
    setTimelinevisibility({visibility:"visible"})
  }
  //convert total seconds to hours, minutes and seconds
  const getTime = (totaltimesecs)=>{
    if(totaltimesecs>=0){
      const hours = Math.floor(totaltimesecs / 3600);
      const minutes = Math.floor((totaltimesecs - hours * 3600) / 60);
      const remainingSeconds = totaltimesecs - hours * 3600 - minutes * 60;
      const result = hours + " hrs " + minutes + " mins " + remainingSeconds + " s";
      return result;
    } else {
      return "0 hrs 0 mins 0 s";
    }
    
  }
  
  //handling activity on clicking date
  const handleActivity = (e)=>{
    e.preventDefault();
    
    let i=0;
    while(i<membertimearr.length){
      if(membertimearr[i].date===e.target.name){
        setActivityarr(membertimearr[i].activity);
        break;
      }
      i++;
    }
    setActivitiesvisibility({visibility:"visible"})
  }

  // console.log(membertimearr)
  // console.log(activityarr)

  // console.log(profiledata);
  // console.log(fulldata);

  //handing sub admin roles

  const handlefetch = async() =>{
    await handlerole();
    const { company, name } = memberdata;
    fetch('https://moniteer-backend.infinityymedia.com/rolechange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        company,
        name
      }),
      credentials:'include',
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else if (res.status === 400) {
          alert('error changing role');
        } 
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  }

  const handlerole = (e) =>{
    e.preventDefault();
    const membernm = e.target.name;
    setMemberdata({...memberdata,
      company:companyname,
      name: membernm
    })
    // handlefetch()
  }

  return (
    <>
    <div style={pagevisibility} className='homepageMaincontainer'>
      <div className='membersMaincontainer'>
        <h3>All Members :</h3>
        <div className='membersmapboxHome'>
          {fulldata.map((eachIndividual)=>(
            <>
            <div className='eachdayBoxhome'>
              <div className="membernameBox">
                <div className='memberName'>{eachIndividual.name}</div>
                {(eachIndividual.onlinestatus==="on") ? 
                  <>
                  <div style={{background:"green"}} className='statusboxCircle' id={eachIndividual.email}></div>
                  <div className='statusText'>online</div>
                  </> : 
                  <>
                  <div style={{background:"red"}} className='statusboxCircle' id={eachIndividual.email}></div>
                  <div className='statusText'>offline</div>
                  </>         
                }
                <button name={eachIndividual.name} onClick={handlerole}>{eachIndividual.role}</button>
             </div>
              <button onClick={handleTimeline} name={eachIndividual.email}>&rarr;</button>
            </div>
            </>
          ))}
        </div>
        {/* <h3>Online Members:</h3>
        {availablemembers.map((eachIndividual)=>(
          <>
          <div className='membersContainer'>
            <div style={{marginRight:"10px"}}>{eachIndividual.name}</div>
            <button onClick={handleTimeline} name={eachIndividual.email}>&rarr;</button>
          </div>
          </>
        ))} */}
      </div>
      <div style={timelinevisibility} className='timelineMaincontainer'>
        <h3>Timeline:</h3>
        <div className='headingBoxhome'>
          <p style={{textDecoration:"underline"}}>Date</p>
          <p style={{textDecoration:"underline"}}>Total Time</p>
        </div>
        <div className='timelinemapboxHome'>
        {membertimearr.map((eachDay)=>(
          <>
          <div className='eachdayBoxhome'>
            <div>{eachDay.date}</div>
            <button onClick={handleActivity} name={eachDay.date}>&rarr;</button>
            <div>{getTime(eachDay.totaltime)}</div>
          </div>
        </>
        )).reverse()}
        </div> 
      </div>

      <div style={activitiesvisibility} className='activityboxHome'>
          <h3>Activities:</h3>
          <div className='headingboxHome2'>
            <p style={{textDecoration:"underline"}}>Status</p>
            <p style={{textDecoration:"underline"}}>Time</p>
          </div>
          <div className='activitymapboxHome'>
          {activityarr.map((eachdaydata)=>(
            <>
              <div className='eachdayboxHome2'>
                <div className='dateBox'>{eachdaydata.statuscheck}</div>
                <div className='timeBox'>{getTime(eachdaydata.statustime)}</div>
              </div>
            </>
          )).reverse()}
          </div>
        </div>

    </div>
    </>   
  )
}

export default Home