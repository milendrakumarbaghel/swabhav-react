import React from 'react'
import { useDispatch } from 'react-redux'
import { addWicket } from '../features/matchSlice'

function SetWickets() {
    const dispatch = useDispatch()

    return (
        <div>
            <button onClick={() => {
                dispatch(addWicket(1))
            }}>
                +1 Wicket
            </button>

        </div>
    )
}

export default SetWickets
