// components/Profile.tsx
import React from 'react'

export const Profile: React.FC = () => {
  const image = '/src/assets/Profile/profile_img.svg'
  const text_bold_color = 'text-gray-700'
  const text_profile_color = 'text-gray-600'
  return (
    <div className='mx-auto my-10 max-w-2xl rounded bg-white p-10'>
      <img
        src={image} // Replace with your avatar image source
        alt='Avatar'
        className='mb-8 w-full'
      />

      <div className='space-y-6'>
        <div>
          <h2 className={`mb-2 mb-2 text-2xl font-bold ${text_bold_color}`}>Manage your personal information</h2>
        </div>
        <div>
          <h1 className={`mb-2 mb-2 border-b-2 border-gray-300 pb-2 text-xl font-semibold  ${text_bold_color}`}>
            About
          </h1>
        </div>
        <div>
          <label className='mb-2 block' htmlFor='bio'>
            <p className={`${text_profile_color} font-semibold`}>Username</p>
          </label>
          <input className='w-full resize-none rounded border-4 p-2 mb-2' />
          <label className='mb-2 block' htmlFor='bio'>
            <p className={`${text_profile_color} font-semibold`}>Bio</p>
          </label>
          <textarea id='bio' className='w-full rounded border-4 p-2 mb-2 resize-y ' rows={4} />
        </div>
      </div>
    </div>
  )
}