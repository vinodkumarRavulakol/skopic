import React, { useState } from "react";
import Communites from "./Communites/Communites"
import Add from "../../../Assets/images/Add.svg"
import "./Community.css";
import StartCommunities from "./Start Communities/StartCommunities";

function Community(){
    const[openStartCommunity,setOpenStartCommunity]=useState(false)

    const startCommunity=()=>{
        setOpenStartCommunity(true)
    }
    const close=()=>{
        setOpenStartCommunity(false)
    }
    
    return(
        <>
        <div>
       <Communites/>
       <div className="CommunityActions">
            <img src={Add} alt="AddOption"/>
           <p > Follow more communities</p>
        </div>
            <div className="CommunityActions" onClick={startCommunity}>
            <img src={Add} alt="AddOption"/>
            <p>Start a community</p>
            </div>
        </div>
        {openStartCommunity?
<StartCommunities open=
            {openStartCommunity}
            close={close}/>
            :
            null
        }

        </>
    )
}

export  default  Community