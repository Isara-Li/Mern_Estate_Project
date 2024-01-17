import React from 'react'
import {useSelector} from 'react-redux'
import { useRef,useState, useEffect } from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';
import { updateUserStart,updateUserSuccess,updateUserFailure , deleteUserFailure,deleteUserStart, deleteUserSuccess,  signoutUserStart,signoutUserSuccess,signoutUserFailure} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux'; 
import {Link} from 'react-router-dom'

export default function Profile() {
  const fileRef = useRef(null) //Ref is a react that allows us to pin one functionality to other components
  const {currentUser,loading , error } = useSelector(state => state.user)
  const [file,setFile] = useState(null) //useState is a react hook that allows us to use state in functional components
  const [progress,setProgress] = useState(0) //useState is a react hook that allows us to use state in functional components  
  const [fileUploadError,setFileUploadError] = useState(false)
  const [formData,setFormData] = useState({})
  const [success,updateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [showListing, setShowListing] = useState([])
  const dispatch = useDispatch()
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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`server/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
      }
      dispatch(updateUserSuccess(data))
      updateSuccess(true)
    } catch (error) {
       dispatch(updateUserFailure(error.message))
    }
  }

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`server/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
       dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      dispatch( signoutUserStart())
      const res = await fetch('server/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message))
        return
            }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(error.message))
    }
  }

  const handleShowListing = async () => {
    try {
       const res = await fetch(`/server/users/listing/${currentUser._id}`)
        const data = await res.json()
        if (data.success === false) {
          setShowListingError(true)
          return
        }
        setShowListing(data)
    } catch (error) {
      setShowListingError(true)
    }
  }

  return (
    <div className='max-w-lg mx-auto'>
    <h1 className='text-3xl font-mono font-semibold text-center py-7'>Profile</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
      <input type="text" placeholder='User name' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />
      <input type="Etext" placeholder='Email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange}/>
      <input type="text" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
      <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-60'>Update</button>
      <Link className='bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-90' to={"/create-listing"}> Create Listing</Link>
      <button type='button' onClick={handleShowListing} className='bg-green-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-60'>Show my Listings</button>
    </form>
    <div className='flex justify-between mt-5'>
      <span onClick={handleUserDelete} className='text-red-700 hover:cursor-pointer'>Delete account</span>
      <span onClick={handleSignout} className='text-red-700 hover:cursor-pointer'>Sign out</span>
      
    </div>
   
    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {success ? 'User is updated successfully!' : ''}
      </p>
      <p className='text-red-700 mt-5'>
        {showListingError ? 'No listings found!' : ''}
      </p>
      {showListing &&
        showListing.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {showListing.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-slate-300'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
  
              <div className='flex flex-col item-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
             
            </div>
          ))}
        </div>}
   
  </div>
  )
}
