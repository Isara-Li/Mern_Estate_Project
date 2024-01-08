import React from 'react'
import {useSelector} from 'react-redux'
import { useRef,useState, useEffect } from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';

export default function Profile() {
  const fileRef = useRef(null) //Ref is a react that allows us to pin one functionality to other components
  const {currentUser} = useSelector(state => state.user)
  const [file,setFile] = useState(null) //useState is a react hook that allows us to use state in functional components
  const [progress,setProgress] = useState(0) //useState is a react hook that allows us to use state in functional components  
  const [fileUploadError,setFileUploadError] = useState(false)
  const [formData,setFormData] = useState({})
  console.log(formData);

  console.log(progress);
  useEffect(() => {
      if(file){
        handleFileUpload(file);
      }
  },[file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); //earlier we created the app object in firebase.js
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setFileUploadError(false);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  return (
    <div className='max-w-lg mx-auto'>
    <h1 className='text-3xl font-mono font-semibold text-center py-7'>Profile</h1>
    <form className='flex flex-col gap-4'>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden />
      <img onClick={()=> fileRef.current.click()} src= {formData.avatar ? formData.avatar : currentUser.avatar} alt="pic" className='rounded-full h-24 w-24 pbject-cover cursor-pointer self-center' /> {/* self center is used for images */}
      <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (Image must be less than 2 mb)
            </span>
          ) : progress > 0 && progress < 100 ? (
            <span className='text-slate-700'>{`Uploading ${progress}%`}</span>
          ) : progress === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
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
