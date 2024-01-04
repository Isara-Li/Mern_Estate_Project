import React from 'react'
import { useState } from 'react'	// Import the useState hook
import { Link } from 'react-router-dom'	// Import the Link component

export default function SignUp() {
  const [formData,setFormData] = useState({})	// Create a state variable for the form data
  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  }
  const handleSubmit = async(e) => {
    e.preventDefault(); {/* prevent the page from reloading*/}
    const res = await fetch('server/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }) 
    const data = await res.json()
    console.log(data)  
  }
  console.log(formData)
  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-mono font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="text" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="text" placeholder='Password' className='border p-3 rounded-lg' id='password'onChange={handleChange} />
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
