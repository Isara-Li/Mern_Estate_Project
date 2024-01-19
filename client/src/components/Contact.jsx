import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({listing}) {
    const [owner, setOwner] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                console.log(listing.userRef)
                const res = await fetch(`/server/users/getUser/${listing.userRef}`)
                const data = await res.json()
                setOwner(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchOwner()
    }, [])

    const setMessageFunc = (e) => {
        setMessage(e.target.value)
    }
  return (
    <div >
    {owner && (
        <div className='flex flex-col gap-4'>
            <p>
                Contact <span className='font-semibold'> {owner.username} </span> for <span className='font-semibold'> {listing.name} </span>
            </p>
            <textarea name="Message" id="message" rows="2" value={message} onChange={setMessageFunc} placeholder='Enter the message' className='w-full border p-3 rounded-lg'></textarea>
            <Link to={`mailto:${owner.email}?subject=Regarding ${listing.name} &body=${message}`} className='bg-slate-700 text-white p-3 rounded-lg text-center'>
             Send Message
            </Link>
        </div>
    
      )}
    </div>
  )
}
