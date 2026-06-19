import React from 'react'
import { useDispatch } from 'react-redux'
import { addBall } from '../features/matchSlice'

function SetBalls() {
    const dispatch = useDispatch()
    return (
        <div>
            <button onClick={() => {
                dispatch(addBall())
            }}>
                +1 Ball
            </button>
        </div>
    )
}

export default SetBalls
