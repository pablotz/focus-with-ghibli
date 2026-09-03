import '../assets/styles/timer.css'
import { timerWork } from '../utils/calculateTimer';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

const Timer = () => {

    const { isActive, paused, minutes, seconds, selectedMinutes } = useSelector(state => state.timer);
    const [statusMessage, setStatusMessage] = useState('');
    const statusRef = useRef('idle');

    useEffect(() => {
        let next;
        if(isActive && !paused) next = 'running'
        else if(isActive && paused) next = 'paused'
        else next = 'idle'

        if(next !== statusRef.current) {
            statusRef.current = next
            setStatusMessage({
                running: 'Timer started',
                paused: 'Timer paused',
                idle: 'Session finished'
            }[next])
        }
    }, [isActive, paused]);

    useEffect(() => {
        if(isActive && !paused) {
            return timerWork()
        }
        if(!isActive) {
            document.title = 'Focus With Ghibli'
        }
    }, [isActive, paused]);

  return (
    <>
        <h1
            className='timer-counter'
            id={isActive ? 'timer-started' : 'timer-sleep' }
            role="timer"
        >
            {
                isActive ? `${minutes}:${seconds}` : `${selectedMinutes}:00` 
            }
        </h1>
        <span className="sr-only" aria-live="polite">{statusMessage}</span>
    </>
  )
}

export default Timer