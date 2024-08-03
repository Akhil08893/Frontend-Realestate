import { BrowserRouter, Route, Routes } from "react-router-dom";

//mui materials
import {CssBaseline, StyledEngineProvider } from "@mui/material";

//components
import Home from './components/Home';
import Login from "./components/Login";
import Listing from "./components/Listing";
import Header from "./components/Header";
import Register from "./components/Register";
import { useImmerReducer } from "use-immer";

//contexts
import DispatchContext from "./contexts/DispatchContext";
import StateContext from "./contexts/StateContext";
import { useEffect } from "react";
import AddItem from "./components/AddItem";
import User from "./components/User";
import Agencies from "./components/Agencies";
import AgencyDetails from "./components/AgencyDetails";
import ListingDetails from "./components/ListingDetails";





function App() {


  const initialState = {
    username: localStorage.getItem('theUsername'),
    userEmail:localStorage.getItem('theEmail'),
    userId : localStorage.getItem('theId'),
    userToken: localStorage.getItem('theToken'),
    userIsLogged: localStorage.getItem('theUsername') ? true : false,
  }

  function ReducerFunction(draft,action){
    switch(action.type){
      case "catchToken" :
        draft.userToken = action.tokenInfo;
        break;
      case "UserInfo" :
        draft.username = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId    = action.IdInfo;
        draft.userIsLogged = true;
        break;
      case "logout" :
        draft.userIsLogged = false;
        break;
    }
  }

  const [state,dispatch] = useImmerReducer(ReducerFunction,initialState)


  useEffect(()=>{
    if(state.userIsLogged){
      localStorage.setItem('theUsername',state.username)
      localStorage.setItem('theEmail',state.userEmail)
      localStorage.setItem('theId',state.userId)
      localStorage.setItem('theToken',state.userToken)
    }
    else{
      localStorage.removeItem('theUsername')
      localStorage.removeItem('theEmail')
      localStorage.removeItem('theId')
      localStorage.removeItem('theToken')
    }
  },[state.userIsLogged])


  return (
    <StateContext.Provider value = {state}>
    <DispatchContext.Provider value= {dispatch}>
    <StyledEngineProvider injectFirst>
    <BrowserRouter>
    <CssBaseline/>
    <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/addproperty" element={<AddItem/>}/>
          <Route path="/profile" element={<User/>}/>
          <Route path="/listings" element={<Listing/>}/>
          <Route path="/agencies" element={<Agencies/>}/>
          <Route path="/agencies/:id" element={<AgencyDetails/>}/>
          <Route path="/listings/:id" element={<ListingDetails/>}/>
        </Routes>
    </BrowserRouter>
    </StyledEngineProvider>
    </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
