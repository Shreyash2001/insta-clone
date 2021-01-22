import React, {useState, useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App';

function Signin() {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const PostData = () => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: 'invalid email', classes: '#616161 grey darken-2'});
        }
        fetch('/signin', {
            method: 'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes: '#616161 grey darken-2'})
            }
            else {
                localStorage.setItem('jwt',data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({type:"USER", payload: data.user})
                // M.toast({html: 'Signed in Successfully', classes: '#616161 grey darken-2'})
                history.push('/')
            }
            
        })
    }
    return (
        <div className='my-gradient'>
        
        <div className='myCard'>
             <div className='card auth-card input-field'>
             <h2>Instagram</h2>
             <input 
            type='text'
            placeholder='Enter your email'
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
        />
        <input 
            type='password'
            placeholder='password'
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
        />
             <button
              onClick = {() => PostData()}
              className= 'btn waves-effect waves #1976d2 blue darken-2'
              >Sign In</button>

             <h6><Link to='/signup'><u>Don't have an account ?</u></Link></h6>
             <p><Link to='/reset'><u>forgot password</u></Link></p>
             </div>
        </div>
        </div>
        
    )
}

export default Signin
