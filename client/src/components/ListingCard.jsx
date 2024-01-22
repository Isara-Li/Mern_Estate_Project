import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingCard({ listing }) {
  return (           // Transition slows down the hover effect. Overflwow-hidden hides the overflow of the image. w-full makes the image full width. object-cover makes the image cover the whole div. hover:scale-105 makes the image scale up by 5% on hover. transition-scale makes the transition smooth. duration-300 makes the transition last 300ms. truncate makes the text overflow with ellipsis. line-clamp-2 makes the text overflow with ellipsis after 2 lines. gap-4 makes the gap between the elements 4px. font-bold makes the text bold. text-xs makes the text size extra small. text-slate-700 makes the text color slate-700. text-gray-600 makes the text color gray-600. text-green-700 makes the text color green-700. text-lg makes the text size large. text-sm makes the text size small. text-slate-500 makes the text color slate-500. text-slate-700 makes the text color slate-700. h-4 makes the height 4px. w-4 makes the width 4px. h-[320px] makes the height 320px. sm:h-[220px] makes the height 220px on small screens.
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] 
          }
          alt='listing cover'                                // hover scales the image up by 5% on hover. transition makes the transition smooth. duration-300 makes the transition last 300ms.
          // truncate makes the text overflow with ellipsis.
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'> 
          <p className='truncate text-lg font-semibold text-slate-700'> 
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
            LKR
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'} 
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}