import React, {useState} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'

function NewPassword() {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const {token} = useParams()
    const PostData = () => {
        
        fetch('/new-password', {
            method: 'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                password,
                token
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
            type='password'
            placeholder='Enter new password'
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
        />
             <button
              onClick = {() => PostData()}
              className= 'btn waves-effect waves #1976d2 blue darken-2'
              >Update Password</button>
             </div>
        </div>
        </div>
        
    )
}

export default NewPassword
