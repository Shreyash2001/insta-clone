import React, {useContext, useRef, useEffect, useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../App'
import '../App.css'
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/shift-away.css';
import M from 'materialize-css'
function Navbar() {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList = () => {
    
    if(state){
      return [
        <li key='1'>
        
        <i data-target="modal1" 
        className="large material-icons modal-trigger" 
        style={{color:'black', position:'absolute', margin:'0px 0px 0px -98px', cursor:'pointer'}} 
        >search
        </i>
        </li>,
        <li key='2'><Link  to="profile">
        <Tippy
        animation={'shift-away'} 
        theme={'light'} 
        content={<p>Profile Details</p>}>
        <img src={state.pic} alt='dp' 
        style={{width:'45px', height:'45px', borderRadius:'60px',position: 'absolute', margin:'9px -62px -1px'}}>
        </img>
        </Tippy>
        </Link>
        </li>
        ,

        <li key='3'>
        <Link to="create">
        <Tippy
        animation={'shift-away'} 
        theme={'light'} 
        content={<p>Post Photos</p>}>
        <img alt='post photos' 
        src='https://res.cloudinary.com/cqn/image/upload/v1610279730/icons8-camera-96_h1hyrx.png' 
        style={{width:'53px', margin:'2px 0px 0px 18px'}}>
        </img>
        </Tippy>
        </Link>
        </li>,

        <li key='4'>
        <Link to="myFollowersPost">
        <Tippy
        animation={'shift-away'} 
        theme={'light'} 
        content={<p>Your Followers Post</p>}>
        <img alt='My followers' 
        src='https://res.cloudinary.com/cqn/image/upload/v1610279978/icons8-people-working-together-100_nonkep.png' 
        style={{width:'65px'}}>
        </img>
        </Tippy>
        </Link>
        </li>,

        <li key='5'>
          <button
              onClick = {() => {
              localStorage.clear()
              dispatch({type:'CLEAR'})
              history.push('/signin')
              }
              }
              className= 'btn #e53935 red darken-1'
              >Logout</button>
        </li>
      ]
    } else {
      return [
        <li key='6'><Link to="signin">Login</Link></li>,
        <li key='7'><Link to="signup">SignUp</Link></li>
      ]
    }
  }
  const fetchUser = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method:'post',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results => {
      setUserDetails(results.user)
    })
  }
    return (
    <div className='navbar-fixed'>
        <nav>
           <div className="nav-wrapper white">
         <Link to={state ? '/' : '/signin'} className="brand-logo left"><img alt='instagram' src='https://res.cloudinary.com/cqn/image/upload/v1610872086/instagram_mb9qv4.png' style={{width:'8%', margin:'7px -3px -16px 0px'}}></img> Instagram</Link>
            <ul id="nav-mobile" className="right">
             {renderList()}
            </ul>
         </div>
         <div id="modal1" className="modal" ref={searchModal} style={{color:'black'}}>
    <div className="modal-content">
    <input 
            type='text'
            placeholder='Enter your email'
            value = {search}
            onChange = {(e) => fetchUser(e.target.value)}
        />
        <ul className="collection">
        {userDetails.map(item => {
          return <Link to={  '/profile/'+item._id } onClick={() => {
            M.Modal.getInstance(searchModal.current).close()
            setSearch('')
          }}><li className="collection-item">{item.email}</li></Link>
        })}
        
      
      </ul>
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
    </div>
  </div>
      </nav>
 </div>
    )
}

export default Navbar
