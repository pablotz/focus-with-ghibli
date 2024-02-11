import { styled } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMinutes } from '../redux/slices/timerSlice';


const PrettoSlider = styled(Slider)({
    color: '#F5F5DC',
    height: 10,
    '& .MuiSlider-track': {
      border: 'none',
      backgroundColor: '#ffffd1'
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#F5F5DC',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&::before': {
        display: 'none',
      },
    },
});

const StepSlider = () => {
    const { selectedMinutes } = useSelector(state => state.timer);
    const dispatch = useDispatch();
    

    const handleTimerChange = (value) => {
        dispatch(setSelectedMinutes(value))
    }
    
    return (
        <PrettoSlider
            value={selectedMinutes}
            min={10}
            max={60}
            step={5}
            valueLabelDisplay="off"
            onChange={(e) => {
                handleTimerChange(e.target.value)
            }}
        />
    )
}

export default StepSlider