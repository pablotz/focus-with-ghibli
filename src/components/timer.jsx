import '../assets/styles/timer.css'
import { useState, useEffect } from 'react'
import calculateTimer from '../utils/calculateTimer';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActive, setMinutes, setSeconds } from '../redux/slices/timerSlice';

const Timer = () => {

    const { isActive, minutes, seconds, selectedMinutes } = useSelector(state => state.timer);
    const dispatch = useDispatch();
  
    const getTime = (deadline) => {
        const time = Date.parse(deadline) - Date.now();
        setMinutes();
        dispatch(setMinutes(Math.floor((time / 1000 / 60) % 60)))
        dispatch(setSeconds(Math.floor((time / 1000) % 60)));
    };
  
    
    const timerControl = () => {
        if(selectedMinutes < 10) return;
        if(isActive){
            dispatch(toggleActive())
        } else {
            dispatch(toggleActive())
            setMinutes(0)
            setSeconds(0)
        }
        
    }

    useEffect(() => {
        
        if(isActive) {
            let deadline = calculateTimer(selectedMinutes)
            getTime(deadline);
            const interval = setInterval(() => getTime(deadline), 1000);
            return () => clearInterval(interval);
        }
    }, [isActive, selectedMinutes]);

  return (
    <div id={isActive ? "start-timer" : "idle-timer"}   className='timer-container pt-80 flex items-center justify-center'>
        <div>
            <div>
                <h1
                    className='timer-counter'
                    id={isActive ? 'timer-started' : 'timer-sleep' }
                >
                    {
                        isActive ? `${minutes}:${seconds}` : `${selectedMinutes}:00` 
                    }
                </h1>   
            </div>
            <div className='flex items-center justify-center'>
                <button onClick={() => timerControl()}>Start</button>
            </div>
        </div>
    </div>
  )
}

export default Timer