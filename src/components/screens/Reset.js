import React, {useState} from 'react'
import {useHistory } from 'react-router-dom'
import M from 'materialize-css'


function Reset() {
    const history = useHistory();
    const [email, setEmail] = useState('');

    const PostData = () => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: 'invalid email', classes: '#616161 grey darken-2'});
        }
        fetch('/reset-password', {
            method: 'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes: '#616161 grey darken-2'})
            }
            else {
                M.toast({html: data.message, classes: '#616161 grey darken-2'})
                history.push('/signin')
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
             <button
              onClick = {() => PostData()}
              className= 'btn waves-effect waves #1976d2 blue darken-2'
              >Reset password</button>

             </div>
        </div>
        </div>
        
    )
}

export default Reset
