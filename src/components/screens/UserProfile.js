import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import '../../App.css'
function Profile() {
    const [userProfile, setProfile] = useState(null);
   
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            method:'get',
            headers: {
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result);
            setProfile(result)
        })
    }, [])
   
    const followers = () => { 
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data);
            dispatch({type:'UPDATE', payload:{following:data.following, followers:data.followers}})
            localStorage.setItem('user', JSON.stringify(data))
            setProfile((prevState) => {
               return{ ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers, data._id]
                        }
            }
            })
            setShowFollow(false)
        })
    }
    const unfollowers = () => { 
        fetch('/unfollow', {
            method: 'put',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data);
            dispatch({type:'UPDATE', payload:{following:data.following, followers:data.followers}})
            localStorage.setItem('user', JSON.stringify(data))
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
               return{
                    ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
            }
            })
            setShowFollow(true)
        })
    }
    return (
        <>
        {userProfile ? 
            <div style={{maxWidth:'550px', margin:'0px auto'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '18px 0px',
                borderBottom: '1px solid grey'
            }}>
                <div>
                    <img style={{width:'160px', height:'160px', borderRadius: '80px'}}
                     src={userProfile.user.pic}
                     alt = 'DP'/>
                </div>
                <div>
                    <h4>{(userProfile.user.name)}</h4>
                    <h5>{(userProfile.user.email)}</h5>
                    
                    <div style = {{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '110%'
                    }}>
                        <h6>{(userProfile.posts.length)} Posts</h6>
                        <h6>{userProfile.user.followers.length} Followers</h6>
                        <h6>{userProfile.user.following.length} Following</h6>
                        
                    </div>
                    {
                    showFollow ?
                    <button
              onClick = {() => followers()}
              className= 'btn waves-effect waves #1976d2 blue darken-2'
              style={{margin:'13px'}}
              >Follow</button>
                :
                <button
              onClick = {() => unfollowers()}
              className= 'btn waves-effect waves #1976d2 blue darken-2'
              style={{margin:'13px'}}
              >UnFollow</button>

                }
                </div>
               
                
            </div>
        
        <div className='gallery'>
        {
            userProfile.posts.map(item=>{
                return (
                    <img key={item._id} className='item' src={item.photo} alt={item.title} />
                )
            })
        }
            
        </div>
        </div>
         : <div class="sk-chase" style={{margin:'211px 13px 87px 378px'}}>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
</div> }
       
</>
    )
}

export default Profile
