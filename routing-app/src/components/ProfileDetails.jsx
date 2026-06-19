import React from 'react'
import { useParams } from 'react-router-dom'

function ProfileDetails() {
    const param = useParams()
  return (
    <div>ProfileDetails: {param.id}</div>
  )
}

export default ProfileDetails
