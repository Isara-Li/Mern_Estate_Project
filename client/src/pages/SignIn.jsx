import { set } from 'mongoose'
import React from 'react'
import { useState } from 'react'	// Import the useState hook
import { Link,useNavigate } from 'react-router-dom'	// Import the Link component
import { useDispatch,useSelector } from 'react-redux'
import { signInFailure,signInStart,signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData,setFormData] = useState({})	// Create a state variable for the form data
 const {loading,error} = useSelector(state => state.user) // instead of const [loading,setLoading] = useState(false) and const [error,setError] = useState(null). 'user' was defined in the userSlice.js file 
  const navigate = useNavigate();	// Get the navigate function from the useNavigate hook
  const dispatch = useDispatch()
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
    try {
      //setLoading(true)
      dispatch(signInStart())  // instead of setLoading(true)
      const res = await fetch('server/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }) 
      const data = await res.json()
      console.log(data.success)
      if (data.success === false) {
        signInFailure(data.message) // instead of setError(data.message)
        return;
      }
      //setLoading(false)
      //setError(null)
      dispatch(signInSuccess(data)) // instead of setLoading(false) and setError(null)
      console.log('Isara')
      navigate('/');
      
    } 
    catch (error) {
      //setLoading(false)
      //setError(error.message)
      dispatch(signInFailure(error.message)) // instead of setLoading(false) and setError(error.message)
    
      console.log(error.message)
    }
  }
  console.log(formData)
  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-mono font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="text" placeholder='Password' className='border p-3 rounded-lg' id='password'onChange={handleChange} />
        <button disabled={loading} className='bg-slate-800 text-white rounded-lg p-3 hover:opacity-80 disabled:opacity:50'>{loading ? 'Loading...':'Sign Up'}</button>
        <OAuth />
      </form>
      <div className='p-3 flex gap-2'>
        <p>Don't have an account ?</p>
        <Link to= {'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
