import React from 'react'
import { Link } from 'react-router-dom'	// Import the Link component

export default function SignUp() {
  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-mono font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input type="text" placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input type="text" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button className='bg-slate-800 text-white rounded-lg p-3 hover:opacity-80 disabled:opacity:50'>SIGN UP</button>
      </form>
      <div className='p-3 flex gap-2'>
        <p>Already have an account ?</p>
        <Link to= {'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}
