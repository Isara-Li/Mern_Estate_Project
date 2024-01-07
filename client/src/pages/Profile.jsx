import React from 'react'
import {useSelector} from 'react-redux'


export default function Profile() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className='max-w-lg mx-auto'>
    <h1 className='text-3xl font-mono font-semibold text-center py-7'>Profile</h1>
    <form className='flex flex-col gap-4'>
      <img src= {currentUser.avatar} alt="pic" className='rounded-full h-24 w-24 pbject-cover cursor-pointer self-center' /> {/* self center is used for images */}
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
