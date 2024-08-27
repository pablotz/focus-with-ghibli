/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import '../assets/styles/youtubeEmbeded.css'
import ReactPlayer from 'react-player/youtube'
import { useSelector } from "react-redux";


const playlistsList = [
    'Sx4xVyXHl60',
    '2S7Srjm4RzE',
    '6dLWFa0UBiU',
    'v5RHMpe7Xbs',
    'PHklnuOvxfg'
]

const randomPlaylist = () => {
    const randomIndex = Math.floor(Math.random() * playlistsList.length);
    return `https://www.youtube.com/watch?v=${playlistsList[randomIndex]}`
}

// eslint-disable-next-line react/prop-types
const YoutubeEmbedded = () => {
    const { minutes, seconds, isActive } = useSelector(state => state.timer);
    const [selectedVideo, setSelectedVideo] = useState(randomPlaylist());
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlaying = () => {
        setIsPlaying(!isPlaying);
    }

    const getNewVideo = () => {
        let getNewVideo = randomPlaylist();
        // Making sure get a video different than the actual
        while (getNewVideo === selectedVideo) {
            getNewVideo = randomPlaylist();
        }
        setSelectedVideo(getNewVideo)
        setIsPlaying(true)
    }

    useEffect(() => {
        if(
            minutes === '00' && 
            seconds === '00' && 
            isActive &&
            isPlaying) {
                setIsPlaying(false);
            }
    }, [minutes, seconds]);

  return (
        <div>
            <div className="absolute top-0 right-0 pt-8 z-50">
                <button onClick={() => handlePlaying()}>
                    {
                        isPlaying === true ?
                        <svg className="icon icon-tabler icon-tabler-volume-2" viewBox="0 0 24 24" stroke-width="2" stroke="#F5F5DC" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>
                        :
                        <svg className="icon icon-tabler icon-tabler-volume-3" viewBox="0 0 24 24" stroke-width="2" stroke="#F5F5DC" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" /></svg>
                        
                    }
                </button>
            </div>
            <div className='youtube-container'>
                <ReactPlayer 
                    url={selectedVideo} 
                    playing={isPlaying}
                    volume={0.3}
                    onEnded={() => { getNewVideo() }}
                />
            </div>
        </div>
  )
}

export default YoutubeEmbedded