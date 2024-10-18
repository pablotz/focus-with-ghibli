import { setMinutes, setSeconds, toggleActive } from "../redux/slices/timerSlice";
import { store } from "../redux/store";
import cancelSound from '../assets/sounds/cancel.ogg'
import completeSound from '../assets/sounds/completed.wav'

let { dispatch, getState } = store;


const playComplete = () => {
    const audio = new Audio(completeSound);
    audio.volume = 0.3
    audio.play();
};

// This function will return how many minutes the timer will be active
export const getDeadline = (minutes) => {
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

// This function will return the time that will be displayed on the timer
export const getTime = (deadline) => {
    const { isActive } = getState().timer;
    
    const time = Date.parse(deadline) - Date.now();
    let minutes = Math.floor((time / 1000 / 60) % 60);
    let seconds = Math.floor((time / 1000) % 60);

    // If the timer is still active will keep updating the time
    if((minutes >= 0 || seconds >= 0) && isActive) {
        
        let formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
        let formattedSeconds = (seconds < 10) ? '0' + seconds : seconds;
      
        // Time will be displayed at page title
        document.title = `${formattedMinutes}:${formattedSeconds} | Focus with Ghibli`;

        dispatch(setMinutes(formattedMinutes))
        dispatch(setSeconds(formattedSeconds));
    } else {
        // Once the timer is done will change the state
        isActive && dispatch(toggleActive()) 
        playComplete()
        return 'finish';
    }
};

// This function will start the timer
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


const playCancel = () => {
    const audio = new Audio(cancelSound);
    audio.play();
};

export const timerControl = () => {
    const { isActive, selectedMinutes } = getState().timer;
    if(selectedMinutes < 10) return;
    
    if(isActive){
        // Click on stop
        console.debug('[TIMER]: IS ACTIVE')
        dispatch(toggleActive())
        playCancel()
    } else {
        console.debug('[TIMER]: IS NOT ACTIVE')
        dispatch(toggleActive());
    }
    
}

