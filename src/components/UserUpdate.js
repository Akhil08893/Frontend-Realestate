import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import {
	Grid,
	Typography,
	Button,
	TextField,
	Snackbar,
} from "@mui/material";
import StateContext from "../contexts/StateContext";


const UserUpdate = (props) => {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);

    


	const initialState = {
		
		agencyNameValue: props.userProfile.agencyName,
		phoneNumberValue: props.userProfile.phoneNumber,
		bioValue: props.userProfile.bio,
		uploadedPicture: [],
		profilePictureValue: "",
		sendRequest: 0,
		openSnack: false,
		disabledBtn: false,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			

			case "catchAgencyNameChange":
				draft.agencyNameValue = action.agencyNameChosen;
				break;

			case "catchPhoneNumberChange":
				draft.phoneNumberValue = action.phoneNumberChosen;
				break;

			case "catchBioChange":
				draft.bioValue = action.bioChosen;
				break;

			case "catchUploadedPicture":
				draft.uploadedPicture = action.pictureChosen;
				break;

			case "catchProfilePictureChange":
				draft.profilePictureValue = action.profilePictureChosen;
				break;

			case "ChangeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
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
	}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	useEffect(() => {
		if (state.uploadedPicture[0]) {
			dispatch({
				type: "catchProfilePictureChange",
				profilePictureChosen: state.uploadedPicture[0],
			});
		}
	}, [state.uploadedPicture]);

	

	useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProfile() {
				const formData = new FormData();

				formData.append("agency_name", state.agencyNameValue);
				formData.append("phone_number", state.phoneNumberValue);
				formData.append("bio", state.bioValue);
				formData.append("seller", GlobalState.userId);

				if (state.profilePictureValue instanceof File) {
					formData.append("profile_picture", state.profilePictureValue);
				}

				try {
					const response = await Axios.patch(
						`http://localhost:8000/api/profile/${GlobalState.userId}/update`,
						formData
					);

					console.log(response.data);
					dispatch({ type: "openTheSnack" });
				} catch (e) {
					console.log(e);
					dispatch({ type: "allowTheButton" });
				}
			}
			UpdateProfile();
		}
	}, [state.sendRequest, GlobalState.userId, state.agencyNameValue, state.phoneNumberValue, state.bioValue, state.profilePictureValue]);

	const FormSubmit = (e) => {
		e.preventDefault();
		dispatch({type: 'ChangeSendRequest'});
        dispatch({ type: "disableTheButton" });
	};

useEffect(() => {
	if (state.openSnack) {
		setTimeout(() => {
		navigate(0);
		}, 1500);
	}
	}, [state.openSnack]);



	return (
		<div
			style={{
				width: "50%",
				marginLeft: "auto",
				marginRight: "auto",
				marginTop: "3rem",
				border: "5px solid black",
				padding: "3rem",
			}}
		>
			<form onSubmit={FormSubmit}>
				<Grid item container justifyContent="center">
					<Typography variant="h4">MY PROFILE</Typography>
				</Grid>

				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="agencyName"
						label="Agency Name*"
						variant="outlined"
						fullWidth
						value={state.agencyNameValue}
						onChange={(e) =>
							dispatch({
								type: "catchAgencyNameChange",
								agencyNameChosen: e.target.value,
							})
						}
					/>
				</Grid>

				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="phoneNumber"
						label="Phone Number*"
						variant="outlined"
						fullWidth
						value={state.phoneNumberValue}
						onChange={(e) =>
							dispatch({
								type: "catchPhoneNumberChange",
								phoneNumberChosen: e.target.value,
							})
						}
					/>
				</Grid>

				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="bio"
						label="Bio"
						variant="outlined"
						multiline
						rows={6}
						fullWidth
						value={state.bioValue}
						onChange={(e) =>
							dispatch({
								type: "catchBioChange",
								bioChosen: e.target.value,
							})
						}
					/>
				</Grid>

				

				<Grid
					item
					container
					xs={6}
					style={{
						marginTop: "1rem",
						marginLeft: "auto",
						marginRight: "auto",
					}}
				>
					<Button
						variant="contained"
						component="label"
						fullWidth
						style={{
							backgroundColor: "blue",
							color: "white",
							fontSize: "0.8rem",
							border: "1px solid black",
							marginLeft: "1rem",
						}}
					>
						PROFILE PICTURE
						<input
                            id='profilePic'
							type="file"
							accept="image/png, image/gif, image/jpeg"
							hidden
							onChange={(e) =>
								dispatch({
									type: "catchUploadedPicture",
									pictureChosen: e.target.files,
								})
							}
						/>
					</Button>
				</Grid>

        <Grid item container>
					<ul>
						{state.profilePictureValue ? <li>{state.profilePictureValue.name}</li> : ""}
					</ul>
				</Grid>

				<Grid
					item
					container
					xs={8}
					style={{
						marginTop: "1rem",
						marginLeft: "auto",
						marginRight: "auto",
					}}
				>
					<Button
						variant="contained"
						fullWidth
						type="submit"
						style={{
							backgroundColor: "green",
							color: "white",
							fontSize: "1.1rem",
							marginLeft: "1rem",
						}}
						disabled={state.disabledBtn}
					>
						UPDATE
					</Button>
				</Grid>
			</form>
			<Snackbar
				open={state.openSnack}
				message="You have successfully Updated your profile "
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			/>
		</div>
	);
};

export default UserUpdate;
