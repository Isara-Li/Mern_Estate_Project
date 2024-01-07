import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'


export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogle = async() => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
           
             const res = await fetch('server/auth/oauth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name:result.user.displayName,email:result.user.email,photoURL:result.user.photoURL})
            })
            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')

        } catch (error) {
            console.log(error.message)
        }
    }
  return (
    <button onClick={handleGoogle} type='button'className='bg-slate-300 p-3 rounded hover:opacity-90'>Continue with Google</button>
  )
}

// By default the button type is submit. If you want to use the button to navigate to another page, you need to change the button type to button.
