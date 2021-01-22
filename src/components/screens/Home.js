import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom';
import {UserContext} from '../../App'
import '../../App.css'
import M from 'materialize-css'
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/shift-away.css';


function Home() {
    const [data, setData] = useState([])
    const [url, setUrl] = useState('')
    const {state, dispatch} = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      setTimeout(() => setLoading(false), 6000)
    }, [])

    useEffect(() => {
        fetch('/allPosts', {
            headers: {
                'Authorization' : 'Bearer '+localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            setData(result.posts)
        })
    })
   
    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
        //  console.log(result)
        const newData = data.map(item => {
            if(item._id === result._id){
                return result
            }else {
                return item
            }
        })
        setData(newData)
        //   console.log(data);
        })
  }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result => {
        const newData = data.map(item => {
            if(item._id === result._id){
                return result
            }else {
                return item
            }
        })
        setData(newData)
        })
    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              text,  
              postId
          })
        }).then(res=>res.json())
        .then(result => {
            // console.log(result);
            
            if(result.errmessage){
                M.toast({html: result.errmessage, classes:'#e53935 red darken-1'})
            }
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else {
                    // console.log(item);
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err);
        })
    }

    const deletePost = (postid) => {
        fetch(`/deletePost/${postid}`, {
            method:'delete',
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              }
        }).then(res=>res.json())
        .then(result => {
            // console.log(result);
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    
    const deleteComment = (postId, commentId) => {
        fetch(`deleteComment/${postId}/${commentId}`, {
            method: 'delete',
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              }
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                } else {
                    return item
                } 
            })
            setData(newData)
        }).catch(err => {
            console.log(err);
        })
    }
    
    return (
        <>
        <p className='message'>Please open in Desktop!!! Currently work going on Mobile view</p>
<div className="demo">
        
        {loading === false
        ?
        
        <div className='home'>
        {
           
            data.map(item => {
                return (
                    <div className='card home-card' key={item._id}>
                <h5 style={{padding:'5px'}}><Link to={item.postedBy._id !== state._id ? '/profile/'+item.postedBy._id : '/profile'}>
                    <div className='flex-container'>
                <div className='flex-child'>
                <img src={item.postedBy.pic} 
                style={{width:'65px', height:'65px', borderRadius:'60px'}} 
                alt='dp'>
                </img>
                </div>
                <div className="flex-child">
                <h5>
                {item.postedBy.name}
                </h5>
                </div>
                </div>
                </Link> {
                    item.postedBy._id === state._id && <i className="material-icons" style={{float:'right', cursor:'pointer', position: 'absolute', top: '10px', right: '10px'}}
                    onClick={() => deletePost(item._id)}
                    >delete</i>
                } 
                </h5>
                <div className='card-image'>
                    <img src={item.photo} alt='home post'/>
                </div>
                <div className='card-content'>
                {/* <i className="material-icons"style={{color:'red'}}>favorite</i> */}
                {
                    (item.like.includes(state._id))
                    ? <i className="material-icons small"
                onClick={() => {unlikePost(item._id)}}
                style={{cursor:'pointer', color:'#ef4f4f'}}
                >favorite</i>
                : <i className="material-icons small"
                onClick={() => {likePost(item._id)}}
                style={{cursor:'pointer', color:'#534e52'}}
                >favorite_border</i>
                }
                
                <h6>{item.like.length} likes</h6>
                    <h6 style={{fontWeight:'800px'}}>{item.title}</h6>
                    <p>{item.body}</p>
                    <hr></hr>
                    { 
                        item.comments.length === 0 ? <p style={{
                         margin: '2px 5px 6px 138px',
                         fontSize: '18px',
                         fontWeight: '600px'
                        }}>No comments yet</p> 
                         :
                        item.comments.map(record => {
                        
                   return(
                                <h6 key={record._id} className='comment-wrap'>
                                
                    <Link to={record.postedBy._id !== state._id ? '/profile/'+record.postedBy[0]._id : '/profile'}>
                      <div style={{display:'flex'}}>
                    <img alt='dp' 
                     src={record.picture} 
                     style={{width:'30px', height:'30px', borderRadius:'60px'}} >
                     </img>
                     <Tippy 
                                animation={'shift-away'} 
                                theme={'light'} 
                                // arrow={false}
                                offset={[80, 5]}
                                content={<div>
                                <div style={{display:'flex'}}>
                    <img alt='dp' 
                     src={record.picture} 
                     style={{width:'70px', height:'70px', borderRadius:'60px'}} >
                     </img>
                     
                      <span style={{ fontWeight: "600", fontSize:'32px', margin:'4px 8px 0 10px' }}>
                     {record.postedBy[0].name} 
                      </span>
                      </div>
                       <div style={{display:'flex', fontSize:'20px', fontWeight:'500px'}}>{record.followers} Followers 
                       {'   '}{record.following} Following</div>
                                </div>
                                }>

                      <span style={{ fontWeight: "600", fontSize:'22px', margin:'4px 8px 0 10px' }}>
                     {record.postedBy[0].name} 
                      </span>
                      </Tippy>
                      
                      <p style={{margin:'5px 0px 0px 0px'}}>{record.text}</p>
                       </div>
                    </Link>
  
                        
                      {(item.postedBy._id || record.postedBy._id) ===
                        state._id && (
                        <i
                          className="material-icons"
                          style={{
                            float: "right",
                            color:'red',
                            cursor:'pointer',
                            margin:'-22px 0px 0px 0px'
                          }}
                          onClick={() => deleteComment(item._id, record._id)}
                        >
                          delete
                        </i>
                      )}
                    </h6>
                        )})
                        
                    } 
                    
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        makeComment(e.target[0].value, item._id)  
                        e.target.reset();
                    }}>
                    <input type='text' placeholder='comment below' />
                    <button type='reset' style={{display:'none'}}>comment</button>
                    </form>
                   
                </div>
            </div>
                )
            })
        }
            
            
        </div> : <div class="sk-chase" style={{margin:'188px 13px 87px 682px'}}>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
</div> }
        </div>
        </>
    )
    
}

export default Home
