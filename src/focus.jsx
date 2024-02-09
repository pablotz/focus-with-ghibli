import { useSelector } from 'react-redux';
import Timer from './components/timer'
import ControlTimer from './components/controlTimer.jsx';


const Focus = () => {
  const { isActive } = useSelector(state => state.timer);
  return (
    <div className={`${isActive ? "start-timer pt-80" : "idle-timer pt-96"} timer-container  flex justify-center `}>
        <div>
          <Timer />
        </div>
        <div>
          <ControlTimer />
        </div>
    </div>
  )
}

export default Focus