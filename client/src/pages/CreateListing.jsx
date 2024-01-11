import React from 'react';
import { useState } from 'react';
import { getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,} from 'firebase/storage';
import {app} from '../firebase';
import { set } from 'mongoose';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormdata] = useState({
     imageURLs: [],
  })
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false); // to show the error message if the upload fails
  const handleImageUpload = () => {
      if (files.length > 0 && files.length + formData.imageURLs.length < 7 ) {
            setUploading(true);
           const imagePromises = [];

            for (let i = 0; i < files.length; i++) {
              imagePromises.push(storeImage(files[i]));
            }
            Promise.all(imagePromises).then((downloadURLs) => {
              console.log(downloadURLs);
              setFormdata({ ...formData, imageURLs: formData.imageURLs.concat(downloadURLs) });
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
      imageURLs: formData.imageURLs.filter((url, i) => i !== index),
    });
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'> {/* flex-1 to make the both div parts similar*/}
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-6 flex-wrap'> {/*flex wrap says that go to next line if there is no space */}
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' />
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
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
               
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>(LKR / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'> {/* items center is to center them horizontally */}
                <p>Discounted price</p>
                <span className='text-xs'>(LKR / month)</span>
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
            formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
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
        <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
        </div>
        
      </form>
    </main>
  );
}