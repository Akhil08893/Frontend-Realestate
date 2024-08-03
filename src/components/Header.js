import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

//mui imports
import { AppBar, Button,Typography,Toolbar, MenuItem, Menu, Snackbar } from "@mui/material";
import StateContext from '../contexts/StateContext';
import axios from 'axios';
import DispatchContext from '../contexts/DispatchContext';

const Header = () => {
    const navigate = useNavigate();

    const State = useContext(StateContext);
    const Dispatch = useContext(DispatchContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const [openSnack, setOpenSnack] = useState(false);




    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function HandleProfile(){
        setAnchorEl(null);
        navigate("/profile")
    }
    const handleLogout = () =>{
        setAnchorEl(null);
        const confirm = window.confirm('Are You sure You want to leave');
        if (confirm) {
            try{
                const response = axios.post('http://localhost:8000/api-auth-djoser/token/logout/',
                    State.userToken,
                    {headers : {Authorization: 'Token '.concat(State.userToken)}});
                console.log(response);
                Dispatch({type:'logout'})
                setOpenSnack(true);
        
                }catch(e){
                    console.log(e)
                }
        }
        
    };


    useEffect(() => {
		if (openSnack) {
			setTimeout(() => {
				navigate('/login');
			}, 1500);
		}
	}, [openSnack]);

return (
    
        <AppBar position="static" sx={{background:'black'}}>
        <Toolbar>
        
        <div style={{ marginRight: 'auto'}} onClick={()=>navigate("/")} >
            <Button color="inherit"><Typography variant='h4'>Home Haven</Typography></Button>
        </div>

        <div>
            <Button color="inherit" onClick={()=>navigate("/listings")}><Typography variant='h6' style={{marginRight:'2rem'}}>Listing</Typography></Button>
            <Button color="inherit" onClick={()=>navigate("/agencies")}><Typography variant='h6' style={{marginLeft:'2rem'}}>Agencies</Typography></Button>
        </div>

        <div style={{ marginLeft: 'auto'}} >
            <Button color="inherit"  onClick={() => navigate("/addproperty") } style={{backgroundColor:'green',color:'white',width:'15rem',fontSize:'1.1rem',marginRight:'1rem'}}>Add Property</Button>
        
            {State.userIsLogged ? (
                <Button color="inherit" onClick={handleClick} style={{backgroundColor:'white',color:'black',width:'15rem',fontSize:'1.1rem',marginLeft:'1rem',"&:hover":{backgroundColor:'green',},}}>
                    {State.username}

                </Button>
                
            ) : (
                <Button color="inherit"  onClick={() => navigate("/Login")} style={{backgroundColor:'white',color:'black',width:'15rem',fontSize:'1.1rem',marginLeft:'1rem',"&:hover":{backgroundColor:'green',},}}>
                    Login/SignUp
                </Button>
            )}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={HandleProfile} sx={{color:'black',width:'15rem',fontWeight:'bolder',borderRadius:'15px'}}>Profile</MenuItem>
                <MenuItem onClick={handleLogout} sx={{color:'black',width:'15rem',fontWeight:'bolder',borderRadius:'15px'}}>Logout</MenuItem>
            </Menu>
            <Snackbar
						open={openSnack}
						message="You have successfully logged out!"
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
					/>
			
        </div>
        </Toolbar>
    </AppBar>
    
)
}

export default Header