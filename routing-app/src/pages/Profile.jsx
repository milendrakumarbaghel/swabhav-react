import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Profile() {
  // use search params to get the optional from the url
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  return (
    <>
    <div>Profile: {searchParams.get('name')}</div>
    <button onClick={() => navigate('/home')}>Home</button>
    <button onClick={() => navigate(-1)}>Back</button>
    </>
  )
}

export default Profile
