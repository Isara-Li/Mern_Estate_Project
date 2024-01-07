import React from 'react'
import {useSelector} from 'react-redux'
import { useRef,useState, useEffect } from 'react'
import {getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null) //Ref is a react that allows us to pin one functionality to other components
  const {currentUser} = useSelector(state => state.user)
  const [file,setFile] = useState(null) //useState is a react hook that allows us to use state in functional components
  const [progress,setProgress] = useState(0) //useState is a react hook that allows us to use state in functional components
  console.log(progress);
  useEffect(() => {
      if(file){
        handleFileUpload(file);
      }
  },[file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); // earlier we created the app
    const fileName = new Date().getTime() + file.name;  //to make the file name unique
    const storageRef = ref(storage, fileName); //ref is a function from firebase storage
    const uploadTask = uploadBytesResumable(storageRef, file); //uploadBytesResumable is a function from firebase storage
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(Math.round(progress));
    }
    );

  };

  return (
    <div className='max-w-lg mx-auto'>
    <h1 className='text-3xl font-mono font-semibold text-center py-7'>Profile</h1>
    <form className='flex flex-col gap-4'>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden />
      <img onClick={()=> fileRef.current.click()} src= {currentUser.avatar} alt="pic" className='rounded-full h-24 w-24 pbject-cover cursor-pointer self-center' /> {/* self center is used for images */}
      <input type="text" placeholder='User name' className='border p-3 rounded-lg' id='username' />
      <input type="Etext" placeholder='Email' className='border p-3 rounded-lg' id='email' />
      <input type="text" placeholder='Password' className='border p-3 rounded-lg' id='password' />
      <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-60'>Update</button>

    </form>
    <div className='flex justify-between mt-5'>
      <p className='text-red-700'>Delete account</p>
      <p className='text-red-700'>Sign out</p>
    </div>
  </div>
  )
}
