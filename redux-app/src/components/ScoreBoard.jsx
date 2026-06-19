import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRun } from '../features/matchSlice'

function ScoreBoard() {
  const dispatch = useDispatch()
  const {runs, wickets, overs} = useSelector(state => state.match)
  const {playerRuns, playerWickets} = useSelector(state => state.player)

  return (
    <div>
      <p>Score Board</p>
      <p>Match Score: Runs: {runs} | Wickets: {wickets} | Overs: {overs}</p>
      <p>Players Score: Runs: {playerRuns} | Wickets: {playerWickets}</p>

      <button onClick={() => {
        dispatch(addRun(1))
      }}>
        +1 Run
      </button>
    </div>
  )
}

export default ScoreBoard
