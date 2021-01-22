import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    if(url){
    fetch('/createPost', {
      method: 'post',
      headers:{
          'Content-Type':'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('jwt')
      },
      body:JSON.stringify({
          title,
          body,
          pic: url
      })
  }).then(res => res.json())
  .then(data => {
      if(data.error){
          M.toast({html: data.error, classes: '#616161 grey darken-2'})
      }
      else {
          M.toast({html: 'Post created', classes: '#616161 grey darken-2'})
          history.push('/')
      }
      
  })
}
  }, [url])
  const PostDetails = () => {
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
    return (
      <>
      
      <div className='my-gradient'>
        <div className='card input-filed' style={{
            margin: '30px auto',
            maxWidth: '500px',
            padding: '20px',
            textAlign: 'center'
        }}>
            <input
             type='text'
              placeholder='Title'
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              />
            <input
             type='text'
              placeholder='Body'
              value={body}
              onChange={(e) => setBody(e.target.value)}
               />
            <div className="file-field input-field">
      <div className="btn #1976d2 blue darken-2">
        <span>Upload photo</span>
        <input type="file" 
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
            <button
            onClick={() => PostDetails()}
             className= 'btn waves-effect waves-light #1976d2 blue darken-2'
             >Upload post</button>
        </div>
        </div>
        </>
    )
}

export default CreatePost
