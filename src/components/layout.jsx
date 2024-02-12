/* eslint-disable react/prop-types */
import {useState, useEffect} from 'react'
import { getRandomImage } from '../utils/setBackground';
import '../assets/styles/layout.css'
import { useSelector } from 'react-redux';
import Focus from '../focus';
import YoutubeEmbedded from './youtubeEmbedded';

const Layout = () => {
    
    const [background, setBackground] = useState(getRandomImage());
    useEffect(() => {
        setInterval(() => {
            setBackground(getRandomImage());
        }, 60 * 1000);
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

Layout.propTypes = {
    
}

export default Layout