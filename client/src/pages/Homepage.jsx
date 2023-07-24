import axios from 'axios';
import { default as React, useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import AudioPlayer from "../components/AudioPlayer.jsx";
import AuthContext from "../context/AuthProvider.jsx";

import "./style/homepage.css";
import './style/Sidebar.css';

import Header from '../components/Header';
import MusicGrid from '../components/MusicGrid';
import NewPlaylist from '../components/NewPlaylist';
import FileUploadPage from './artist-studio.jsx';

const Homepage = () => {

	const [component, setComponent] = useState('');

	const authContext = useContext(AuthContext);

	const userDataString = localStorage.getItem('data');
	const userData = userDataString ? JSON.parse(userDataString) : null;

	const USER_ID = userData && userData.length > 0 ? userData[0].ID : null;
	const USER_NAME = userData && userData.length > 0 ? userData[0].username : null;

	const changeElement = (id) => {
		if (id === 'Discover') {
			setCurrentPlaylist(null);
			setComponent(id);
		}
		if (id === 'FileUploadPage') {
			setCurrentPlaylist(null);
			setComponent(id);
		}
		// setComponent(id);
	}

	const [playlists, setPlaylists] = useState([]);
	const [currentPlaylist, setCurrentPlaylist] = useState(null);
	const [editMode, setEditMode] = useState(null);
	const [tempPlaylistName, setTempPlaylistName] = useState('');
	const initialValue = null;
	const [newPlaylistID, setNewPlaylistID] = useState(initialValue);

	const handleCreatePlaylist = async() => {
		const defaultPlaylistName = 'New Playlist';
		createNewPlaylist(defaultPlaylistName);
		setEditMode(playlists.length);
			try {
				const POST_URL = 'http://localhost:3001/create-playlist'
				const response = await axios.post(POST_URL, {
					user: USER_ID,
					name: defaultPlaylistName,
					created_by: USER_ID,
				}, {
					headers:{
						'Content-Type': 'application/json',
						withCredentials: false,
					}
				})

				console.log(response.data[0].ID);
				setNewPlaylistID(response.data[0].ID);
				localStorage.setItem('playlistID', response.data[0].ID);

			} catch(err) {
				console.log(err);
			}
	}


	const createNewPlaylist = async(playlist_name) => {
		const newPlaylist = [...playlists, {name: playlist_name}];
		setPlaylists(newPlaylist);
		setCurrentPlaylist(newPlaylist.length - 1);
	};

	const handleEditPlaylistName = async(index, newName) => {
		let updatedPlaylists = [...playlists];
		updatedPlaylists[index].name = newName;

		const updatedPlaylistName = (newName === '') ? 'New Playlist' : newName;

		try{
			const response = await axios.post(
				'http://localhost:3001/update-playlist-name',{
					name: updatedPlaylistName,
					id: localStorage.getItem('playlistID'),
					user: USER_ID,
				}, {
					headers: {
						'Content-Type': 'application/json',
					}
				})
				localStorage.removeItem('playlistID');
		} catch(err){
			console.log(err);
		}
	}

	const viewPlaylist = (index) => {
		setCurrentPlaylist(index);
		setComponent('');
	};

	const handleChangeTempName = (e) => {
		setTempPlaylistName(e.target.value);
	}

	// get all the songs for the discover page when window loads.
	const getSongs = async() => {
		const GET_SONGS_URL = 'http://localhost:3001/get-songs'
		try{
			const response = await axios.get(GET_SONGS_URL)
			console.log(response);
		}catch(err){
			console.log(err);
		}
	}

	// get all the user's playlist when the window loads.
	const getPlaylists = async () => {
		const GET_PLAYLISTS = 'http://localhost:3001/get-playlists';
		try {
			const response = await axios.post(GET_PLAYLISTS, {
				user_id: USER_ID,
			},{
				headers:{
					'Content-Type': 'application/json'
				}
			});
			console.log(response);
		} catch (err) {
			console.log(err);
		}
	}

	return(
		<div className='homepage-container' onLoad={() => {getPlaylists(); getSongs();}}>
			<Header/>
			<div className='homepage'>
				<div className='sidebar-holder'>
					<div className="sidebar-container">
						<div className='sidebar'>
							<div className='clickable'>
								<div id='Discover' onClick = {() => {changeElement('Discover')}}>Home</div>
								<div>Liked Music</div>

								{
									true ? (
										<div id='FileUploadPage' onClick = {(e) => {changeElement(e.target.id)}}>
											Artist Studio
										</div>
									) : null
								}
							</div>

						<div className='user-playlist-container'>
						<div id='user-playlists' className='user-playlists'>Your Playlists</div>
						{playlists.map((playlist, index) => (
							<div key={index}>
								{editMode === index ? (
									<div>
										<input type='text' value={tempPlaylistName} onChange={handleChangeTempName} />
										<button onClick={() => handleEditPlaylistName(index, tempPlaylistName)}>Save</button>
									</div>
								) : (
									<div onClick={() => viewPlaylist(index)}>
										{playlist.name}
										<button onClick={() => { setEditMode(index); setTempPlaylistName(playlist.name); }}>Edit</button>
									</div>
								)}
							</div>
						))}
					</div>
								<div>
									<Link to='../components/AudioPlayer.jsx'> audio </Link>
								</div>

							<div className='button createPlaylist' onClick={handleCreatePlaylist}>Create Playlist</div>
						</div>
					</div>
				</div>
				<div className='main-holder'>
					{
					 component === 'FileUploadPage' ? <FileUploadPage/> :
					 component === 'Discover' ? <MusicGrid/> :
					 currentPlaylist !== null && <NewPlaylist playlist={playlists[currentPlaylist]} />
					}
				</div>
				<div className = 'footer'>
					<AudioPlayer/>
				</div>
			</div>
		</div>
	);
}

export default Homepage;