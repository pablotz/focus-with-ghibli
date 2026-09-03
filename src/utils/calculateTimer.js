import { setMinutes, setPaused, setSeconds, toggleActive } from "../redux/slices/timerSlice";
import { store } from "../redux/store";
import cancelSound from '../assets/sounds/cancel.ogg'
import completeSound from '../assets/sounds/completed.wav'

let { dispatch, getState } = store;
let deadline = null;
let interval = null;
let remainingMs = null;


const playComplete = () => {
    const audio = new Audio(completeSound);
    audio.volume = 0.3
    audio.play().catch(() => {});
};

const playCancel = () => {
    const audio = new Audio(cancelSound);
    audio.play().catch(() => {});
};

const clearCountdown = () => {
    if(interval) {
        clearInterval(interval);
        interval = null;
    }
};

const requestNotificationPermission = () => {
    if(!('Notification' in window)) return;
    if(Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
    }
};

const notifyCompletion = () => {
    if(!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
        new Notification('Focus session complete', {
            body: 'Great job! Take a break.',
            icon: '/Totoro.svg'
        });
    } catch { /* ignore notification errors */ }
};

// This function will return how many minutes the timer will be active
export const getDeadline = (minutes) => {
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

// Updates the store with the remaining time
const updateTimer = () => {
    const { isActive, paused } = getState().timer;
    const time = deadline ? Date.parse(deadline) - Date.now() : -1;

    // If the timer is still active will keep updating the time
    if(time >= 0 && isActive && !paused) {
        
        let minutes = Math.floor((time / 1000 / 60) % 60);
        let seconds = Math.floor((time / 1000) % 60);
        let formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
        let formattedSeconds = (seconds < 10) ? '0' + seconds : seconds;
      
        // Time will be displayed at page title
        document.title = `${formattedMinutes}:${formattedSeconds} | Focus with Ghibli`;

        dispatch(setMinutes(formattedMinutes))
        dispatch(setSeconds(formattedSeconds));
        return;
    }

    // Once the timer is done will change the state
    if(isActive && !paused) {
        clearCountdown()
        dispatch(toggleActive())
        playComplete()
        notifyCompletion()
        deadline = null;
    }
};

// This function will start (or resume) the timer
export const timerWork = () => {
    const { selectedMinutes } = getState().timer;

    if(remainingMs !== null) {
        // Resume: rebuild the deadline from the time left when paused
        deadline = new Date(Date.now() + remainingMs);
        remainingMs = null;
    } else {
        deadline = getDeadline(selectedMinutes);
    }

    updateTimer();
    interval = setInterval(updateTimer, 1000);
    return clearCountdown;
}

// Primary control: Start / Pause / Resume
export const timerControl = () => {
    const { isActive, paused, selectedMinutes } = getState().timer;
    if(selectedMinutes < 10) return;
    
    if(!isActive) {
        // Click on start
        console.debug('[TIMER]: IS NOT ACTIVE')
        requestNotificationPermission()
        dispatch(setPaused(false))
        dispatch(toggleActive())
        return
    }

    if(paused) {
        // Click on resume
        dispatch(setPaused(false))
        return
    }

    // Click on pause
    console.debug('[TIMER]: IS ACTIVE')
    remainingMs = Math.max(0, Date.parse(deadline) - Date.now())
    deadline = null
    clearCountdown()
    dispatch(setPaused(true))
}

export const stopTimer = () => {
    const { isActive } = getState().timer;
    if(!isActive) return;

    clearCountdown()
    deadline = null
    remainingMs = null
    dispatch(setPaused(false))
    dispatch(toggleActive())
    playCancel()
}