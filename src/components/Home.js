import React from 'react';

// mui imports
import {  Button,Typography } from "@mui/material";

// components and assets
import city from './Assets/city.jpg';


const Home = () => {
return (
    
      
      <div style={{position:'relative'}}>
        <img src={city} style={{width:'100%',height:'92vh',}} alt='sample'/>
        <div 
            style={{
                position: "absolute",
                zIndex: "100",
                top: "100px",
                left: "20px",
                textAlign: "center",
            }}
        >
        <Typography variant='h1' sx={{ color:'white',fontWeight:'bolder'}}>FIND YOUR  <span style={{color:'green'}}> NEXT PROPERTY</span> ON
        THE LBREP WEBSITE</Typography>
        <Button variant='contained' 
            style={{
              fontSize: "3.5rem",
							borderRadius: "15px",
							backgroundColor: "green",
							marginTop: "2rem",
							boxShadow: "3px 3px 3px white",
              }}>
                  See All Properties
        </Button>
        </div>

      </div>


    )
}

export default Home