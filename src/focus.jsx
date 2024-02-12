import { useSelector } from 'react-redux';
import Timer from './components/timer'
import ControlTimer from './components/controlTimer.jsx';
import StepSlider from './components/stepSlider.jsx';
import './assets/styles/timer.css'

const Focus = () => {
  const { isActive } = useSelector(state => state.timer);
  return (
    <div className={`${isActive ? "start-timer" : "idle-timer"} timer-container`}>
        <div className='w-full flex flex-col place-content-center place-items-center'>
          <Timer />
        </div>
        <div className='slider-container' style={{display: isActive ? 'none' : 'block'}}>
          <StepSlider />
        </div>
        <div className='control-container w-full flex flex-col place-content-center place-items-center'
              style={{marginTop: isActive ? '0em' : '2em'}}
        >
          <ControlTimer />
        </div>
    </div>
  )
}

export default Focus