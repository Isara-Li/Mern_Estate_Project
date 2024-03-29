import React, { useEffect } from 'react'
import {FaSearch} from 'react-icons/fa' // import the search icon from react-icons/fa
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux' // import the useSelector hook from react-redux
import {useState} from 'react' 

export default function Header() {
    const {currentUser} = useSelector(state => state.user) // get the user from the redux store
    const [search, setSearch] = useState('') // create a state for the search input
    const navigate = useNavigate() 
    const handleSubmit = (e) => {
        e.preventDefault() // prevent the default action of the form
        const urlParams = new URLSearchParams(window.location.search) // create a new URLSearchParams object
        urlParams.set('searchterm', search) 
        const searchQuery = urlParams.toString() 
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchterm = urlParams.get('searchterm')
        setSearch(searchterm)
    }, [location.search])
  return (
   <header className='bg-slate-200'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3'> {/* flex is a display property that allows us to align items horizontally or vertically */}
    <Link to='/'>
    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap border'>
        <span className='text-slate-400'>Isara</span>
        <span className='text-slate-700'>Estate</span>
    </h1>
    </Link>
    <form onSubmit={handleSubmit} className='flex items-center border border-gray-700 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-slate-700 bg-slate-100'>
        <input type='text' placeholder='Search' className='bg-transparent focus:outline-none w-24 sm:w-64' value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button>

        <FaSearch className='text-slate-500'></FaSearch>
        </button>
    </form>
    <ul className='flex gap-4'>
        <Link to='/'>
        <li className='hidden sm:inline text-slate_700'>Home</li>
        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-slate_700'>About</li>
        </Link>
        
        <Link to='/profile'>

        {currentUser ? (
            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile Pic'></img>
        ):(
            <li className='text-slate_700'>Sign In</li>
        )}
        </Link>
    </ul>
    </div>
   </header>
  )
}
