import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useImmerReducer } from "use-immer";
import {
	Grid,
	Typography,
	Button,
	TextField,
	CircularProgress,
} from "@mui/material";
import StateContext from "../contexts/StateContext";
import axios from "axios";

import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import UserUpdate from "./UserUpdate";

const User = () => {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);

	const initialState = {
		userProfile: {
			agencyName: "",
			phoneNumber: "",
			profilePic:"",
			bio: "",
			seller_listings : [],
			seller: ""
		},
		dataIsLoading: true,
		
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchUserProfile":
				draft.userProfile.agencyName = action.userProfileChosen.agency_name;
				draft.userProfile.phoneNumber = action.userProfileChosen.phone_number;
				draft.userProfile.bio = action.userProfileChosen.bio;
				draft.userProfile.profilePic = action.userProfileChosen.profile_picture;
				draft.userProfile.seller_listings = action.userProfileChosen.seller_listings;
				draft.userProfile.seller = action.userProfileChosen.seller;
				break;

			case "loadingDone":
				draft.dataIsLoading = false;
				break;
			
			default:
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	

	useEffect(() => {
		async function getProfile() {
			try {
				const response = await axios.get(
					`http://localhost:8000/api/profile/${GlobalState.userId}/`
				);
				
				dispatch({ type: "catchUserProfile", userProfileChosen: response.data });
				dispatch({ type: "loadingDone" });
			} catch (error) {
				console.log(error);
			}
		}
		getProfile();
	}, [GlobalState.userId]);

	function PropertiesDisplay() {
		if (state.userProfile.seller_listings.length === 0) {
			return (
				<Button disabled size="small">
					No Property
				</Button>
			);
		} else if (state.userProfile.seller_listings.length === 1) {
			return (
				<Button
					size="small"

					onClick={() => navigate(`/agencies/${state.userProfile.seller}`)}
				>
					One Property listed
				</Button>
			);
		} else {
			return (
				<Button
					size="small"
					onClick={() => navigate(`/agencies/${state.userProfile.seller}`)}
				>
					{state.userProfile.seller_listings.length} Properties
				</Button>
			);
		}
	}

	function WelcomeDisplay() {
		if (
			state.userProfile.agencyName === null ||
			state.userProfile.agencyName === "" ||
			state.userProfile.phoneNumber === null ||
			state.userProfile.phoneNumber === ""
		) {
			return (
				<Typography
					variant="h5"
					style={{ textAlign: "center", marginTop: "1rem" }}
				>
					Welcome{" "}
					<span style={{ color: "green", fontWeight: "bolder" }}>
						{GlobalState.Username}
					</span>{" "}
					, please submit this form below to update your profile.
				</Typography>
			);
		} else {
			return (
				<Grid
					container
					style={{
						width: "50%",
						marginLeft: "auto",
						marginRight: "auto",
						border: "5px solid black",
						marginTop: "1rem",
						padding: "5px",
					}}
				>
					<Grid item xs={6}>
						<img
							style={{ height: "10rem", width: "15rem" }}
							src={
								state.userProfile.profilePic !== null
									? state.userProfile.profilePic
									: defaultProfilePicture
							}
						/>
					</Grid>
					<Grid
						item
						container
						direction="column"
						justifyContent="center"
						xs={6}
					>
						<Grid item>
							<Typography
								variant="h5"
								style={{ textAlign: "center", marginTop: "1rem" }}
							>
								Welcome{" "}
								<span style={{ color: "green", fontWeight: "bolder" }}>
									{GlobalState.username}
								</span>
							</Typography>
						</Grid>
						<Grid item>
							<Typography
								variant="h5"
								style={{ textAlign: "center", marginTop: "1rem" }}
							>
								You have {PropertiesDisplay()}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			);
		}
	}

	if (state.dataIsLoading === true) {
		return (
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				style={{ height: "100vh" }}
			>
				<CircularProgress />
			</Grid>
		);
	}

	return (
		<>
			<div>{WelcomeDisplay()}</div>
			<UserUpdate userProfile={state.userProfile} />
		</>
	);
};

export default User;
