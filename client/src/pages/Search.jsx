import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchterm: '',
        type:'all',
        parking: false,
        furnished: false,
        offer : false,
        sort : 'createdAt',
        order : 'desc'
    })
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    console.log(listings)

    const handleChange = (e) => {
        if(e.target.id == 'all' || e.target.id == 'rent' || e.target.id == 'sell'){
            setSidebarData({...sidebarData, type: e.target.id})
    }
        else if(e.target.id == 'parking' || e.target.id == 'furnished' || e.target.id == 'offer'){
            setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
        }
        else if(e.target.id == 'sort_order'){
            const [sort, order] = e.target.value.split('_')
            setSidebarData({...sidebarData, sort, order})
        }
        else if(e.target.id == 'searchterm'){
            setSidebarData({...sidebarData, searchterm: e.target.value})
        }
        else{
            setSidebarData({...sidebarData, [e.target.id]: e.target.value})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        for(const [key, value] of Object.entries(sidebarData)){
            urlParams.set(key, value)
        }
        const searchQuery = urlParams.toString()    
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => { // Due to this part of the code, items on the left will change based on the changes in the URL
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchterm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    
        if (
          searchTermFromUrl ||
          typeFromUrl ||
          parkingFromUrl ||
          furnishedFromUrl ||
          offerFromUrl ||
          sortFromUrl ||
          orderFromUrl
        ) {
        setSidebarData({
            searchterm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
          });
        }
    
        const fetchListings = async () => {
          setLoading(true);
          const searchQuery = urlParams.toString();
          const res = await fetch(`/server/listing/get?${searchQuery}`);
          const data = await res.json();
          setListings(data);
          setLoading(false);
        };
        
    
        fetchListings();
      }, [location.search]);
  return (
    <div className='flex flex-col md:flex-row'> {/* flex is a display property that allows us to align items horizontally or vertically */}
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label> {/* whitespace-nowrap is a tailwind class that prevents text from going to two lines */}
            <input
              type='text'
              id='searchterm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
                onChange={handleChange}
                value={sidebarData.searchterm}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sidebarData.type=='all'} />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebarData.type=='rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='sell' className='w-5' onChange={handleChange} checked={sidebarData.type=='sell'} />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sidebarData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sidebarData.parking}/>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={sidebarData.furnished}/>
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select 
            onChange={handleChange}
            defaultValue={'createdAt_desc'}
            id='sort_order' className='border rounded-lg p-3'>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-70'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}

         
        </div>
      </div>
    </div>
  );
}