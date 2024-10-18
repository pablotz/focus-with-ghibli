import React, { useEffect } from 'react'
import '../assets/styles/button.css'
import { timerControl } from '../utils/calculateTimer'
import { useSelector } from 'react-redux';

const ControlTimer = () => {
    const { isActive } = useSelector(state => state.timer);
    
    return (
            <button className={`button-30 ${isActive ? 'stop' : 'start' }`} onClick={() => timerControl()}>
                {
                    isActive ? 
                    'Stop' : 'Start'
                }
            </button>
    )
}

export default ControlTimer