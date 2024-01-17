import React from 'react';
import { useState } from 'react';
import { getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,} from 'firebase/storage';
import {app} from '../firebase';
import { set } from 'mongoose';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormdata] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  console.log(formData);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false); // to show the error message if the upload fails
  const [error, setError] = useState(false); // to show the error message if the upload fails
  const [loading, setLoading] = useState(false); // to show the error message if the upload fails
  const handleImageUpload = () => {
      if (files.length > 0 && files.length + formData.imageUrls.length < 7 ) {
            setUploading(true);
           const imagePromises = [];

            for (let i = 0; i < files.length; i++) {
              imagePromises.push(storeImage(files[i]));
            }
            Promise.all(imagePromises).then((downloadURLs) => {
              console.log(downloadURLs);
              setFormdata({ ...formData, imageUrls: formData.imageUrls.concat(downloadURLs) });
              setUploadError(false);
              setUploading(false);
            }).catch((error) => {
              console.log(error);
              setUploadError("Image size should be less than 2MB");
              setUploading(false);
            })
            
      }
      else{
        setUploadError("Please select only 6 images to upload.");
        console.log("Isara");
        setUploading(false);
      }
  }
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error); // failure of the promise
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // resolve is the success part of the promise. Returns the URL
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormdata({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  }

  const handleChange = (e) => {
    if (e.target.id === 'sale') {
      setFormdata({ ...formData, type: 'sell' });
    } else if (e.target.id === 'rent') {
      setFormdata({ ...formData, type: 'rent' });
    } else if (e.target.id === 'parking') {
      setFormdata({ ...formData, parking: e.target.checked });
    } else if (e.target.id === 'furnished') {
      setFormdata({ ...formData, furnished: e.target.checked });
    } else if (e.target.id === 'offer') {
      setFormdata({ ...formData, offer: e.target.checked });
    } else {
      setFormdata({ ...formData, [e.target.id]: e.target.value });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Isara");
    console.log(formData);
    try {
      if (formData.imageUrls.length < 1) {
        setError('Please upload at least one image.');
        return;
      }
      setLoading(true);
      setError(false); // remove the previous error message
      const response = await fetch('server/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef:currentUser._id,
        }),
      });
      const data = await response.json();
      console.log("Liyanage");
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        //return;
      }
      console.log(data);
      navigate(`/listing/${data._id}`);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'> {/* flex-1 to make the both div parts similar*/}
          <input
            type='text'
            placeholder='Title'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value = {formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value = {formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value = {formData.address}
          />
          <div className='flex gap-6 flex-wrap'> {/*flex wrap says that go to next line if there is no space */}
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sell'} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value = {formData.bedrooms}
              />
              <p>Bedrooms</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
               
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value = {formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value = {formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' ? <span className='text-xs'>(LKR / month)</span> : ''}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
              
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value = {formData.discountPrice}
              />
              <div className='flex flex-col items-center'> {/* items center is to center them horizontally */}
                <p>Discounted price</p>
                {formData.type === 'rent' ? <span className='text-xs'>(LKR / month)</span> : ''}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover photo. (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
            <button type='button'  onClick={handleImageUpload} className='p-3 text-white bg-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading' : 'Upload'}</button>
          </div> {/* type={button} prevents the submission of the whole form */}
          <p className='text-red-700'>{uploadError ? uploadError : ""}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div
              key={url}
              className='flex justify-between p-3 border bg-slate-100 items-center rounded-lg'
            >
              <img
                src={url}
                alt='listing image'
                className='w-20 h-20 object-contain rounded-lg' 
              /> {/* object contain preserves the original aspect ratio */}
              <button
                type='button'
                onClick={() => handleRemoveImage(index)} 
                className='p-3 bg-red-700 text-white rounded-lg uppercase hover:opacity-75'
              > {/* this is the default way to call the funtions when there is a parameter to pass onClick={function(parameter)} call the function even we don't click on it */}
                Delete
              </button>
            </div>
            ))
          }
        <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating..' : 'Create Listing'}</button>
       {error && <p className='text-red-700'>{error}</p>}
        </div>
        
      </form>
    </main>
  );
}