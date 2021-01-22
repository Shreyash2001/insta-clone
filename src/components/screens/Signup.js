import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
function Signup() {
    const history = useHistory();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        uploadFields()
    }, [url])
    const uploadPic = () => {
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
      })
      .catch(err => {
        console.log(err);
      })

    }

    const uploadFields = () => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: 'invalid email', classes: '#616161 grey darken-2'});
        }
        fetch('/signup', {
            method: 'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes: '#616161 grey darken-2'})
            }
            else {
                // M.toast({html: data.message, classes: '#616161 grey darken-2'})
                history.push('/signin')
            }
            
        })
    }
    const PostData = () => {
        if(image){
            uploadPic()
        } else {
            uploadFields()
        }
        
    }
    return (
        <div className='my-gradient'>
        <div className='myCard'>
        <div className='card auth-card input-field'>
        <h2>Instagram</h2>
        <input 
            type='text'
            placeholder=' Enter your name'
            value = {name}
            onChange = {(e) => setName(e.target.value)}
        />
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
        <div className="file-field input-field">
      <div className="btn #1976d2 blue darken-2">
        <span>Upload profile pic</span>
        <input type="file" 
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>

        <button
        onClick = {() => PostData()}
         className= 'btn waves-effect waves-light #1976d2 blue darken-2'>Sign Up</button>
        <p><Link to='/signin'><u>Already have an account ?</u></Link></p>
        </div>
   </div>
   </div>
    )
}

export default Signup
