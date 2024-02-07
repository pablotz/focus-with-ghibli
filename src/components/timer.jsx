import '../assets/styles/timer.css'
import { timerControl, timerWork } from '../utils/calculateTimer';
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
    <div className={`${isActive ? "start-timer pt-80" : "idle-timer pt-96"} timer-container  flex items-center   justify-center`}>
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