import '../assets/styles/button.css'
import { stopTimer, timerControl } from '../utils/calculateTimer'
import { useSelector } from 'react-redux';

const ControlTimer = () => {
    const { isActive, paused } = useSelector(state => state.timer);
    
    if(!isActive) {
        return (
            <button className="button-30 start" onClick={() => timerControl()}>
                Start
            </button>
        )
    }

    return (
        <div className="flex gap-8">
            <button className="button-30 stop" onClick={() => timerControl()}>
                { paused ? 'Resume' : 'Pause' }
            </button>
            <button className="button-30 stop" onClick={() => stopTimer()}>
                Stop
            </button>
        </div>
    )
}

export default ControlTimer