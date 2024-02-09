import '../assets/styles/timer.css'
import { timerWork } from '../utils/calculateTimer';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Timer = () => {

    const { isActive, minutes, seconds, selectedMinutes } = useSelector(state => state.timer);

    useEffect(() => {
        if(isActive) {
            timerWork()
        }
    }, [isActive]);

  return (
    <h1
        className='timer-counter'
        id={isActive ? 'timer-started' : 'timer-sleep' }
    >
        {
            isActive ? `${minutes}:${seconds}` : `${selectedMinutes}:00` 
        }
    </h1>   
  )
}

export default Timer