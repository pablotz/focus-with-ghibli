import React from 'react'
import { timerControl } from '../utils/calculateTimer'

const ControlTimer = () => {
  return (
        <button onClick={() => timerControl()}>Start</button>
  )
}

export default ControlTimer