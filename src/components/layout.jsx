import {useState, useEffect, useRef} from 'react'
import { getRandomImage } from '../utils/setBackground';
import '../assets/styles/layout.css'
import { useSelector } from 'react-redux';
import Focus from '../focus';
import YoutubeEmbedded from './youtubeEmbedded';

const Layout = () => {
    
    const [background, setBackground] = useState(getRandomImage());
    const backgroundRef = useRef(background);
    const nextRef = useRef(null);

    const preloadNext = () => {
        let next = getRandomImage();
        while (next === backgroundRef.current) next = getRandomImage();
        const img = new Image();
        img.src = next;
        nextRef.current = next;
    };

    useEffect(() => {
        preloadNext();
        const interval = setInterval(() => {
            backgroundRef.current = nextRef.current || getRandomImage();
            setBackground(backgroundRef.current);
            preloadNext();
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const { isActive } = useSelector(state => state.timer);


  return (
    <div>
        <div className={`background ${isActive ? 'ghibli-background-start': ''}`} style={{ backgroundImage: `url(${background})`}}>
        </div>
        <div>
          <YoutubeEmbedded />
        </div>
        <Focus />
    </div>
  )
}

export default Layout