import React, { useEffect, useState } from 'react'
import { Icon } from 'leaflet';

//react leaflet 
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline, Polygon } from 'react-leaflet'
import { AppBar, Button, Grid,Typography,Card, CardHeader, CardMedia, CardContent, CircularProgress, IconButton, CardActions, } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';

//assets and components
import houseIcon from './Assets/Mapicons/house.png';
import officeIcon from './Assets/Mapicons/office.png';
import apartmentIcon from './Assets/Mapicons/apartment.png';
import img1 from "./Assets/image14.jpg";
import myListing from "./Assets/Data/Dummydata";
import shape from "./shape";
import axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { useNavigate } from 'react-router-dom';


const Listing = () => {

    const navigate = useNavigate();


    const house = new Icon({
        iconUrl : houseIcon,
        iconSize : [40,40],
    });
    const office = new Icon({
        iconUrl : officeIcon,
        iconSize : [40,40],
    });
    const apartment = new Icon({
        iconUrl : apartmentIcon,
        iconSize : [40,40],
    });


    const [latitude,setLatitude] = useState(16.543150927646256)
    const [longitude,setLongitude] = useState(81.49621535455839)

    const initialState = {
        
        mapInstance: null,
		
    }

    function ReducerFunction(draft,action){
        switch(action.type){
            
            
            case "getMap":
                draft.mapInstance = action.mapData;
                break;
			
        }
    }

    const [state,dispatch] = useImmerReducer(ReducerFunction,initialState)



    function TheMapComponent(){
        const map = useMap();
        dispatch({type:"getMap",mapData: map });
        return null;
    }

    const polyone = [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.12],
    ]

    const [Listings1,setListing] = useState([]);
    const [isLoading,setisLoading] = useState(true);
    
    useEffect(()=>{
        
        const fetchData = async () =>{
            try { 
                const response = await axios.get("http://127.0.0.1:8000/api/listing");
                setListing(response.data);
                setisLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        
    },[]);

    

    if( !isLoading ){
    console.log(Listings1[0].location);
    }
    
    if (isLoading){
        return (
            <Grid container justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        </Grid>
    )
    }

return (
    <Grid container>
        
        <Grid item xs={4} >
        


            {Listings1.map((listing) => {
                return(
                    <Card key={listing.id} style={{margin:'1rem',border:'1px solid black',position:'relative'}}>
                        <CardHeader
                            action={
                                <IconButton aria-label="settings"  onClick={()=>state.mapInstance.flyTo([listing.latitude,listing.longitude],16)}>
                                <RoomIcon />
                                </IconButton>
                            }
                            title={listing.tittle}
                            subheader="September 14, 2016"
                        />
                        <CardMedia
                            component="img"
                            height="200"
                            image={listing.picture1}
                            alt={listing.title}
                            onClick={()=>navigate(`/listings/${listing.id}`)}
                            style={{paddingRight:"1rem",paddingLeft:"1rem",height:"20rem",width:"30rem",cursor:'pointer'}}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                    {listing.description.substring(0,150)}
                            </Typography>
                        </CardContent>
                        {listing.property_status == "Sale"  ? ( <Typography style={{
                            position:'absolute',
                            zIndex:1000,
                            backgroundColor:'green',
                            color:'white',
                            top:'100px',
                            left:'20px',
                            padding:'5px'
                            }}
                            >{listing.listing_type}: ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}
                            </Typography>)
                            : (
                                <Typography style={{
                                    position:'absolute',
                                    zIndex:1000,
                                    backgroundColor:'green',
                                    color:'white',
                                    top:'100px',
                                    left:'20px',
                                    padding:'5px'
                                    }}> {listing.listing_type}: ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}{" "}/ {listing.rental_frequency}</Typography>
                            )} 
                        
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites">
                                {listing.agency_name}
                            </IconButton>
                        </CardActions>
                    </Card>
                )
            })}



        </Grid>
        <Grid item xs={8} style={{ marginTop: '0.5rem'}}>
        <AppBar position='sticky'>
        <div style={{height:"100vh"}}>
        
            <MapContainer center={[17.0158105624545, 81.76230846852859]} zoom={8} scrollWheelZoom={true} style={{border:'1px solid black'}}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                />

                <TheMapComponent />

                <Polyline positions={polyone} weight={10} color='green'/>
                <Polygon positions={shape} />
                {Listings1.map((listing) => {
                    function Icondisplay(){
                        if(listing.listing_type == "House"){
                            return house
                        }
                        else if(listing.listing_type == "Apartment"){
                            return apartment
                        }
                        else{
                            return office
                        }
                    }
                    return (
                        <Marker 
                            key={listing.id}
                            icon={Icondisplay()}
                            position={[
                                listing.latitude,
                                listing.longitude
                                ]}>
                            <Popup>
                                <Typography variant='h6'>{listing.listing_type}</Typography>
                                <img src={listing.picture1} style={{height:"10rem",width:"13rem",cursor:'pointer'}} 
                            onClick={()=>navigate(`/listings/${listing.id}`)} />
                                <Typography variant='body1'>{listing.description.substring(0,120)}</Typography>
                                <Button variant='contained' fullWidth onClick={()=>navigate(`/listings/${listing.id}`)}>Details</Button>
                            </Popup>
                        </Marker>
                    )
                })}
                
            </MapContainer>
        </div>
</AppBar>
        </Grid>
    </Grid>
);
}


export default Listing