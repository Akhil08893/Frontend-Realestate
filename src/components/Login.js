import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


import {Typography,Container,Avatar,Button,CssBaseline,TextField,FormControlLabel,Checkbox,Grid,Box, Snackbar, Alert} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useImmerReducer } from 'use-immer';
import  axios from 'axios';

import DispatchContext from '../contexts/DispatchContext';
import StateContext from '../contexts/StateContext';



const defaultTheme = createTheme();

export default function SignIn() {

  const GlobalDispatch = useContext(DispatchContext);
  const State = useContext(StateContext);

  const navigate = useNavigate();

  const initialState = {
    usernameValue:'',
    passwordValue:'',
    sendRequest : 0,
    token : '',
    openSnack: false,
		disabledBtn: false,
		serverError: false,

  }

  function ReducerFunction(draft,action){
    switch(action.type){
      case "catchUsernameChange" :
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;
      case "catchPasswordChange" :
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;
      case "ChangeSendRequest" :
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchToken" :
        draft.token = action.tokenChosen;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;

      case "disableTheButton":
        draft.disabledBtn = true;
        break;

      case "allowTheButton":
        draft.disabledBtn = false;
        break;

      case "catchServerError":
        draft.serverError = true;
        break;
    }
  }

  const [state,dispatch] = useImmerReducer(ReducerFunction,initialState)



  useEffect(()=>{
    if(state.sendRequest){
      const fetchData = async () =>{
        try { 
            const response = await axios.post('http://localhost:8000/api-auth-djoser/token/login/',{
              username: state.usernameValue,
              password: state.passwordValue,
            });
            console.log(response)
            dispatch({type: 'catchToken' , tokenChosen: response.data.auth_token})
            GlobalDispatch({type: 'catchToken' , tokenInfo: response.data.auth_token})
           // navigate("/")
        } catch (error) {
            
          dispatch({ type: "allowTheButton" });
					dispatch({ type: "catchServerError" });
        }
    }
    fetchData();
    }
},[state.sendRequest]);

//get info
  useEffect(()=>{
    if(state.token !== ''){
      const userInfo = async () =>{
        try { 
            const response = await axios.get('http://localhost:8000/api-auth-djoser/users/me/',{
              headers : {Authorization: 'Token '.concat(state.token)}
            });
            GlobalDispatch({type:'UserInfo',
              usernameInfo : response.data.username,
              emailInfo : response.data.email,
              IdInfo : response.data.id,
            })
            dispatch({ type: "openTheSnack" });
            
        } catch (error) {
            console.log(error);
        }
    }
    userInfo();
    }
},[state.token]);

useEffect(() => {
  if (state.openSnack) {
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }
}, [state.openSnack]);



  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({type: 'ChangeSendRequest'});
    dispatch({ type: "disableTheButton" });
  };

  return (
    
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'green' }}>
          
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {state.serverError ? (
					<Alert severity="error">Incorrect username or password!</Alert>
				) : (
					""
				)}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              
            
              value={state.usernameValue}
              onChange={(e) => dispatch({type: 'catchUsernameChange',usernameChosen:e.target.value})}
              error={state.serverError ? true : false}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={state.passwordValue}
              onChange={(e) => dispatch({type: 'catchPasswordChange',passwordChosen:e.target.value})}
              error={state.serverError ? true : false}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2,backgroundColor:'green' }}
              disabled={state.disabledBtn}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
              Don't have an account?
                <Link to="/register" variant="body2">
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
          
        </Box>
        <br></br>
        <Typography variant="body2" color="text.secondary" align="center">
      Copyright ©  Your Website  
    </Typography>
      </Container>
      <Snackbar
				open={state.openSnack}
				message="You have successfully logged in"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			/>
    </ThemeProvider>
  );
}