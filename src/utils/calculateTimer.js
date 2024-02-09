import { setMinutes, setSeconds, toggleActive } from "../redux/slices/timerSlice";
import { store } from "../redux/store";

let { dispatch, getState } = store;
export const getDeadline = (minutes) => {
    // The min time will be 10 minutes
    // 10 - 10 minutes
    // 11 - 11 minutes
    // 12 - ...
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

export const getTime = (deadline) => {
    const { isActive } = getState().timer;
    const time = Date.parse(deadline) - Date.now();
    let minutes = Math.floor((time / 1000 / 60) % 60);
    let seconds = Math.floor((time / 1000) % 60);

    if(isActive) {
        if(minutes >= 0 || seconds >= 0) {
        
            let formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
            let formattedSeconds = (seconds < 10) ? '0' + seconds : seconds;
          
            dispatch(setMinutes(formattedMinutes))
            dispatch(setSeconds(formattedSeconds));
        } else {
            dispatch(toggleActive())
            return 'finish';
        }
    } else {
        return 'finish';
    }
};

export const timerWork = () => {
    const { selectedMinutes } = getState().timer;
    let deadline = getDeadline(selectedMinutes)
    getTime(deadline);
    // Start an interval that will count until the timer is on 0
    const interval = setInterval(() => {
        let time = getTime(deadline)
        if(time === 'finish') {
            clearInterval(interval);
        }
    }, 1000
    );
    return () => clearInterval(interval);
}

export const timerControl = () => {
    const { isActive, selectedMinutes } = getState().timer;
    if(selectedMinutes < 10) return;
    
    if(isActive === false){
        dispatch(toggleActive());
        dispatch(setMinutes(0));
        dispatch(setSeconds(0));
    } else {
        dispatch(toggleActive());
    }
    
}

