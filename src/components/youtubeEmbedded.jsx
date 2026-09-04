/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import '../assets/styles/youtubeEmbeded.css'
import ReactPlayer from 'react-player/youtube'
import { useDispatch, useSelector } from "react-redux";
import { setMusicOn, setVolume } from '../redux/slices/timerSlice';


const playlistsList = [
    'R6MNlWagZhk',
    '2S7Srjm4RzE',
    '6dLWFa0UBiU',
    'v5RHMpe7Xbs',
    'PHklnuOvxfg',
    'IbvdkEVf3Nw'
]

const randomPlaylist = () => {
    const randomIndex = Math.floor(Math.random() * playlistsList.length);
    return `https://www.youtube.com/watch?v=${playlistsList[randomIndex]}`
}

const YoutubeEmbedded = () => {
    const { minutes, seconds, isActive, musicOn, volume } = useSelector(state => state.timer);
    const dispatch = useDispatch();
    const [selectedVideo, setSelectedVideo] = useState(randomPlaylist());
    const [isPlaying, setIsPlaying] = useState(musicOn);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleMusicToggle = () => {
        const next = !musicOn;
        dispatch(setMusicOn(next));
        setIsPlaying(next);
    }

    const handleVideoEnd = () => {
        let nextVideo = randomPlaylist();
        // Making sure get a video different than the actual
        while (nextVideo === selectedVideo) {
            nextVideo = randomPlaylist();
        }
        setSelectedVideo(nextVideo)
        setIsPlaying(true)
    }

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        } else {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }

    useEffect(() => {
        const onChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    useEffect(() => {
        if(
            minutes === '00' && 
            seconds === '00' && 
            isActive &&
            isPlaying) {
                setIsPlaying(false);
            }
    }, [minutes, seconds, isActive, isPlaying]);

  return (
        <div>
            <div className="absolute top-0 right-0 pt-8 pr-2 z-50">
                <div className="controls-container">
                    {musicOn && (
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
                            aria-label="Music volume"
                            className="volume-slider"
                        />
                    )}
                    <button className="icon-button" onClick={() => handleMusicToggle()} aria-pressed={musicOn} aria-label={musicOn ? 'Mute music' : 'Play music'}>
                        {
                            musicOn === true ?
                            <svg className="icon icon-tabler icon-tabler-volume-2" viewBox="0 0 24 24" stroke-width="2" stroke="#F5F5DC" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>
                            :
                            <svg className="icon icon-tabler icon-tabler-volume-3" viewBox="0 0 24 24" stroke-width="2" stroke="#F5F5DC" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" /></svg>
                            
                        }
                    </button>
                    <button className="icon-button" onClick={() => toggleFullscreen()} aria-pressed={isFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                        {
                            isFullscreen === true ?
                            <svg className="icon icon-tabler icon-tabler-minimize" viewBox="0 0 24 24" stroke-width="2" stroke="#F5F5DC" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4v4a1 1 0 0 1 -1 1h-4" /><path d="M15 4v4a1 1 0 0 0 1 1h4" /><path d="M9 20v-4a1 1 0 0 0 -1 -1h-4" /><path d="M15 20v-4a1 1 0 0 1 1 -1h4" /></svg>
                            :
                            <svg className="icon icon-tabler icon-tabler-maximize" viewBox="0 0 24 24" stroke-width="2" stroke="#F5F5DC" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 9v-5a1 1 0 0 1 1 -1h5" /><path d="M20 9v-5a1 1 0 0 0 -1 -1h-5" /><path d="M4 15v5a1 1 0 0 0 1 1h5" /><path d="M20 15v5a1 1 0 0 1 -1 1h-5" /></svg>
                        }
                    </button>
                </div>
            </div>
            <div className='youtube-container'>
                <ReactPlayer 
                    url={selectedVideo} 
                    playing={isPlaying}
                    volume={volume}
                    onEnded={() => { handleVideoEnd() }}
                />
            </div>
        </div>
  )
}

export default YoutubeEmbedded