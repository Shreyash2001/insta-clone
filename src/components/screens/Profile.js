import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import Button from "@material-ui/core/Button";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { IconButton } from '@material-ui/core';
function Profile() {
    const [mypics, setPics] = useState([]);
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);
    const {state, dispatch} = useContext(UserContext)
    const inputRef = React.useRef();
    const triggerFileSelectPopup = () => inputRef.current.click();
    const onSelectFile = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
				setImage(reader.result);
			});
		}
	};
    useEffect(() => {
        fetch('/myPost', {
            headers: {
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.myPost)
        })
    }, [])
   
    useEffect(() => {
        if(image){
          const data = new FormData()
                data.append('file', image)
                data.append('upload_preset', 'insta_clone')
                data.append('cloud_name', 'cqn')
      fetch('https://api.cloudinary.com/v1_1/cqn/image/upload', {
        method: 'post',
        body:data
      })
      .then(res=>res.json())
      .then(data => {
        setUrl(data.url)
        // localStorage.setItem('user', JSON.stringify({...state, pic:data.url}))
        // dispatch({type:'UPDATEPIC', payload:data.url})
        fetch('/updatePic',{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                pic:data.url
            })
        }).then(res=>res.json())
        .then(result => {
            localStorage.setItem('user', JSON.stringify({...state, pic:result.pic}))
            dispatch({type:'UPDATEPIC', payload:result.pic})
            // console.log(result);
        })
      })
      .catch(err => {
        console.log(err);
      })
        }
    }, [image])

    // const updatePhoto = (file) => {
    //     setImage(file)
        
    // }
    return (
        
        <div style={{maxWidth:'550px', margin:'0px auto'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '18px 0px',
                borderBottom: '1px solid grey'
            }}>
                <div>
                   
                     
                
                     <img style={{width:'160px', height:'160px', borderRadius: '80px'}}
                     src={state ? state.pic : ''}
                     alt = 'DP'/>
                     
                
                </div>
                <div>
                    <h4>{state ? state.name:'loading'}</h4>
                    <h4>{state ? state.email:'loading'}</h4>
                    <div style = {{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '110%'
                    }}>
                        <h6>{mypics.length} Posts</h6>
                        <h6>{state ? state.followers.length : '0'} Followers</h6>
                        <h6>{state ? state.following.length : '0'} Following</h6>
                        
                        
                    </div>
                    {/* <div className="file-field input-field">
      <div className="btn #1976d2 blue darken-2">
        <span>Upload profile pic</span>
        <input type="file" 
          onChange={(e) => updatePhoto(e.target.files[0])}
        />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div> */}
    <div className='container-buttons'>
				<input
					type='file'
					accept='image/*'
					ref={inputRef}
					onChange={onSelectFile}
					style={{ display: "none" }}
				/>
				<Button
                	variant='contained'
                    color='primary'
					onClick={triggerFileSelectPopup}
					style={{ margin: "10px" }}
				>
					Change Profile Pic <CameraAltIcon />
				</Button>
                </div>
        
    
                </div>
                
            </div>
            
            

        <div className='gallery'>
        {
            mypics.map(item=>{
                return (
                    <img key={item._id} className='item' src={item.photo} alt={item.title} />
                )
            })
        }
            
        </div>
        
        </div>

    )
}

export default Profile
